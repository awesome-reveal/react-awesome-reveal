import { useMemo } from "react";

import {
  slideInDown,
  slideInLeft,
  slideInRight,
  slideInUp,
} from "../animations/sliding_entrances/index.js";
import {
  slideOutDown,
  slideOutLeft,
  slideOutRight,
  slideOutUp,
} from "../animations/sliding_exits/index.js";
import { Reveal, type RevealProps } from "../Reveal.js";

type SlideDirection = "down" | "left" | "right" | "up";

export interface SlideProps extends Omit<RevealProps, "keyframes"> {
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

function getStyles(reverse: boolean, direction?: SlideDirection) {
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

export const Slide: React.FC<SlideProps> = (props) => {
  const { direction, reverse = false, ...rest } = props;

  const keyframes = useMemo(() => getStyles(reverse, direction), [direction, reverse]);

  return <Reveal keyframes={keyframes} {...rest} />;
};
