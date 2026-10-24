// What the built page must keep, read off dist/ after `npm run build`.
// node:test, no browser: the page is static HTML, so the properties worth
// holding are in the file - the addresses other sites link to, the policy,
// no script, and nothing that points at a file that is not there.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DIST = path.join(import.meta.dirname, "..", "dist");
const BASE = "/test-docs/";
const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

test("the eight section ids are the addresses the redirect and the README link to", () => {
  // /docs/evaluate redirects here with its #fragment; the framework's README
  // links #what-you-keep and #when-to-use-it-and-when-not. A renamed id is a
  // dead link somewhere else.
  for (const id of [
    "the-problem-it-answers", "when-to-use-it-and-when-not", "what-you-keep", "where-it-runs",
    "what-it-costs", "the-objections", "who-runs-it", "how-to-evaluate-it-in-a-week",
  ]) assert.match(html, new RegExp(`id="${id}"`), `#${id}`);
});

test("the page runs one script, as a file from this origin, and its policy says so", () => {
  // the cost calculator's public/calc.js - and no inline script beside it
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.equal(scripts.length, 1, "one <script>");
  assert.match(scripts[0][1], /src="\/test-docs\/calc\.js"/);
  assert.equal(scripts[0][2].trim(), "", "the script is a file, not inline");
  assert.ok(fs.existsSync(path.join(DIST, "calc.js")));
  assert.doesNotMatch(html, /\son[a-z]+=/i, "an inline event handler");
  assert.doesNotMatch(html, /\sstyle="/i, "an inline style the policy would refuse");
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
  assert.ok(csp, "a Content-Security-Policy meta");
  assert.match(csp[1], /script-src 'self'(;|$)/);
  assert.match(csp[1], /default-src 'self'/);
});

test("everything the page loads is in dist/, under the base it is published at", () => {
  const refs = [...html.matchAll(/\s(?:src|href)="([^"#]+)"/g)].map((m) => m[1]).filter((u) => u.startsWith("/"));
  assert.ok(refs.length > 5);
  for (const ref of refs) {
    assert.ok(ref.startsWith(BASE), `${ref} is outside ${BASE}`);
    const file = path.join(DIST, ref.slice(BASE.length) || "index.html");
    const target = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, "index.html") : file;
    assert.ok(fs.existsSync(target), `${ref} is not in dist/`);
  }
  // nothing from a CDN: the policy would refuse it anyway
  for (const m of html.matchAll(/\s(?:src)="(https?:[^"]+)"/g)) assert.fail(`loads ${m[1]}`);
  assert.doesNotMatch(html, /rel="stylesheet" href="https?:/);
});

test("the canonical address is the published one", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/abap2ui5\.github\.io\/test-docs\/">/);
});

test("the page speaks to decision makers, not reviewers", () => {
  // the ids stay addresses; the words a reader sees never say "evaluate" or "problem"
  const visible = html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visible, /evaluat|problem/i);
});
