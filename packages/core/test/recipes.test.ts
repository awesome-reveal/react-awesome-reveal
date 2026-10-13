// @vitest-environment jsdom
import "./setup/dom";

import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(import.meta.dirname, "../..", path), "utf8");
const recipeScript = /<script(?: is:inline)?>(\s*setTimeout[\s\S]*?)<\/script>/;
const extract = (text: string) => recipeScript.exec(text)![1]!;
const dedent = (text: string) => text.replace(/^ +/gm, "").trim();

const stylesheet = read("core/src/reveal.css");
const script = extract(read("core/README.md").split("### Recover when the script fails")[1]!);
const astroScript = extract(read("astro/skills/adding-reveal-animations/SKILL.md"));

const card = () => document.getElementById("card")!;

function setUp(recipe: string) {
  vi.useFakeTimers();
  document.documentElement.removeAttribute("data-reveal-ready");
  document.documentElement.removeAttribute("data-reveal-failed");
  document.head.innerHTML = `<style>${stylesheet}</style>`;
  document.body.innerHTML = `<p id="card" data-reveal="hidden">Card</p>`;
  new Function(recipe)();
}

afterEach(() => vi.useRealTimers());

describe("failed-script recipe in the README, with reveal.css", () => {
  beforeEach(() => setUp(script));

  it("shows the hidden elements when the library did not start", () => {
    expect(getComputedStyle(card()).opacity).toBe("0");
    vi.advanceTimersByTime(5000);
    expect(document.documentElement).toHaveAttribute("data-reveal-failed");
    expect(getComputedStyle(card()).opacity).toBe("1");
  });

  it("does nothing when the library started", () => {
    document.documentElement.setAttribute("data-reveal-ready", "");
    vi.advanceTimersByTime(5000);
    expect(document.documentElement).not.toHaveAttribute("data-reveal-failed");
    expect(getComputedStyle(card()).opacity).toBe("0");
  });
});

describe.each(["core", "react", "vue"])("failed-script recipe in the %s skill", (pkg) => {
  it("is the recipe of the README", () => {
    const skillScript = extract(read(`${pkg}/skills/adding-reveal-animations/SKILL.md`));
    expect(dedent(skillScript)).toBe(dedent(script));
  });
});

describe("failed-script recipe in the Astro skill", () => {
  beforeEach(() => setUp(astroScript));

  it("is the recipe of the Astro README", () => {
    expect(dedent(extract(read("astro/README.md")))).toBe(dedent(astroScript));
  });

  it("shows the hidden elements when the custom element is not defined", () => {
    vi.advanceTimersByTime(5000);
    expect(getComputedStyle(card()).opacity).toBe("1");
  });

  it("does nothing when the custom element is defined", () => {
    customElements.define("awesome-reveal", class extends HTMLElement {});
    vi.advanceTimersByTime(5000);
    expect(document.documentElement).not.toHaveAttribute("data-reveal-failed");
  });
});
