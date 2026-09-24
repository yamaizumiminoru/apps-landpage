# Language Labs — four-app landing page

Japanese landing page for **Annotator-Connotator**, **Sprint Lab**, **Pronunciation Lab**, and **Speaking Lab**.

> **「通じる」の、その先へ。**
> 知っている。けれど、とっさに使えない。そんなノビシロを、AIと見つけて鍛える。

The umbrella label **Language Labs** is presentation copy, not an established new product name or a trademark claim. The four existing product names are preserved.

## What is included

- Responsive editorial design: warm paper, dark ink, terracotta accent, four product-specific colors.
- The four requested principles: intermediate → advanced refinement; knowledge → use; learner-specific growth targets; personally interesting materials.
- Four product introductions with explicitly illustrative UI previews.
- A working two-answer Verb Frame mini-demo, including retry/correct/reset states.
- A four-choice **自分に合うLabは？** guide. This is deterministic editorial routing, not an AI/proficiency diagnosis.
- An example learning journey that does **not** imply completed automatic cross-app integration.
- FAQ, language/AI limitations, development status, metadata, favicon, custom 404.
- Native keyboard controls, mobile navigation, Escape/focus handling, reduced-motion support and a readable no-JavaScript fallback.
- No runtime dependencies, external fonts, analytics, recording, API calls, cookies, signup backend, fabricated testimonials or unconfirmed prices.

## Run locally

Node.js 22 or newer; `npm install` is unnecessary.

```sh
npm run dev
# Open http://127.0.0.1:4175/apps-landpage/

npm test
npm run build
npm run preview
```

The loopback-only preview server serves an explicit public-file allowlist. It does not serve `.git`, docs, tests or secrets. Set `PORT` to choose another port.

The built `dist/` contains only the seven public static files. It is suitable for static hosting. `index.html` also uses relative assets, so ordinary file-based previews work where browser policy permits them.

## GitHub Pages

The workflow always tests and builds the site, then uploads a `site-preview` artifact. It deploys only when the repository variable `PAGES_ENABLED` equals `true`.

1. In **Settings → Pages**, select **GitHub Actions** as the source.
2. Set repository variable **PAGES_ENABLED = true**.
3. Run **Validate and publish landing page**, or push to `main`.
4. Use the **actual deployment URL** reported by the successful `deploy` job.

The intended project path is `/apps-landpage/`. If the host or base path changes, update the link in `404.html` and the preview server's optional base path.

A private repository needs a GitHub plan that supports private-repository Pages. Do not change this repository's visibility to make a deployment succeed without the owner's explicit approval. The checked-in workflow deliberately leaves deployment disabled until Pages is configured; a green verification job by itself is **not** a live-site confirmation.

Official hosting references:
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Tests

`npm test` runs 12 dependency-free checks: markup and metadata, IDs/anchors, asset paths, all products, guide routes, verified outbound URLs, no network/secret/recording code, status wording, accessibility hooks, JS parsing, the production allowlist, and real HTTP behavior at root and project subpath.

Optional Chromium checks:

```sh
python -m pip install playwright
python -m playwright install chromium
python scripts/browser_check.py --screenshots
# Or, while npm run dev is running:
python scripts/browser_check.py --url http://127.0.0.1:4175/apps-landpage/ --screenshots
```

Set `BROWSER_EXECUTABLE` to use a system Chromium. The default inline mode renders the repository's HTML, CSS and JS without URL navigation for restricted environments; it does not test CDN delivery. HTTP paths are separately exercised by the Node suite. Reports/screenshots are written to ignored `.test-results/`.

## Editing guide

| File | Purpose |
| --- | --- |
| `index.html` | All indexable copy, product previews, FAQ, availability |
| `assets/style.css` | Design tokens, layout, responsive/print/motion rules |
| `assets/guide.js` | Four static starting-point recommendations |
| `assets/app.js` | Menu, mini-demo, accessible recommendation updates |
| `docs/CONTENT_SOURCES.md` | Source snapshots and boundaries on product claims |
| `docs/QA.md` | Verification record and remaining launch checks |

Public application URLs, prices and dates must only be added after confirmation. Do not replace preparation notices with non-working “Start free” buttons. Do not link private application repositories from the public LP. The existing public Annotator-Connotator introduction is the only external product CTA.
