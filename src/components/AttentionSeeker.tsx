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

type AttentionSeekerAnimation =
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

interface AttentionSeekerProps extends Omit<RevealProps, "animation"> {
  /**
   * The animation to use for this attention seeker.
   * @default "bounce"
   */
  animation?: AttentionSeekerAnimation;
}

function getAttentionSeekerKeyframes(animation: AttentionSeekerAnimation) {
  switch (animation) {
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
  animation = "bounce",
  ...rest
}) => {
  return (
    <Reveal animation={getAttentionSeekerKeyframes(animation)} {...rest} />
  );
};

export default AttentionSeeker;
