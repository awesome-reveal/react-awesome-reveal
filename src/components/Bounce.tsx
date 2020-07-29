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

interface BounceProps extends Omit<RevealProps, "animation"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: "down" | "left" | "right" | "up";
}

const Bounce: React.FC<BounceProps> = ({ direction, ...rest }) => {
  switch (direction) {
    case "down":
      return <Reveal animation={bounceInDown} {...rest} />;
    case "left":
      return <Reveal animation={bounceInLeft} {...rest} />;
    case "right":
      return <Reveal animation={bounceInRight} {...rest} />;
    case "up":
      return <Reveal animation={bounceInUp} {...rest} />;
    default:
      return <Reveal animation={bounceIn} {...rest} />;
  }
};

export default Bounce;
