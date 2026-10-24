// The counted figures - unit tests, specs, browser suites, gates. A reader who
// is deciding wants the size of the thing, and this repository types no number
// of its own: the framework's README carries them between `facts:start` and
// `facts:end`, regenerated there by `npm run facts` and held current by a gate.
//
// Read at build time: from the file EVALUATE_README names (a local clone),
// else from raw.githubusercontent.com. Allowed to fail - no network, a 5xx, a
// README whose block moved - and then the band shows what it can without the
// counts, and the build log says so. It never falls back to a typed number.
import fs from "node:fs";

const README_URL = "https://raw.githubusercontent.com/abap2UI5/abap2UI5/main/README.md";

/* What the block carries that the page does not show as a count: the workflow
 * total (a maintainer's figure), the release spans (shown as their own tiles)
 * and the trailing "counted from this repository by …". */
const SKIP = /workflows|→|counted/;

/** The figures of the block as plain strings - "1,530 ABAP unit tests". */
export function factsIn(readme) {
  const block = String(readme).match(/<!-- facts:start -->([\s\S]*?)<!-- facts:end -->/);
  if (!block) return [];
  const text = block[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.split(/\s·\s/).map((s) => s.trim()).filter((s) => s && !SKIP.test(s));
}

/** "1,530 ABAP unit tests" -> { value: "1,530", label: "ABAP unit tests" }. */
export function splitFact(fact) {
  const m = String(fact).match(/^([\d.,]+\+?)\s+(.+)$/);
  return m ? { value: m[1], label: m[2] } : { value: "", label: fact };
}

let cached;
export async function readFacts() {
  if (cached) return cached;
  let readme = "";
  try {
    if (process.env.EVALUATE_README) {
      readme = fs.readFileSync(process.env.EVALUATE_README, "utf8");
    } else {
      const res = await fetch(README_URL, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      readme = await res.text();
    }
  } catch (err) {
    console.warn(`evaluate: the counted figures were not read (${err.message}) - the page goes out without them`);
  }
  cached = factsIn(readme).map(splitFact);
  if (readme && !cached.length) console.warn("evaluate: the framework README has no facts block - the page goes out without the counts");
  return cached;
}
