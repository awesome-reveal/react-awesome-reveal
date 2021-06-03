import { Interpolation, Theme } from "@emotion/react";

import {
  flip,
  flipInX,
  flipInY,
  flipOutX,
  flipOutY,
} from "../animations/flippers";
import Reveal, { RevealProps } from "../Reveal";

type FlipDirection = "horizontal" | "vertical";

interface FlipProps extends Omit<RevealProps, "keyframes" | "css"> {
  /**
   * Axis direction of the animation.
   * @default undefined
   */
  direction?: FlipDirection;
  /**
   * Specifies if the animation should make element(s) disappear. It only has effect if a direction is specified.
   * @default false
   */
  reverse?: boolean;
}

function getFlipKeyframes(reverse: boolean, direction?: FlipDirection) {
  switch (direction) {
    case "horizontal":
      return reverse ? flipOutX : flipInX;
    case "vertical":
      return reverse ? flipOutY : flipInY;
    default:
      return flip;
  }
}

const Flip: React.FC<FlipProps> = ({
  direction,
  reverse = false,
  ...otherProps
}) => {
  const animationCss: Interpolation<Theme> = { backfaceVisibility: "visible" };

  return (
    <Reveal
      keyframes={getFlipKeyframes(reverse, direction)}
      css={animationCss}
      {...otherProps}
    />
  );
};

export default Flip;
