import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
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

function getAttentionSeekerKeyframes(effect: AttentionSeekerEffect) {
  switch (effect) {
    case "flash":
      return flash;
    case "headShake":
      return headShake;
    case "heartBeat":
      return heartBeat;
    case "jello":
      return jello;
    case "pulse":
      return pulse;
    case "rubberBand":
      return rubberBand;
    case "shake":
      return shake;
    case "shakeX":
      return shakeX;
    case "shakeY":
      return shakeY;
    case "swing":
      return swing;
    case "tada":
      return tada;
    case "wobble":
      return wobble;
    case "bounce":
    default:
      return bounce;
  }
}

const AttentionSeeker: React.FC<AttentionSeekerProps> = ({
  effect = "bounce",
  ...rest
}) => {
  return <Reveal keyframes={getAttentionSeekerKeyframes(effect)} {...rest} />;
};

export default AttentionSeeker;
