import { type CSSProperties, useMemo } from "react";

import {
  flip,
  flipInX,
  flipInY,
  flipOutX,
  flipOutY,
} from "../animations/flippers";
import { Reveal, type RevealProps } from "../Reveal";

type FlipDirection = "horizontal" | "vertical";

export interface FlipProps extends Omit<RevealProps, "keyframes"> {
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

const animationCss: CSSProperties = {
  backfaceVisibility: "visible",
};

export const Flip: React.FC<FlipProps> = (props) => {
  const { direction, reverse = false, style, ...rest } = props;

  const keyframes = useMemo(
    () => getStyles(reverse, direction),
    [direction, reverse]
  );

  return (
    <Reveal
      keyframes={keyframes}
      style={Object.assign({}, style, animationCss)}
      {...rest}
    />
  );
};
