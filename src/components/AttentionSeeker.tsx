import * as React from "react";
import { Interpolation, Theme } from "@emotion/react";
import { Keyframes } from "@emotion/serialize";

import Reveal, { RevealProps } from "../Reveal";
import {
  bounce,
  flash,
  headShake,
  heartBeat,
  jello,
  pulse,
  rubberBand,
  shake,
  shakeX,
  shakeY,
  swing,
  tada,
  wobble
} from "../animations/attention_seekers";

type AttentionSeekerEffect =
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
  | "wobble";

interface AttentionSeekerProps extends Omit<RevealProps, "keyframes"> {
  /**
   * The animation effect to use for this attention seeker.
   * @default "bounce"
   */
  effect?: AttentionSeekerEffect;
}

function getAttentionSeekerKeyframesAndCss(
  effect: AttentionSeekerEffect
): [Keyframes, Interpolation<Theme>?] {
  switch (effect) {
    case "flash":
      return [flash];
    case "headShake":
      return [headShake, { animationTimingFunction: "ease-in-out" }];
    case "heartBeat":
      return [heartBeat, { animationTimingFunction: "ease-in-out" }];
    case "jello":
      return [jello, { transformOrigin: "center" }];
    case "pulse":
      return [pulse, { animationTimingFunction: "ease-in-out" }];
    case "rubberBand":
      return [rubberBand];
    case "shake":
      return [shake];
    case "shakeX":
      return [shakeX];
    case "shakeY":
      return [shakeY];
    case "swing":
      return [swing, { transformOrigin: "top center" }];
    case "tada":
      return [tada];
    case "wobble":
      return [wobble];
    case "bounce":
    default:
      return [bounce, { transformOrigin: "center bottom" }];
  }
}

const AttentionSeeker: React.FC<AttentionSeekerProps> = ({
  effect = "bounce",
  css,
  ...rest
}) => {
  const [keyframes, animationCss] = getAttentionSeekerKeyframesAndCss(effect);

  return <Reveal keyframes={keyframes} css={[css, animationCss]} {...rest} />;
};

export default AttentionSeeker;
