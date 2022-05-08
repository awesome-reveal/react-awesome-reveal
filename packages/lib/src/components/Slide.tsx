import {
  slideInDown,
  slideInLeft,
  slideInRight,
  slideInUp,
} from "../animations/sliding_entrances";
import {
  slideOutDown,
  slideOutLeft,
  slideOutRight,
  slideOutUp,
} from "../animations/sliding_exits";
import type { RevealProps } from "../Reveal";
import { Reveal } from "../Reveal";

type SlideDirection = "down" | "left" | "right" | "up";

export interface SlideProps extends Omit<RevealProps, "keyframes" | "css"> {
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

export const Slide: React.FC<SlideProps> = ({
  direction,
  reverse = false,
  ...otherProps
}) => {
  return (
    <Reveal keyframes={getSlideKeyframes(reverse, direction)} {...otherProps} />
  );
};
