import type { ContractOptions } from "./contract";

export interface SSRHarness {
  /** Renders an element with `data-contract` and returns the HTML. */
  render(options: ContractOptions, style?: Record<string, string>): Promise<string>;
}

function declarations(html: string, value: string) {
  const tag = /<[a-z][^>]*\bdata-contract\b[^>]*>/i.exec(html)?.[0] ?? "";
  expect(tag, "the markup has an element with data-contract").not.toBe("");
  const style = /\bstyle="([^"]*)"/.exec(tag)?.[1] ?? "";
  return {
    hidden: new RegExp(`\\bdata-awesome-reveal="${value}"`).test(tag),
    style: style
      .split(";")
      .filter(Boolean)
      .map((declaration) => declaration.split(":").map((part) => part.trim()) as [string, string]),
  };
}

const last = (style: [string, string][], property: string) =>
  style.findLast(([name]) => name === property)?.[1];

/** Runs the SSR scenarios. A cascade hides its children with `data-awesome-reveal="cascade"`. */
export function describeSSRContract(
  name: string,
  harness: SSRHarness,
  hiddenValue: "hidden" | "cascade" = "hidden",
) {
  describe(`${hiddenValue === "cascade" ? "cascade" : "reveal"} SSR contract: ${name}`, () => {
    for (const options of [
      {},
      { when: false },
      { when: null },
      // The entrance plays after hydration, so an element with `when: true` does not flash.
      { when: true },
    ] as const) {
      it(`renders the element hidden for ${JSON.stringify(options)}`, async () => {
        const { hidden, style } = declarations(await harness.render(options), hiddenValue);
        expect(hidden).toBe(true);
        expect(last(style, "opacity")).toBeUndefined();
      });
    }

    it("keeps the style of the user on a hidden element", async () => {
      const { style } = declarations(
        await harness.render({}, { color: "red", opacity: "0.5" }),
        hiddenValue,
      );
      expect(last(style, "color")).toBe("red");
      expect(last(style, "opacity")).toBe("0.5");
    });
  });
}
