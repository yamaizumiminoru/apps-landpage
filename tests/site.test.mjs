import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { createSiteServer } from '../scripts/serve.mjs';
import { SCREENSHOT_NAMES } from '../scripts/public-assets.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'assets/style.css'), 'utf8');
const js = await readFile(resolve(root, 'assets/app.js'), 'utf8');
const guide = createRequire(import.meta.url)('../assets/guide.js');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);

test('Japanese document has one h1, metadata and a viewport', () => {
  assert.match(html, /<html lang="ja">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const name of ['description', 'viewport', 'theme-color']) assert.ok(html.includes(`name="${name}"`));
  assert.ok(html.includes('property="og:title"'));
  assert.ok(html.includes('property="og:description"'));
});
test('no duplicate IDs or broken internal anchors', () => {
  assert.equal(new Set(ids).size, ids.length);
  for (const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Missing #${id}`);
});
test('every local stylesheet, script and icon exists and is relative', async () => {
  const links = [...html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)].map(match => match[1]);
  assert.ok(links.length >= 4);
  for (const link of links) await access(resolve(root, link));
  assert.doesNotMatch(html, /(?:src|href)="\/(?:assets|_next)\//);
});
test('all four named products have visible content without JavaScript', () => {
  for (const id of ['annotator','sprint','pronunciation','speaking']) assert.match(html, new RegExp(`id="${id}" aria-labelledby="${id}-title"`));
  for (const name of ['Sprint Lab','Pronunciation Lab','Speaking Lab']) assert.ok(html.includes(name));
  assert.match(html, /Annotator-<wbr>Connotator/);
  assert.match(html, /<noscript>/);
  assert.doesNotMatch(css, /\.reveal\s*\{[^}]*opacity:\s*0/);
});
test('all goal choices map to real product sections', () => {
  const values = [...html.matchAll(/name="goal" value="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(values.sort(), Object.keys(guide).sort());
  for (const result of Object.values(guide)) {
    assert.ok(ids.includes(result.id));
    assert.ok(result.name.length && result.intro.length && result.description.length);
  }
  assert.equal(new Set(Object.values(guide).map(item => item.id)).size, 4);
  assert.ok(Object.isFrozen(guide));
});
test('the only external CTA is the verified public product introduction', () => {
  const external = [...html.matchAll(/href="(https?:\/\/[^\"]+)"/g)].map(match => match[1]);
  assert.ok(external.length > 0);
  for (const url of external) assert.equal(url, 'https://yamaizumiminoru.github.io/Annotator-Connotator-LP/');
  const blanks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map(match => match[0]);
  for (const link of blanks) assert.match(link, /rel="noopener noreferrer"/);
});
test('no credentials, private repository CTA, analytics, recording, or API calls', () => {
  assert.doesNotMatch(html + js, /(?:sk-[A-Za-z0-9]{20,}|getUserMedia|MediaRecorder|XMLHttpRequest|fetch\s*\(|sendBeacon|localStorage|googletagmanager|google-analytics)/);
  assert.doesNotMatch(html, /href="https:\/\/github.com\/yamaizumiminoru\//);
  assert.doesNotMatch(html, /href="https?:\/\/(?:localhost|127\.0\.0\.1)/);
  assert.doesNotMatch(html, /<form[^>]+action=/);
  assert.doesNotMatch(js, /innerHTML\s*=/);
});
test('demo, availability, language limits, AI fallibility and nonautomatic integration are explicit', () => {
  for (const text of ['説明用デモ','AI解析・録音は行いません','一般向けの公開URL・利用料金・開始時期','AIの解説や音声判断には誤り','自動連携を前提','現在の実装では英語が中心']) assert.ok(html.includes(text), text);
});
test('keyboard, screen reader, reduced motion and no-JS hooks are present', () => {
  for (const text of ['skip-link','aria-controls="site-nav"','aria-expanded="false"','aria-live="polite"','<fieldset>','<legend','<summary>']) assert.ok(html.includes(text), text);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /focus-visible/);
  assert.match(js, /event.key === 'Escape'/);
});
test('JavaScript parses cleanly', () => {
  for (const file of ['assets/app.js','assets/guide.js','assets/screenshots.js','scripts/public-assets.mjs','scripts/build.mjs','scripts/serve.mjs']) execFileSync(process.execPath, ['--check', resolve(root, file)]);
});
test('production build exports only the public static allowlist', async () => {
  execFileSync(process.execPath, [resolve(root, 'scripts/build.mjs')]);
  assert.deepEqual((await readdir(resolve(root, 'dist'))).sort(), ['.nojekyll','404.html','assets','index.html'].sort());
  assert.deepEqual((await readdir(resolve(root, 'dist/assets'))).sort(), ['app.js','favicon.svg','guide.js','screenshots','screenshots.js','style.css'].sort());
  assert.equal(await readFile(resolve(root, 'dist/index.html'),'utf8'), html);
});
test('HTTP serves root and Pages subpath, protects source files, and rejects writes', async () => {
  const server = createSiteServer(root);
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ['/', '/apps-landpage/', '/assets/app.js', '/apps-landpage/assets/style.css']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    }
    for (const name of SCREENSHOT_NAMES) {
      for (const variant of [name, name + '-thumb']) {
        const response = await fetch(base + '/apps-landpage/assets/screenshots/' + variant + '.webp');
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('content-type'), 'image/webp');
        assert.ok((await response.arrayBuffer()).byteLength > 1000);
      }
    }
    for (const path of ['/scripts/public-assets.mjs','/assets/screenshots/unreviewed.png','/.git/config','/package.json','/docs/CONTENT_SOURCES.md','/%2e%2e/%2e%2e/etc/passwd','/apps-landpage/unknown']) assert.equal((await fetch(base+path)).status, 404, path);
    assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
    const head = await fetch(base+'/',{method:'HEAD'});
    assert.equal(head.status,200);
    assert.equal(await head.text(),'');
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

test('each product has a responsive real screenshot and accessible enlargement link', () => {
  assert.equal((html.match(/class="app-screenshot"/g) || []).length, 4);
  assert.equal((html.match(/data-screenshot-title=/g) || []).length, 4);
  assert.equal((html.match(/loading="lazy" decoding="async"/g) || []).length, 4);
  for (const name of SCREENSHOT_NAMES) {
    assert.ok(html.includes(`./assets/screenshots/${name}.webp`));
    assert.ok(html.includes(`./assets/screenshots/${name}-thumb.webp 800w`));
  }
  assert.ok(html.includes('Chromeで撮影した開発中アプリの実画面'));
  assert.doesNotMatch(html, /実際のUIとは異なります/);
  assert.match(html, /<dialog[^>]+aria-labelledby="screenshot-title"/);
});
test('the screenshot allowlist includes only the eight reviewed WebP files', async () => {
  const expected = SCREENSHOT_NAMES.flatMap(name => [name + '.webp', name + '-thumb.webp']).sort();
  assert.deepEqual((await readdir(resolve(root, 'dist/assets/screenshots'))).sort(), expected);
  for (const name of expected) {
    const data = await readFile(resolve(root, 'dist/assets/screenshots', name));
    assert.equal(data.toString('ascii', 0, 4), 'RIFF');
    assert.equal(data.toString('ascii', 8, 12), 'WEBP');
    assert.ok(data.length > 1000);
  }
});
test('the enlargement code uses native dialogs without network, tracking or injected HTML', async () => {
  const code = await readFile(resolve(root, 'assets/screenshots.js'), 'utf8');
  assert.match(code, /showModal/);
  assert.match(code, /opener.focus/);
  assert.match(code, /event.metaKey/);
  assert.doesNotMatch(code, /innerHTML|fetch\s*\(|XMLHttpRequest|sendBeacon|getUserMedia|localStorage/);
});
