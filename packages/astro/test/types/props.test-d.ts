import type { RevealOptions } from "@awesome-reveal/core/adapter";

import type { Cascade, CascadeProps, Reveal, RevealProps, RevealTag } from "../../src";

test("Reveal and Cascade reject tags that the host cannot wrap", () => {
  expectTypeOf<"table" | "select" | "option" | "a" | "div" | "svg">().toExtend<RevealTag>();
  expectTypeOf<
    | "html"
    | "head"
    | "body"
    | "caption"
    | "col"
    | "colgroup"
    | "thead"
    | "tbody"
    | "tfoot"
    | "tr"
    | "td"
    | "th"
    | "path"
    | "circle"
    | "g"
    | "image"
  >()
    .extract<RevealTag>()
    .toBeNever();
  // @ts-expect-error A table row cannot be a child of the custom element host.
  type Row = RevealProps<"tr">;
  // @ts-expect-error A table section cannot be a child of the custom element host.
  type Body = CascadeProps<"tbody">;
  expectTypeOf<Row>().not.toBeNever();
  expectTypeOf<Body>().not.toBeNever();
});

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

test("Reveal and Cascade take delay", () => {
  expectTypeOf<RevealProps>().toHaveProperty("delay");
  expectTypeOf<CascadeProps>().toHaveProperty("delay");
});

test("only Cascade takes interval", () => {
  expectTypeOf<CascadeProps>().toHaveProperty("interval");
  expectTypeOf<RevealProps>().not.toHaveProperty("interval");
  expectTypeOf<typeof Cascade<"ul">>().parameter(0).toEqualTypeOf<CascadeProps<"ul">>();
});
