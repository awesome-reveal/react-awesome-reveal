// @vitest-environment jsdom
import "./setup/dom";

import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(import.meta.dirname, "../..", path), "utf8");
const recipeStyle = /<style(?: is:inline)?>(\s*html\[data-reveal-failed\][\s\S]*?)<\/style>/;
const recipeScript = /<script(?: is:inline)?>(\s*setTimeout[\s\S]*?)<\/script>/;
const extract = (text: string) =>
  [recipeStyle, recipeScript].map((pattern) => pattern.exec(text)![1]!);
const dedent = (text: string) => text.replace(/^ +/gm, "").trim();

const readme = read("core/README.md");
const [style, script] = extract(
  readme.split("### Recover when the script fails")[1]!.split(/^##? /m)[0]!,
);
const [astroStyle, astroScript] = extract(read("astro/skills/adding-reveal-animations/SKILL.md"));

const card = () => document.getElementById("card")!;

function setUp(recipe: string) {
  vi.useFakeTimers();
  document.documentElement.removeAttribute("data-reveal-ready");
  document.documentElement.removeAttribute("data-reveal-failed");
  document.head.innerHTML = `<style>${style}</style>`;
  document.body.innerHTML = `<p id="card" style="opacity: 0" data-reveal="hidden">Card</p>`;
  new Function(recipe)();
}

afterEach(() => vi.useRealTimers());

describe("failed-script recipe in the README", () => {
  beforeEach(() => setUp(script));

  it("shows the hidden elements when the entry module did not run", () => {
    expect(getComputedStyle(card()).opacity).toBe("0");
    vi.advanceTimersByTime(5000);
    expect(document.documentElement).toHaveAttribute("data-reveal-failed");
    expect(getComputedStyle(card()).opacity).toBe("1");
  });

  it("does nothing when the entry module set the ready attribute", () => {
    document.documentElement.setAttribute("data-reveal-ready", "");
    vi.advanceTimersByTime(5000);
    expect(document.documentElement).not.toHaveAttribute("data-reveal-failed");
    expect(getComputedStyle(card()).opacity).toBe("0");
  });
});

describe.each(["core", "react", "vue"])("failed-script recipe in the %s skill", (pkg) => {
  it("is the recipe of the README", () => {
    const [skillStyle, skillScript] = extract(
      read(`${pkg}/skills/adding-reveal-animations/SKILL.md`),
    );
    expect(dedent(skillStyle!)).toBe(dedent(style!));
    expect(dedent(skillScript!)).toBe(dedent(script!));
  });
});

describe("failed-script recipe in the Astro skill", () => {
  beforeEach(() => setUp(astroScript!));

  it("has the rule of the README", () => {
    expect(dedent(astroStyle!)).toBe(dedent(style!));
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
