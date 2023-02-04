import { useMemo } from "react";

import {
  bounceIn,
  bounceInDown,
  bounceInLeft,
  bounceInRight,
  bounceInUp,
} from "../animations/bouncing_entrances";
import {
  bounceOut,
  bounceOutDown,
  bounceOutLeft,
  bounceOutRight,
  bounceOutUp,
} from "../animations/bouncing_exits";
import { Reveal, type RevealProps } from "../Reveal";

type BounceDirection = "down" | "left" | "right" | "up";

export interface BounceProps extends Omit<RevealProps, "keyframes"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: BounceDirection;
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getStyles(reverse: boolean, direction?: BounceDirection) {
  switch (direction) {
    case "down":
      return reverse ? bounceOutDown : bounceInDown;
    case "left":
      return reverse ? bounceOutLeft : bounceInLeft;
    case "right":
      return reverse ? bounceOutRight : bounceInRight;
    case "up":
      return reverse ? bounceOutUp : bounceInUp;
    default:
      return reverse ? bounceOut : bounceIn;
  }
}

export const Bounce: React.FC<BounceProps> = (props) => {
  const { direction, reverse = false, ...rest } = props;

  const keyframes = useMemo(
    () => getStyles(reverse, direction),
    [direction, reverse]
  );

  return <Reveal keyframes={keyframes} {...rest} />;
};
