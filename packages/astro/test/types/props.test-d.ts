import type { RevealOptions } from "@awesome-reveal/core";

import { Reveal, type RevealProps } from "../../src";

test("Reveal takes the core options and as", () => {
  expectTypeOf<RevealProps>().toExtend<RevealOptions>();
  expectTypeOf<RevealProps["as"]>().toEqualTypeOf<"div" | undefined>();
});

test("Reveal takes the attributes of the as tag", () => {
  expectTypeOf<RevealProps<"a">>().toHaveProperty("href");
  expectTypeOf<RevealProps<"div">>().not.toHaveProperty("href");
});

test("Reveal takes the props of its as tag", () => {
  expectTypeOf(Reveal<"a">)
    .parameter(0)
    .toEqualTypeOf<RevealProps<"a">>();
});
