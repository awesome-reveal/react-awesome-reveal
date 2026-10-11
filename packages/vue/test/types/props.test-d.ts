import type { RevealOptions } from "@awesome-reveal/core";
import type { Directive } from "vue";

import type { RevealProps } from "../../src";
import { vReveal } from "../../src";

// Templates.vue holds the template checks. vue-tsc checks it with this file.
test("Reveal takes the core options and as", () => {
  expectTypeOf<RevealProps>().toExtend<RevealOptions>();
  expectTypeOf<RevealProps["as"]>().toEqualTypeOf<string | undefined>();
});

test("v-reveal takes the core options or nothing", () => {
  expectTypeOf(vReveal).toEqualTypeOf<Directive<HTMLElement, RevealOptions | undefined>>();
});
