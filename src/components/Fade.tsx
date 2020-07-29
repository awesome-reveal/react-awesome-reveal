import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import {
  fadeIn,
  fadeInBottomLeft,
  fadeInBottomRight,
  fadeInDown,
  fadeInDownBig,
  fadeInLeft,
  fadeInLeftBig,
  fadeInRight,
  fadeInRightBig,
  fadeInTopLeft,
  fadeInTopRight,
  fadeInUp,
  fadeInUpBig
} from "../animations/fading_entrances";

type FadeDirection =
  | "bottom-left"
  | "bottom-right"
  | "down"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "up";

interface FadeProps extends Omit<RevealProps, "animation"> {
  /**
   * Causes the animation to start farther. Only works with "down", "left", "right" and "up" directions.
   * @default false
   */
  big?: boolean;
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: FadeDirection;
}

function getFadeKeyframes(big: boolean, direction?: FadeDirection) {
  switch (direction) {
    case "bottom-left":
      return fadeInBottomLeft;
    case "bottom-right":
      return fadeInBottomRight;
    case "down":
      return big ? fadeInDownBig : fadeInDown;
    case "left":
      return big ? fadeInLeftBig : fadeInLeft;
    case "right":
      return big ? fadeInRightBig : fadeInRight;
    case "top-left":
      return fadeInTopLeft;
    case "top-right":
      return fadeInTopRight;
    case "up":
      return big ? fadeInUpBig : fadeInUp;
    default:
      return fadeIn;
  }
}

const Fade: React.FC<FadeProps> = ({ big = false, direction, ...rest }) => {
  return <Reveal animation={getFadeKeyframes(big, direction)} {...rest} />;
};

export default Fade;
