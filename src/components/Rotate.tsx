import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import {
  rotateIn,
  rotateInDownLeft,
  rotateInDownRight,
  rotateInUpLeft,
  rotateInUpRight
} from "../animations/rotating_entrances";
import {
  rotateOut,
  rotateOutDownLeft,
  rotateOutDownRight,
  rotateOutUpLeft,
  rotateOutUpRight
} from "../animations/rotating_exits";

type RotateDirection =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

interface RotateProps extends Omit<RevealProps, "keyframes"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: RotateDirection;
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getRotateKeyframes(reverse: boolean, direction?: RotateDirection) {
  switch (direction) {
    case "bottom-left":
      return reverse ? rotateOutDownLeft : rotateInDownLeft;
    case "bottom-right":
      return reverse ? rotateOutDownRight : rotateInDownRight;
    case "top-left":
      return reverse ? rotateOutUpLeft : rotateInUpLeft;
    case "top-right":
      return reverse ? rotateOutUpRight : rotateInUpRight;
    default:
      return reverse ? rotateOut : rotateIn;
  }
}

const Rotate: React.FC<RotateProps> = ({
  direction,
  reverse = false,
  ...rest
}) => {
  return (
    <Reveal keyframes={getRotateKeyframes(reverse, direction)} {...rest} />
  );
};

export default Rotate;
