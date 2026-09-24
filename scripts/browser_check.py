"""Optional browser regression checks. Requires Python and playwright.

python -m pip install playwright
python -m playwright install chromium
python scripts/browser_check.py                  # inline, no external requests
python scripts/browser_check.py --url http://127.0.0.1:4175/apps-landpage/
Set BROWSER_EXECUTABLE when using a system Chromium binary.
Inline mode exists for restricted render environments; HTTP delivery is tested
independently by npm test. No AI service or learner data is used.
"""
import argparse
import json
import os
import re
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--url')
parser.add_argument('--screenshots', action='store_true')
args = parser.parse_args()
output = ROOT / '.test-results'
output.mkdir(exist_ok=True)
html = re.sub(r'<script[^>]*src=[^>]*></script>|<link[^>]*>', '', (ROOT / 'index.html').read_text(encoding='utf-8'))
report = {'render_mode': 'url' if args.url else 'inline', 'widths': [], 'checks': []}

def load(page, javascript=True):
    if args.url:
        page.goto(args.url, wait_until='networkidle')
    else:
        styled = html.replace('</head>', '<style>' + (ROOT / 'assets/style.css').read_text(encoding='utf-8') + '</style></head>')
        page.set_content(styled, wait_until='domcontentloaded')
        if javascript:
            for name in ['guide.js', 'app.js']:
                page.add_script_tag(content=(ROOT / 'assets' / name).read_text(encoding='utf-8'))
    if javascript:
        page.evaluate('document.fonts.ready')

def fits(page):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal overflow'

with sync_playwright() as p:
    executable = os.environ.get('BROWSER_EXECUTABLE') or shutil.which('chromium')
    browser = p.chromium.launch(executable_path=executable, args=['--no-sandbox'] if os.name != 'nt' else [])
    for width in [320, 360, 390, 700, 768, 820, 1024, 1440]:
        print(f'Checking viewport {width}', flush=True)
        page = browser.new_page(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
        page.set_default_timeout(5000)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        load(page)
        fits(page)
        for goal, title, target in [('discover','Speaking Lab','speaking'),('retrieve','Sprint Lab','sprint'),('pronounce','Pronunciation Lab','pronunciation'),('understand','Annotator-Connotator','annotator')]:
            page.locator(f'.finder-option:has(input[value="{goal}"])').click()
            assert page.locator('#result-title').inner_text() == title
            assert page.locator('#result-link').get_attribute('href') == '#' + target
            fits(page)
        page.locator('.finder-option:has(input[value="discover"])').click()
        if width <= 700:
            page.locator('.menu-toggle').click()
            assert page.locator('.menu-toggle').get_attribute('aria-expanded') == 'true'
            assert page.locator('#site-nav').is_visible()
            page.keyboard.press('Escape')
            assert page.locator('.menu-toggle').get_attribute('aria-expanded') == 'false'
            assert not page.locator('#site-nav').is_visible()
            assert page.locator('.menu-toggle').evaluate('(element) => document.activeElement === element')
            page.locator('.menu-toggle').click()
            page.locator('#site-nav a[href="#labs"]').click()
            assert not page.locator('#site-nav').is_visible()
            assert page.evaluate('document.activeElement.id') == 'labs'
        else:
            assert not page.locator('.menu-toggle').is_visible()
            assert page.locator('#site-nav').is_visible()
        assert not errors, errors
        report['widths'].append({'width': width, 'overflow': False, 'four_recommendations': True, 'menu': True, 'js_errors': errors})
        page.close()
    report['checks'].append('8 viewport widths x 4 recommendations; desktop/mobile navigation')

    print('Checking demo and FAQ',flush=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    page.set_default_timeout(5000)
    load(page)
    page.locator('[data-answer="to take"]').click()
    assert page.locator('#demo-feedback').get_attribute('data-state') == 'retry'
    page.locator('[data-answer="taking"]').click()
    assert page.locator('#demo-feedback').get_attribute('data-state') == 'correct'
    assert page.locator('#demo-blank').inner_text() == 'taking'
    page.locator('.demo-reset').click()
    assert page.locator('#demo-blank').inner_text() == '_____'
    assert not page.locator('.demo-reset').is_visible()
    assert page.locator('[data-answer="to take"]').evaluate('(el)=>document.activeElement===el')
    report['checks'].append('Mini demo: retry, correct answer, reset, focus return')
    for summary in page.locator('summary').all():
        summary.click()
        assert summary.locator('..').get_attribute('open') is not None
        summary.click()
        assert summary.locator('..').get_attribute('open') is None
    report['checks'].append('5 native FAQ disclosures open/close')
    page.locator('input[name="goal"][value="discover"]').focus()
    page.keyboard.press('ArrowDown')
    assert page.locator('#result-title').inner_text() == 'Sprint Lab'
    assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior') == 'auto'
    report['checks'].append('Native keyboard radio interaction and reduced-motion preference')
    page.close()

    for width in [320,390,768,1440]:
        print(f'Checking no-JS {width}',flush=True)
        context = browser.new_context(viewport={'width':width, 'height':900}, java_script_enabled=False)
        page = context.new_page()
        page.set_default_timeout(5000)
        load(page, javascript=False)
        fits(page)
        assert not page.locator('.menu-toggle').is_visible()
        assert page.locator('#site-nav').is_visible()
        assert not page.locator('.lab-finder').is_visible()
        assert page.locator('.no-script-guide').is_visible()
        assert page.locator('.demo-static').is_visible()
        for product in ['annotator','sprint','pronunciation','speaking']:
            assert page.locator('#' + product).is_visible()
        context.close()
    report['checks'].append('No-JavaScript fallback at 320/390/768/1440px')

    if args.screenshots:
        for width, height, name in [(1440,1000,'desktop'),(390,844,'mobile')]:
            page = browser.new_page(viewport={'width':width,'height':height}, reduced_motion='reduce')
            load(page)
            page.screenshot(path=str(output / f'{name}-full.png'), full_page=True)
            page.screenshot(path=str(output / f'{name}-hero.png'))
            for section in ['concept','annotator','pronunciation','find-your-lab','journey','availability']:
                page.locator('#' + section).evaluate('(el)=>el.scrollIntoView({block:"start"})')
                page.screenshot(path=str(output / f'{name}-{section}.png'))
            page.close()
    browser.close()
report['status'] = 'PASS'
(output / 'browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
