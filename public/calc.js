// The cost calculator's half in the browser (src/components/CostCalculator.astro
// is the markup, and works without this file). The page's one script, loaded
// as a file from this origin - the policy allows nothing else.
//
// A slider is an index into its stops, so 250,000 users is one step from
// 100,000 rather than at the end of a linear track nobody can aim on. Calculate
// hides the inputs' meaning behind the sheet's answer and shows the sheet; the
// sheet echoes what was chosen and prints the zeros in the chosen currency.
const root = document.querySelector("[data-calc]");
if (root) {
  const results = root.querySelectorAll("[data-result]");
  const button = root.querySelector("[data-calculate]");
  const currency = root.querySelector("[data-currency]");
  const inputs = root.querySelectorAll(".calc-inputs input, .calc-inputs select");

  const words = (input) => {
    const n = Number(input.dataset.stops.split("|")[Number(input.value)]);
    const [one, many] = input.dataset.unit.split("|");
    return `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;
  };
  const echo = (key, text) => root.querySelectorAll(`[data-echo="${key}"]`).forEach((el) => { el.textContent = text; });

  const update = () => {
    root.querySelectorAll("input[type=range]").forEach((input) => {
      const text = words(input);
      root.querySelector(`[data-out="${input.dataset.key}"]`).textContent = text;
      echo(input.dataset.key, text);
    });
    const picked = [...root.querySelectorAll("input[name=calc-release]:checked")].map((i) => i.dataset.choice);
    echo("release", picked.length ? picked.join(", ") : "no system at all");
    echo("support", root.querySelector("input[name=calc-support]:checked")?.dataset.choice || "No support");
    const zero = new Intl.NumberFormat("en-US", { style: "currency", currency: currency.value, maximumFractionDigits: 0 }).format(0);
    root.querySelectorAll("[data-amount]").forEach((el) => { el.textContent = zero; });
  };

  let shown = false;
  const show = (on) => {
    shown = on;
    results.forEach((el) => { el.hidden = !on; });
    inputs.forEach((el) => { el.disabled = on; });
    button.textContent = on ? button.dataset.again : "Calculate";
    if (on) results[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  root.addEventListener("input", update);
  root.addEventListener("change", update);
  button.addEventListener("click", () => show(!shown));
  update();
  show(false);
}
