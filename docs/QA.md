# Verification — 2026-09-24

## Automated results

- `npm test`: **12/12 passed** on Node.js 22.16.
- `npm run build`: **passed**; seven public files, no source notes/secrets bundled.
- Chromium browser suite: **PASS**. Detailed results: `docs/browser-report.json`.
- Viewports: **320, 360, 390, 700, 768, 820, 1024, 1440 px**.
- All four recommendation states at each width; no horizontal document overflow or JavaScript errors.
- Incorrect/correct/reset demo states and reset focus return.
- Mobile menu opening/closing, Escape, destination focus; desktop toggle is hidden.
- Native radio keyboard navigation, five FAQ disclosures, reduced-motion behavior.
- No-JavaScript fallback at **320, 390, 768 and 1440 px**.
- Server tests use real loopback HTTP for root/project-subpath assets, HEAD, 404, source-file protection and rejected POST.

Browser tests in this environment loaded the exact HTML/CSS/JS inline because browser URL navigation was restricted. They verify rendering and interaction, not delivery through a live host/CDN. A successful browser suite is not a claim of real-device Safari/Firefox testing or WCAG certification.

## Visual review

Desktop and mobile screenshots inspected, including hero, product cards and Lab guide. A decorative ellipse initially caused narrow-screen horizontal overflow; its rotation was removed and the eight-width suite rerun successfully. The mobile hanging headline indent is bounded so it cannot cross the viewport edge.

## Product/launch boundaries

- All app feature claims were checked against current repository documentation and release notes (see `CONTENT_SOURCES.md`).
- Product illustrations and demo data are labelled as illustrative.
- Public application URLs, prices, commercial readiness, cross-app auto-sync and validated learning outcomes are not invented.
- No personal user details, keys, local filesystem paths, private-repository URLs or source notes are shipped in `dist/`.
- Public availability wording needs an intentional update when real user access is ready.
- Hosting deployment success and the live URL must be checked separately in GitHub Actions/Pages.
