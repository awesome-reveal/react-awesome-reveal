import type { ContractOptions } from "./contract";

export interface SSRHarness {
  /** Renders an element with `data-contract` and returns the HTML. */
  render(options: ContractOptions, style?: Record<string, string>): Promise<string>;
  /** The adapter hides the element with an inline `opacity: 0`. Astro uses a CSS rule instead. */
  inlineOpacity: boolean;
  /** Scenario ids that fail until a later phase fixes them. */
  drift?: string[];
}

function declarations(html: string) {
  const tag = /<[a-z][^>]*\bdata-contract\b[^>]*>/i.exec(html)?.[0] ?? "";
  const style = /\bstyle="([^"]*)"/.exec(tag)?.[1] ?? "";
  return {
    hidden: /\bdata-reveal="hidden"/.test(tag),
    style: style
      .split(";")
      .filter(Boolean)
      .map((declaration) => declaration.split(":").map((part) => part.trim()) as [string, string]),
  };
}

const last = (style: [string, string][], property: string) =>
  style.findLast(([name]) => name === property)?.[1];

export function describeSSRContract(name: string, harness: SSRHarness) {
  const drift = new Set(harness.drift);
  const scenario = (id: string, title: string, fn: () => Promise<void>) =>
    (drift.has(id) ? it.fails : it)(`${id} ${title}`, fn);

  describe(`reveal SSR contract: ${name}`, () => {
    for (const [id, options] of [
      ["SS01a", {}],
      ["SS01b", { when: false }],
      ["SS01c", { when: null }],
    ] as const) {
      scenario(id, `renders the element hidden for ${JSON.stringify(options)}`, async () => {
        const { hidden, style } = declarations(await harness.render(options));
        expect(hidden).toBe(true);
        if (harness.inlineOpacity) expect(last(style, "opacity")).toBe("0");
      });
    }

    scenario("SS02", "renders the element visible for when: true", async () => {
      const { hidden, style } = declarations(await harness.render({ when: true }));
      expect(hidden).toBe(false);
      expect(last(style, "opacity")).toBeUndefined();
    });

    scenario("SS03", "keeps the style of the user on a hidden element", async () => {
      const { style } = declarations(await harness.render({}, { color: "red", opacity: "0.5" }));
      expect(last(style, "color")).toBe("red");
      expect(last(style, "opacity")).toBe(harness.inlineOpacity ? "0" : "0.5");
    });

    scenario("SS04", "keeps the opacity of the user on a visible element", async () => {
      const { style } = declarations(await harness.render({ when: true }, { opacity: "0.5" }));
      expect(last(style, "opacity")).toBe("0.5");
    });
  });
}
