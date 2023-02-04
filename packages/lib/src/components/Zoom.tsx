import { useMemo } from "react";

import {
  zoomIn,
  zoomInDown,
  zoomInLeft,
  zoomInRight,
  zoomInUp,
} from "../animations/zooming_entrances";
import {
  zoomOut,
  zoomOutDown,
  zoomOutLeft,
  zoomOutRight,
  zoomOutUp,
} from "../animations/zooming_exits";
import { Reveal, type RevealProps } from "../Reveal";

type ZoomDirection = "down" | "left" | "right" | "up";

export interface ZoomProps extends Omit<RevealProps, "keyframes"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: ZoomDirection;
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getStyles(reverse: boolean, direction?: ZoomDirection) {
  switch (direction) {
    case "down":
      return reverse ? zoomOutDown : zoomInDown;
    case "left":
      return reverse ? zoomOutLeft : zoomInLeft;
    case "right":
      return reverse ? zoomOutRight : zoomInRight;
    case "up":
      return reverse ? zoomOutUp : zoomInUp;
    default:
      return reverse ? zoomOut : zoomIn;
  }
}

export const Zoom: React.FC<ZoomProps> = (props) => {
  const { direction, reverse = false, ...rest } = props;

  const keyframes = useMemo(
    () => getStyles(reverse, direction),
    [direction, reverse]
  );

  return <Reveal keyframes={keyframes} {...rest} />;
};
