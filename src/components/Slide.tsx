import * as React from "react";

import Reveal, { RevealProps } from "../Reveal";
import {
  slideInDown,
  slideInLeft,
  slideInRight,
  slideInUp
} from "../animations/sliding_entrances";
import {
  slideOutDown,
  slideOutLeft,
  slideOutRight,
  slideOutUp
} from "../animations/sliding_exits";

type SlideDirection = "down" | "left" | "right" | "up";

interface SlideProps extends Omit<RevealProps, "keyframes"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: SlideDirection;
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getSlideKeyframes(reverse: boolean, direction?: SlideDirection) {
  switch (direction) {
    case "down":
      return reverse ? slideOutDown : slideInDown;
    case "right":
      return reverse ? slideOutRight : slideInRight;
    case "up":
      return reverse ? slideOutUp : slideInUp;
    case "left":
    default:
      return reverse ? slideOutLeft : slideInLeft;
  }
}

const Slide: React.FC<SlideProps> = ({
  direction,
  reverse = false,
  ...rest
}) => {
  return <Reveal keyframes={getSlideKeyframes(reverse, direction)} {...rest} />;
};

export default Slide;
