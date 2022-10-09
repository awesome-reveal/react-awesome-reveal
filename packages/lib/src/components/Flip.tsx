import { css } from "@emotion/react";
import { useMemo } from "react";

import {
  flip,
  flipInX,
  flipInY,
  flipOutX,
  flipOutY,
} from "../animations/flippers";
import { type RevealProps, Reveal } from "../Reveal";

type FlipDirection = "horizontal" | "vertical";

export interface FlipProps extends Omit<RevealProps, "keyframes" | "css"> {
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

function getStyles(reverse: boolean, direction?: FlipDirection) {
  switch (direction) {
    case "horizontal":
      return reverse ? flipOutX : flipInX;
    case "vertical":
      return reverse ? flipOutY : flipInY;
    default:
      return flip;
  }
}

const animationCss = css`
  backface-visibility: visible;
`;

export const Flip: React.FC<FlipProps> = (props) => {
  const { direction, reverse = false, ...rest } = props;

  const keyframes = useMemo(
    () => getStyles(reverse, direction),
    [direction, reverse]
  );

  return <Reveal css={animationCss} keyframes={keyframes} {...rest} />;
};
