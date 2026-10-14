import { createRef, type RefCallback } from "react";

import { Cascade, Reveal, useCascade, useReveal } from "../../src";
test("Reveal types its ref by the rendered element", () => {
  void (<Reveal keyframes={[{ opacity: 0 }, {}]} ref={createRef<HTMLDivElement>()} />);
  void (<Reveal as="input" keyframes={[{ opacity: 0 }, {}]} ref={createRef<HTMLInputElement>()} />);
  void (
    <Reveal keyframes={[{ opacity: 0 }, {}]} ref={(node: HTMLDivElement | null) => void node} />
  );
  // @ts-expect-error a div ref on an input
  void (<Reveal as="input" keyframes={[{ opacity: 0 }, {}]} ref={createRef<HTMLDivElement>()} />);
});

test("native keyframes and from are mutually exclusive", () => {
  void (<Reveal keyframes={[{ opacity: 0, "--progress": 0 }, {}]} />);
  void (<Reveal from={{ scale: 0.9, blur: "1rem" }} when />);
  useReveal();
  // @ts-expect-error exclusive animation choices
  void (<Reveal from="left" keyframes={[{}]} />);
});

test("`as` selects the element props", () => {
  void (<Reveal as="a" keyframes={[{ opacity: 0 }, {}]} href="/" />);
  // @ts-expect-error div has no href
  void (<Reveal keyframes={[{ opacity: 0 }, {}]} href="/" />);
});

test("useReveal types the element props by element", () => {
  const { getProps } = useReveal<HTMLImageElement>({ keyframes: [{ opacity: 0 }, {}] });
  const props = getProps({ className: "card", ref: createRef<HTMLImageElement>() });

  expectTypeOf(props.ref).toEqualTypeOf<RefCallback<HTMLImageElement>>();
  expectTypeOf(props.className).toEqualTypeOf<string>();
  expectTypeOf(props["data-awesome-reveal"]).toEqualTypeOf<"hidden" | undefined>();
  expectTypeOf(getProps()).not.toHaveProperty("style");
  // @ts-expect-error an input ref on an image
  getProps({ ref: createRef<HTMLInputElement>() });
});

test("every entry point takes delay", () => {
  void (<Reveal delay={200} />);
  void (<Cascade delay={200} interval={80} />);
  useReveal({ delay: 200 });
  useCascade({ delay: 200 });
});

test("only Cascade and useCascade take interval", () => {
  void (<Cascade as="ul" interval={120} from="left" />);
  useCascade({ interval: -40 });
  // @ts-expect-error Reveal animates one element
  void (<Reveal interval={120} />);
  // @ts-expect-error useReveal animates one element
  useReveal({ interval: 120 });
});

test("useCascade hides the children with its own attribute value", () => {
  const { getProps } = useCascade<HTMLUListElement>();
  expectTypeOf(getProps()["data-awesome-reveal"]).toEqualTypeOf<"cascade" | undefined>();
});
