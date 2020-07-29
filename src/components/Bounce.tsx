import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import {
  bounceIn,
  bounceInDown,
  bounceInLeft,
  bounceInRight,
  bounceInUp
} from "../animations/bouncing_entrances";

type BounceDirection = "down" | "left" | "right" | "up";

interface BounceProps extends Omit<RevealProps, "animation"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: BounceDirection;
}

function getBounceKeyframes(direction?: BounceDirection) {
  switch (direction) {
    case "down":
      return bounceInDown;
    case "left":
      return bounceInLeft;
    case "right":
      return bounceInRight;
    case "up":
      return bounceInUp;
    default:
      return bounceIn;
  }
}

const Bounce: React.FC<BounceProps> = ({ direction, ...rest }) => {
  return <Reveal animation={getBounceKeyframes(direction)} {...rest} />;
};

export default Bounce;
