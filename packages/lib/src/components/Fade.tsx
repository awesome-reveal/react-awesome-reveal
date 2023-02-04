import { useMemo } from "react";

import {
  fadeIn,
  fadeInBottomLeft,
  fadeInBottomRight,
  fadeInDown,
  fadeInDownBig,
  fadeInLeft,
  fadeInLeftBig,
  fadeInRight,
  fadeInRightBig,
  fadeInTopLeft,
  fadeInTopRight,
  fadeInUp,
  fadeInUpBig,
} from "../animations/fading_entrances";
import {
  fadeOut,
  fadeOutBottomLeft,
  fadeOutBottomRight,
  fadeOutDown,
  fadeOutDownBig,
  fadeOutLeft,
  fadeOutLeftBig,
  fadeOutRight,
  fadeOutRightBig,
  fadeOutTopLeft,
  fadeOutTopRight,
  fadeOutUp,
  fadeOutUpBig,
} from "../animations/fading_exits";
import { Reveal, type RevealProps } from "../Reveal";

type FadeDirection =
  | "bottom-left"
  | "bottom-right"
  | "down"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "up";

export interface FadeProps extends Omit<RevealProps, "keyframes"> {
  /**
   * Causes the animation to start farther. Only works with "down", "left", "right" and "up" directions.
   * @default false
   */
  big?: boolean;
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: FadeDirection;
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getStyles(big: boolean, reverse: boolean, direction?: FadeDirection) {
  switch (direction) {
    case "bottom-left":
      return reverse ? fadeOutBottomLeft : fadeInBottomLeft;
    case "bottom-right":
      return reverse ? fadeOutBottomRight : fadeInBottomRight;
    case "down":
      return big
        ? reverse
          ? fadeOutDownBig
          : fadeInDownBig
        : reverse
        ? fadeOutDown
        : fadeInDown;
    case "left":
      return big
        ? reverse
          ? fadeOutLeftBig
          : fadeInLeftBig
        : reverse
        ? fadeOutLeft
        : fadeInLeft;
    case "right":
      return big
        ? reverse
          ? fadeOutRightBig
          : fadeInRightBig
        : reverse
        ? fadeOutRight
        : fadeInRight;
    case "top-left":
      return reverse ? fadeOutTopLeft : fadeInTopLeft;
    case "top-right":
      return reverse ? fadeOutTopRight : fadeInTopRight;
    case "up":
      return big
        ? reverse
          ? fadeOutUpBig
          : fadeInUpBig
        : reverse
        ? fadeOutUp
        : fadeInUp;
    default:
      return reverse ? fadeOut : fadeIn;
  }
}

export const Fade: React.FC<FadeProps> = (props) => {
  const { big = false, direction, reverse = false, ...rest } = props;

  const keyframes = useMemo(
    () => getStyles(big, reverse, direction),
    [big, direction, reverse]
  );

  return <Reveal keyframes={keyframes} {...rest} />;
};
