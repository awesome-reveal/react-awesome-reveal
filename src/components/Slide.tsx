import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import {
  slideInDown,
  slideInLeft,
  slideInRight,
  slideInUp
} from "../animations/sliding_entrances";

type SlideDirection = "down" | "left" | "right" | "up";

interface ZoomProps extends Omit<RevealProps, "animation"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: SlideDirection;
}

function getSlideKeyframes(direction?: SlideDirection) {
  switch (direction) {
    case "down":
      return slideInDown;
    case "left":
      return slideInLeft;
    case "right":
      return slideInRight;
    case "up":
      return slideInUp;
    default:
      return slideInLeft;
  }
}

const Slide: React.FC<ZoomProps> = ({ direction, ...rest }) => {
  return <Reveal animation={getSlideKeyframes(direction)} {...rest} />;
};

export default Slide;
