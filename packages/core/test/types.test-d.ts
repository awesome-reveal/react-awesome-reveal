import { reveal, cascade, type RevealHandle, type RevealOptions } from "../src/index";
import * as api from "../src/index";
const el = document.createElement("div");
const frames: Keyframe[] = [{ opacity: 0, "--progress": 0, easing: "ease-in" }, {}];
const single: RevealHandle = reveal(el);
const selector: RevealHandle = reveal(".card");
const iterable: RevealHandle = reveal(new Set([el]));
const arrayLike: RevealHandle = reveal({ 0: el, length: 1 });
const group: RevealHandle = cascade(".features", { from: { opacity: 0, y: 16 }, interval: 80 });
reveal(el, { keyframes: frames });
reveal(el, { from: "left" });
reveal(el, { delay: 200 });
cascade(el, { delay: 200, interval: 80 });
const options: RevealOptions = { from: { x: "-100%", rotate: "-5deg", blur: "0.5rem" } };
reveal(el, options);
for (const handle of [single, selector, iterable, arrayLike, group]) handle.dispose();
// @ts-expect-error from and keyframes are exclusive
reveal(el, { from: "left", keyframes: frames });
// @ts-expect-error cascade shares the exclusive animation options
cascade(el, { from: {}, keyframes: frames });
// @ts-expect-error threshold is a single number
reveal(el, { threshold: [0, 1] });

test("the public surface has exactly the frozen primitives and options", () => {
  expectTypeOf<keyof typeof api>().toEqualTypeOf<"reveal" | "cascade">();
  expectTypeOf<keyof RevealHandle>().toEqualTypeOf<"dispose">();
  expectTypeOf<keyof RevealOptions>().toEqualTypeOf<
    "from" | "keyframes" | "duration" | "delay" | "threshold"
  >();
});
