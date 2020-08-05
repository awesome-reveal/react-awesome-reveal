import * as React from "react";
import { Interpolation } from "@emotion/core";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import {
  flip,
  flipInX,
  flipInY,
  flipOutX,
  flipOutY
} from "../animations/flippers";

type FlipDirection = "horizontal" | "vertical";

interface FlipProps extends Omit<RevealProps, "keyframes"> {
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
  css,
  ...rest
}) => {
  const animationCss: Interpolation = { backfaceVisibility: "visible" };

  return (
    <Reveal
      keyframes={getFlipKeyframes(reverse, direction)}
      css={[css, animationCss]}
      {...rest}
    />
  );
};

export default Flip;
