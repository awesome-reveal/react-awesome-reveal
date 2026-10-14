import type { RevealOptions } from "@awesome-reveal/core/adapter";

import type { Reveal, RevealProps } from "../../src";

test("Reveal takes the core options and as", () => {
  expectTypeOf<RevealProps>().toExtend<RevealOptions>();
  expectTypeOf<RevealProps["as"]>().toEqualTypeOf<"div" | undefined>();
});

test("Reveal takes the attributes of the as tag", () => {
  expectTypeOf<RevealProps<"a">>().toHaveProperty("href");
  expectTypeOf<RevealProps<"div">>().not.toHaveProperty("href");
});

test("Reveal takes the props of its as tag", () => {
  expectTypeOf<typeof Reveal<"a">>().parameter(0).toEqualTypeOf<RevealProps<"a">>();
});

test("Reveal takes the entrance options, and no callback, which cannot cross to the client", () => {
  expectTypeOf<RevealProps>().toHaveProperty("from");
  expectTypeOf<RevealProps>().not.toHaveProperty("onReveal");
});

test("the custom element has typed when and revealed properties", () => {
  const host = document.createElement("awesome-reveal");
  expectTypeOf(host.when).toEqualTypeOf<boolean | null>();
  expectTypeOf(host.revealed).toEqualTypeOf<boolean>();
});
