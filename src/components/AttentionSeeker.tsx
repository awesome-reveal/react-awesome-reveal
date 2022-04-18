import type { Interpolation, Theme } from "@emotion/react";
import type { Keyframes } from "@emotion/serialize";

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
  wobble,
} from "../animations/attention_seekers";
import type { RevealProps } from "../Reveal";
import Reveal from "../Reveal";

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

export interface AttentionSeekerProps
  extends Omit<RevealProps, "keyframes" | "css"> {
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
  ...otherProps
}) => {
  const [keyframes, animationCss] = getAttentionSeekerKeyframesAndCss(effect);

  return <Reveal keyframes={keyframes} css={animationCss} {...otherProps} />;
};

export default AttentionSeeker;
