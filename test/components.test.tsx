import type { Keyframes } from "@emotion/react";
import { createElement, type CSSProperties, type FC } from "react";

import * as seekers from "../src/animations/attention_seekers";
import * as bouncingIn from "../src/animations/bouncing_entrances";
import * as bouncingOut from "../src/animations/bouncing_exits";
import * as fadingIn from "../src/animations/fading_entrances";
import * as fadingOut from "../src/animations/fading_exits";
import * as flippers from "../src/animations/flippers";
import * as rotatingIn from "../src/animations/rotating_entrances";
import * as rotatingOut from "../src/animations/rotating_exits";
import * as slidingIn from "../src/animations/sliding_entrances";
import * as slidingOut from "../src/animations/sliding_exits";
import * as specials from "../src/animations/specials";
import * as zoomingIn from "../src/animations/zooming_entrances";
import * as zoomingOut from "../src/animations/zooming_exits";
import {
  AttentionSeeker,
  type AttentionSeekerProps,
  Bounce,
  Fade,
  Flip,
  Hinge,
  JackInTheBox,
  Roll,
  Rotate,
  Slide,
  Zoom,
} from "../src";
import type { RevealProps } from "../src/Reveal";
import { renderInView } from "./helpers";

function row<P extends RevealProps>(Component: FC<P>, props: P, keyframes: Keyframes) {
  const render = () =>
    renderInView(createElement(Component, { ...props, className: "forwarded" }, <p>child</p>));
  return { name: Component.name, props, keyframes, render };
}

describe("wrapper components", () => {
  it.each([
    row(Bounce, {}, bouncingIn.bounceIn),
    row(Bounce, { direction: "down" }, bouncingIn.bounceInDown),
    row(Bounce, { direction: "left" }, bouncingIn.bounceInLeft),
    row(Bounce, { direction: "right" }, bouncingIn.bounceInRight),
    row(Bounce, { direction: "up" }, bouncingIn.bounceInUp),
    row(Bounce, { reverse: true }, bouncingOut.bounceOut),
    row(Bounce, { direction: "down", reverse: true }, bouncingOut.bounceOutDown),
    row(Bounce, { direction: "left", reverse: true }, bouncingOut.bounceOutLeft),
    row(Bounce, { direction: "right", reverse: true }, bouncingOut.bounceOutRight),
    row(Bounce, { direction: "up", reverse: true }, bouncingOut.bounceOutUp),

    row(Fade, {}, fadingIn.fadeIn),
    row(Fade, { reverse: true }, fadingOut.fadeOut),
    row(Fade, { direction: "bottom-left" }, fadingIn.fadeInBottomLeft),
    row(Fade, { direction: "bottom-left", reverse: true }, fadingOut.fadeOutBottomLeft),
    row(Fade, { direction: "bottom-right" }, fadingIn.fadeInBottomRight),
    row(Fade, { direction: "bottom-right", reverse: true }, fadingOut.fadeOutBottomRight),
    row(Fade, { direction: "top-left" }, fadingIn.fadeInTopLeft),
    row(Fade, { direction: "top-left", reverse: true }, fadingOut.fadeOutTopLeft),
    row(Fade, { direction: "top-right" }, fadingIn.fadeInTopRight),
    row(Fade, { direction: "top-right", reverse: true }, fadingOut.fadeOutTopRight),
    row(Fade, { direction: "top-right", big: true }, fadingIn.fadeInTopRight),
    row(Fade, { direction: "down" }, fadingIn.fadeInDown),
    row(Fade, { direction: "down", reverse: true }, fadingOut.fadeOutDown),
    row(Fade, { direction: "down", big: true }, fadingIn.fadeInDownBig),
    row(Fade, { direction: "down", big: true, reverse: true }, fadingOut.fadeOutDownBig),
    row(Fade, { direction: "left" }, fadingIn.fadeInLeft),
    row(Fade, { direction: "left", reverse: true }, fadingOut.fadeOutLeft),
    row(Fade, { direction: "left", big: true }, fadingIn.fadeInLeftBig),
    row(Fade, { direction: "left", big: true, reverse: true }, fadingOut.fadeOutLeftBig),
    row(Fade, { direction: "right" }, fadingIn.fadeInRight),
    row(Fade, { direction: "right", reverse: true }, fadingOut.fadeOutRight),
    row(Fade, { direction: "right", big: true }, fadingIn.fadeInRightBig),
    row(Fade, { direction: "right", big: true, reverse: true }, fadingOut.fadeOutRightBig),
    row(Fade, { direction: "up" }, fadingIn.fadeInUp),
    row(Fade, { direction: "up", reverse: true }, fadingOut.fadeOutUp),
    row(Fade, { direction: "up", big: true }, fadingIn.fadeInUpBig),
    row(Fade, { direction: "up", big: true, reverse: true }, fadingOut.fadeOutUpBig),

    row(Flip, {}, flippers.flip),
    row(Flip, { reverse: true }, flippers.flip),
    row(Flip, { direction: "horizontal" }, flippers.flipInX),
    row(Flip, { direction: "vertical" }, flippers.flipInY),
    row(Flip, { direction: "horizontal", reverse: true }, flippers.flipOutX),
    row(Flip, { direction: "vertical", reverse: true }, flippers.flipOutY),

    row(Hinge, {}, specials.hinge),
    row(JackInTheBox, {}, specials.jackInTheBox),
    row(Roll, {}, specials.rollIn),
    row(Roll, { reverse: true }, specials.rollOut),

    row(Rotate, {}, rotatingIn.rotateIn),
    row(Rotate, { direction: "bottom-left" }, rotatingIn.rotateInDownLeft),
    row(Rotate, { direction: "bottom-right" }, rotatingIn.rotateInDownRight),
    row(Rotate, { direction: "top-left" }, rotatingIn.rotateInUpLeft),
    row(Rotate, { direction: "top-right" }, rotatingIn.rotateInUpRight),
    row(Rotate, { reverse: true }, rotatingOut.rotateOut),
    row(Rotate, { direction: "bottom-left", reverse: true }, rotatingOut.rotateOutDownLeft),
    row(Rotate, { direction: "bottom-right", reverse: true }, rotatingOut.rotateOutDownRight),
    row(Rotate, { direction: "top-left", reverse: true }, rotatingOut.rotateOutUpLeft),
    row(Rotate, { direction: "top-right", reverse: true }, rotatingOut.rotateOutUpRight),

    row(Slide, {}, slidingIn.slideInLeft),
    row(Slide, { direction: "down" }, slidingIn.slideInDown),
    row(Slide, { direction: "left" }, slidingIn.slideInLeft),
    row(Slide, { direction: "right" }, slidingIn.slideInRight),
    row(Slide, { direction: "up" }, slidingIn.slideInUp),
    row(Slide, { reverse: true }, slidingOut.slideOutLeft),
    row(Slide, { direction: "down", reverse: true }, slidingOut.slideOutDown),
    row(Slide, { direction: "left", reverse: true }, slidingOut.slideOutLeft),
    row(Slide, { direction: "right", reverse: true }, slidingOut.slideOutRight),
    row(Slide, { direction: "up", reverse: true }, slidingOut.slideOutUp),

    row(Zoom, {}, zoomingIn.zoomIn),
    row(Zoom, { direction: "down" }, zoomingIn.zoomInDown),
    row(Zoom, { direction: "left" }, zoomingIn.zoomInLeft),
    row(Zoom, { direction: "right" }, zoomingIn.zoomInRight),
    row(Zoom, { direction: "up" }, zoomingIn.zoomInUp),
    row(Zoom, { reverse: true }, zoomingOut.zoomOut),
    row(Zoom, { direction: "down", reverse: true }, zoomingOut.zoomOutDown),
    row(Zoom, { direction: "left", reverse: true }, zoomingOut.zoomOutLeft),
    row(Zoom, { direction: "right", reverse: true }, zoomingOut.zoomOutRight),
    row(Zoom, { direction: "up", reverse: true }, zoomingOut.zoomOutUp),
  ])("$name uses the right keyframes for $props", ({ keyframes, render }) => {
    const wrapper = render();

    expect(wrapper).toHaveStyle({ animationName: keyframes.name });
    expect(wrapper).toHaveClass("forwarded");
  });

  it.each<[NonNullable<AttentionSeekerProps["effect"]>, CSSProperties]>([
    ["bounce", { transformOrigin: "center bottom" }],
    ["flash", {}],
    ["headShake", { animationTimingFunction: "ease-in-out" }],
    ["heartBeat", { animationTimingFunction: "ease-in-out" }],
    ["jello", { transformOrigin: "center" }],
    ["pulse", { animationTimingFunction: "ease-in-out" }],
    ["rubberBand", {}],
    ["shake", {}],
    ["shakeX", {}],
    ["shakeY", {}],
    ["swing", { transformOrigin: "top center" }],
    ["tada", {}],
    ["wobble", {}],
  ])("AttentionSeeker uses the %s keyframes and styles", (effect, styles) => {
    const wrapper = renderInView(
      <AttentionSeeker effect={effect} style={{ padding: "1px" }}>
        <p>child</p>
      </AttentionSeeker>,
    );

    expect(wrapper).toHaveStyle({ animationName: seekers[effect].name, ...styles, padding: "1px" });
  });

  it("AttentionSeeker bounces by default", () => {
    const wrapper = renderInView(
      <AttentionSeeker>
        <p>child</p>
      </AttentionSeeker>,
    );

    expect(wrapper).toHaveStyle({ animationName: seekers.bounce.name });
  });

  it.each([
    ["AttentionSeeker", <AttentionSeeker effect="swing" />, { transformOrigin: "top center" }],
    ["Flip", <Flip />, { backfaceVisibility: "visible" }],
    ["Hinge", <Hinge />, { transformOrigin: "top left" }],
    ["Rotate", <Rotate direction="bottom-right" />, { transformOrigin: "right bottom" }],
  ])("%s overrides the user style with its own and keeps the rest", (_, element, styles) => {
    const wrapper = renderInView(
      <element.type
        {...element.props}
        style={{ transformOrigin: "top", backfaceVisibility: "hidden", padding: "1px" }}
      >
        <p>child</p>
      </element.type>,
    );

    expect(wrapper).toHaveStyle({ ...styles, padding: "1px" });
  });

  it("Rotate uses a center transform origin without direction", () => {
    const wrapper = renderInView(
      <Rotate>
        <p>child</p>
      </Rotate>,
    );

    expect(wrapper).toHaveStyle({ transformOrigin: "center" });
  });
});
