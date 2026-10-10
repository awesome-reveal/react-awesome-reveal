import { keyframes } from "@emotion/react";
import type { ComponentProps } from "react";

import ReactAwesomeReveal, {
  AttentionSeeker,
  Bounce,
  Fade,
  Flip,
  Hinge,
  Reveal,
  type RevealProps,
  Rotate,
  Slide,
  Zoom,
} from "../../src";

test("the default export is Reveal", () => {
  expectTypeOf(ReactAwesomeReveal).toEqualTypeOf(Reveal);
});

test("Reveal props", () => {
  expectTypeOf<ComponentProps<typeof Reveal>>().toEqualTypeOf<RevealProps>();
  expectTypeOf<RevealProps["onVisibilityChange"]>().toEqualTypeOf<
    ((inView: boolean, entry: IntersectionObserverEntry) => void) | undefined
  >();

  void (<Reveal keyframes={keyframes`from { opacity: 0; }`} />);
  // @ts-expect-error cascade is a boolean
  void (<Reveal cascade="yes" />);
  // @ts-expect-error keyframes must come from Emotion
  void (<Reveal keyframes="fadeIn" />);
});

test("direction unions", () => {
  expectTypeOf<ComponentProps<typeof Fade>["direction"]>().toEqualTypeOf<
    | "bottom-left"
    | "bottom-right"
    | "down"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "up"
    | undefined
  >();
  expectTypeOf<ComponentProps<typeof Bounce>["direction"]>().toEqualTypeOf<
    "down" | "left" | "right" | "up" | undefined
  >();
  expectTypeOf<ComponentProps<typeof Slide>["direction"]>().toEqualTypeOf<
    "down" | "left" | "right" | "up" | undefined
  >();
  expectTypeOf<ComponentProps<typeof Zoom>["direction"]>().toEqualTypeOf<
    "down" | "left" | "right" | "up" | undefined
  >();
  expectTypeOf<ComponentProps<typeof Flip>["direction"]>().toEqualTypeOf<
    "horizontal" | "vertical" | undefined
  >();
  expectTypeOf<ComponentProps<typeof Rotate>["direction"]>().toEqualTypeOf<
    "bottom-left" | "bottom-right" | "top-left" | "top-right" | undefined
  >();

  // @ts-expect-error Fade has no "horizontal" direction
  void (<Fade direction="horizontal" />);
  // @ts-expect-error Flip has no "up" direction
  void (<Flip direction="up" />);
});

test("AttentionSeeker effects", () => {
  expectTypeOf<ComponentProps<typeof AttentionSeeker>["effect"]>().toEqualTypeOf<
    | "bounce"
    | "flash"
    | "headShake"
    | "heartBeat"
    | "jello"
    | "pulse"
    | "rubberBand"
    | "shake"
    | "shakeX"
    | "shakeY"
    | "swing"
    | "tada"
    | "wobble"
    | undefined
  >();

  // @ts-expect-error spin is not an effect
  void (<AttentionSeeker effect="spin" />);
});

test("wrappers set their own keyframes", () => {
  // @ts-expect-error Fade has no keyframes prop
  void (<Fade keyframes={keyframes``} />);
  // @ts-expect-error Hinge has no reverse prop
  void (<Hinge reverse />);
});
