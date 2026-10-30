// What the built page must keep, read off dist/ after `npm run build`.
// node:test, no browser: the page is static HTML, so the properties worth
// holding are in the file - the addresses other sites link to, the policy,
// no script, and nothing that points at a file that is not there.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DIST = path.join(import.meta.dirname, "..", "dist");
const BASE = "/why/";
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

test("the page runs no script, and its policy says so", () => {
  // the FAQ and the folded references are <details>, the header is anchors
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.equal(scripts.length, 0, "no <script>");
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

test("the community page is built, carries no script, and both pages link each other", () => {
  const about = fs.readFileSync(path.join(DIST, "community", "index.html"), "utf8");
  assert.equal([...about.matchAll(/<script\b/gi)].length, 0, "no <script> on the about page");
  assert.match(about, /id="support"/);
  assert.match(about, /id="community"/);
  assert.match(about, /id="idea"/);
  assert.match(html, /href="\/why\/community\/"/, "home links to community");
  assert.match(about, /href="\/why\/#who-runs-it"/, "community links back home");
  for (const ref of [...about.matchAll(/\s(?:src|href)="([^"#]+)"/g)].map((m) => m[1]).filter((u) => u.startsWith("/"))) {
    const file = path.join(DIST, ref.slice(BASE.length) || "index.html");
    const target = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, "index.html") : file;
    assert.ok(fs.existsSync(target), `${ref} is not in dist/`);
  }
});

test("the FAQ page is built, carries no script, and the home page points at it", () => {
  const faq = fs.readFileSync(path.join(DIST, "faq", "index.html"), "utf8");
  assert.equal([...faq.matchAll(/<script\b/gi)].length, 0, "no <script> on the FAQ page");
  assert.ok((faq.match(/<details/g) || []).length >= 12, "the questions are on the FAQ page");
  assert.doesNotMatch(html, /class="faq"/, "no question list on the home page");
  assert.match(html, /href="\/why\/faq\/"/, "home links to the FAQ");
  assert.doesNotMatch(faq, /evaluat|problem/i);
});

test("the canonical address is the published one", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/abap2ui5\.github\.io\/why\/">/);
});

const visible = html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ");

test("the page speaks to decision makers, not reviewers", () => {
  // the ids stay addresses; the words a reader sees never say "evaluate" or "problem"
  assert.doesNotMatch(visible, /evaluat|problem/i);
});

test("the page can be read in a few minutes", () => {
  // a decision maker gives it a few minutes; what does not fit goes into the
  // manual as a link, or folds under a <details>. The ceiling is generous for
  // now - everything goes in first, the trimming pass comes later.
  const open = html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<details[\s\S]*?<\/details>/g, "").replace(/<[^>]+>/g, " ");
  const words = open.trim().split(/\s+/).length;
  assert.ok(words <= 4000, `${words} words on the page`);
});

test("the comparison names where abap2UI5 is not ahead, and the support it has", () => {
  // the rows a reader would otherwise find missing: an even row carries no tick
  assert.ok((html.match(/class="us even"/g) || []).length >= 3, "even rows in the comparison");
  assert.match(visible, /Where something else fits better/);
  assert.match(visible, /Slack/);
  assert.ok((visible.match(/Slack/g) || []).length >= 4, "Slack named where support is");
  assert.doesNotMatch(visible, /best effort|no support/i);
});

test("every cell of a comparison names its column, for the one-card-per-row layout", () => {
  for (const m of html.matchAll(/<td(?![^>]*data-th=)[^>]*>/g)) assert.fail(`a <td> without data-th: ${m[0]}`);
});
