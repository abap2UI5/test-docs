// Evaluate abap2UI5 - one static page, published by GitHub Pages at
// https://abap2ui5.github.io/test-docs/ (.github/workflows/pages.yml).
//
// Static output only: no client component, no island. The page's one script
// is the cost calculator's public/calc.js, loaded as a file; the policy is
// `script-src 'self'` (src/layouts/Page.astro), and test/site.test.mjs fails a
// build with any other script.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://abap2ui5.github.io",
  base: "/test-docs/",
  trailingSlash: "ignore",
  build: {
    format: "directory",
    assets: "assets",
    // one stylesheet file, cached, rather than a <style> per page
    inlineStylesheets: "never",
  },
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false },
});
