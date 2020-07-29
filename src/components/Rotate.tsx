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

type RotateDirection =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

interface RotateProps extends Omit<RevealProps, "animation"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: RotateDirection;
}

function getRotateKeyframes(direction?: RotateDirection) {
  switch (direction) {
    case "bottom-left":
      return rotateInDownLeft;
    case "bottom-right":
      return rotateInDownRight;
    case "top-left":
      return rotateInUpLeft;
    case "top-right":
      return rotateInUpRight;
    default:
      return rotateIn;
  }
}

const Rotate: React.FC<RotateProps> = ({ direction, ...rest }) => {
  return <Reveal animation={getRotateKeyframes(direction)} {...rest} />;
};

export default Rotate;
