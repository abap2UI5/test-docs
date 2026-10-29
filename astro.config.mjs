// abap2UI5 for decision makers - one static page, published by GitHub Pages at
// https://abap2ui5.github.io/why/ (.github/workflows/pages.yml).
//
// Static output only: no client component, no island, no script at all; the
// policy is `script-src 'self'` (src/layouts/Page.astro), and
// test/site.test.mjs fails a build with any script.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://abap2ui5.github.io",
  base: "/why/",
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
