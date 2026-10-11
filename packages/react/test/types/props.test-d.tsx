import { createRef, type RefCallback } from "react";

import * as api from "../../src";
import { Reveal, useReveal } from "../../src";
import {
  defineKeyframes,
  enter,
  type EnterOptions,
  type KeyframesFactory,
  type RevealKeyframe,
  slide,
  type SlideOptions,
} from "../../src/keyframes";

test("the root exports only the React layer", () => {
  expectTypeOf(api).not.toHaveProperty("default");
  expectTypeOf(api).not.toHaveProperty("slide");
});

test("every animation is a KeyframesFactory of its options", () => {
  expectTypeOf(enter).toEqualTypeOf<KeyframesFactory<EnterOptions>>();
  expectTypeOf(slide).toEqualTypeOf<KeyframesFactory<SlideOptions>>();
  expectTypeOf(slide()).toEqualTypeOf<RevealKeyframe[]>();

  // @ts-expect-error slide has no scale option
  slide({ scale: 0.5 });
  // @ts-expect-error up, down, left or right
  slide({ direction: "top" });
});

test("defineKeyframes returns a factory of its options", () => {
  const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
    keyframe: (t) => ({ opacity: t, rotate: `${turns * t}turn` }),
  }));
  const plain = defineKeyframes(() => ({ keyframe: (t) => ({ opacity: t }) }));

  expectTypeOf(spin).toEqualTypeOf<KeyframesFactory<{ turns?: number }>>();
  expectTypeOf(plain).toEqualTypeOf<KeyframesFactory>();
  // @ts-expect-error plain has no options
  plain({ turns: 2 });
});

test("Reveal types its ref by the rendered element", () => {
  void (<Reveal keyframes={slide()} ref={createRef<HTMLDivElement>()} />);
  void (<Reveal as="input" keyframes={slide()} ref={createRef<HTMLInputElement>()} />);
  void (<Reveal keyframes={slide()} ref={(node: HTMLDivElement | null) => void node} />);
  // @ts-expect-error a div ref on an input
  void (<Reveal as="input" keyframes={slide()} ref={createRef<HTMLDivElement>()} />);
});

test("keyframes are optional RevealKeyframe arrays", () => {
  expectTypeOf<RevealKeyframe[]>().toExtend<Keyframe[]>();
  expectTypeOf<Keyframe[]>().toExtend<RevealKeyframe[]>();

  void (<Reveal keyframes={[{ opacity: 0, "--progress": 0 }, {}]} />);
  void (<Reveal />);
  useReveal();
  // @ts-expect-error keyframes are not strings
  void (<Reveal keyframes="fadeIn" />);
  // @ts-expect-error call the factory to get its keyframes
  void (<Reveal keyframes={slide} />);
  // @ts-expect-error typo in a CSS property
  void (<Reveal keyframes={[{ opactiy: 0 }, {}]} />);
});

test("`as` selects the element props", () => {
  void (<Reveal as="a" keyframes={slide()} href="/" />);
  // @ts-expect-error div has no href
  void (<Reveal keyframes={slide()} href="/" />);
});

test("v4 props are removed", () => {
  // @ts-expect-error use stagger
  void (<Reveal keyframes={slide()} cascade />);
  // @ts-expect-error use stagger
  void (<Reveal keyframes={slide()} damping={0.5} />);
  // @ts-expect-error use threshold
  void (<Reveal keyframes={slide()} fraction={0.5} />);
  // @ts-expect-error use once
  void (<Reveal keyframes={slide()} triggerOnce />);
  // @ts-expect-error style the children directly
  void (<Reveal keyframes={slide()} childClassName="child" />);
  // @ts-expect-error use useReveal
  void (<Reveal keyframes={slide()} onVisibilityChange={() => {}} />);
});

test("useReveal types the ref by element", () => {
  const { ref } = useReveal<HTMLImageElement>({ keyframes: slide() });

  expectTypeOf(ref).toEqualTypeOf<RefCallback<HTMLImageElement>>();
});
