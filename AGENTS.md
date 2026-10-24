# AGENTS.md

abap2UI5 for decision makers: one static page that presents abap2UI5 to IT
management and product owners - what it can build, why it beats every other
UI5 solution on SAP (commercial ones included), what it costs - published at https://abap2ui5.github.io/test-docs/ by GitHub Pages. A
standalone site — its own repository, build and deployment — and nothing in
it depends on abap2UI5/docs or abap2UI5/playground at build time.

## Layout

| Path | Purpose |
| --- | --- |
| `src/pages/index.astro` | The page: the text of every section, as data at the top and markup below |
| `src/layouts/Page.astro` | The document: head, the Content-Security-Policy, the header with the section links, the foot |
| `src/components/` | `Stats` (the headline tiles under the hero), `CostCalculator` (the sheet, after the manual's), `Icon` (inline marks) |
| `public/calc.js` | The cost calculator in the browser - the page's one script; the calculator reads correctly without it |
| `src/styles/global.css` | The one stylesheet; light and dark follow the system |
| `public/` | Font (Inter, self-hosted), logo, icons, the screenshot |
| `test/site.test.mjs` | `node:test` over the built `dist/index.html` |
| `.github/workflows/pages.yml` | Build + test on every PR; deploy on main |

## Commands

```bash
npm ci
npm run dev      # dev server, http://localhost:4321/test-docs/
npm run build    # dist/
npm test         # the tests, against dist/ - build first
npm run check    # build + test, what CI runs
```

## Rules

- **The eight section ids are addresses.** `/docs/evaluate` redirects here
  with its `#fragment`, and the framework's README links `#what-you-keep` and
  `#when-to-use-it-and-when-not`. Reword a heading freely; keep the `id`.
  `test/site.test.mjs` names all eight.
- **One script, as a file.** The policy is `script-src 'self'`: `public/calc.js`
  and nothing inline, no `on…=` handler. Everything else works without it - the
  FAQ is `<details>`, the header is anchors, the calculator's sheet is in the
  page. No inline `style=""` either (`style-src 'self'`) — a class in `global.css`.
- **Nothing from another origin.** No CDN, no web font service, no analytics;
  the font and the images are in `public/`.
- **Written for managers.** No technical counts (tests, specs, gates) and no
  "evaluate" or "problem" in the visible text - `test/site.test.mjs` checks the latter.
- **Toolchain:** Node 22 (`.nvmrc`, `engines`), every dependency pinned
  exactly (astro 7.3.8), actions pinned to commits.
- The site is written for people. Links into the manual are absolute
  (`https://abap2ui5.github.io/docs/...`).
