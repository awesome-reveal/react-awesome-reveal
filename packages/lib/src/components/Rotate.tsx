import type { Interpolation, Theme } from "@emotion/react";
import type { Keyframes } from "@emotion/serialize";
import { useMemo } from "react";

import {
  rotateIn,
  rotateInDownLeft,
  rotateInDownRight,
  rotateInUpLeft,
  rotateInUpRight,
} from "../animations/rotating_entrances";
import {
  rotateOut,
  rotateOutDownLeft,
  rotateOutDownRight,
  rotateOutUpLeft,
  rotateOutUpRight,
} from "../animations/rotating_exits";
import { type RevealProps, Reveal } from "../Reveal";

type RotateDirection =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export interface RotateProps extends Omit<RevealProps, "keyframes" | "css"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: RotateDirection;
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getStyles(
  reverse: boolean,
  direction?: RotateDirection
): [Keyframes, Interpolation<Theme>?] {
  switch (direction) {
    case "bottom-left":
      return reverse
        ? [rotateOutDownLeft, { transformOrigin: "left bottom" }]
        : [rotateInDownLeft, { transformOrigin: "left bottom" }];
    case "bottom-right":
      return reverse
        ? [rotateOutDownRight, { transformOrigin: "right bottom" }]
        : [rotateInDownRight, { transformOrigin: "right bottom" }];
    case "top-left":
      return reverse
        ? [rotateOutUpLeft, { transformOrigin: "left bottom" }]
        : [rotateInUpLeft, { transformOrigin: "left bottom" }];
    case "top-right":
      return reverse
        ? [rotateOutUpRight, { transformOrigin: "right bottom" }]
        : [rotateInUpRight, { transformOrigin: "right bottom" }];
    default:
      return reverse
        ? [rotateOut, { transformOrigin: "center" }]
        : [rotateIn, { transformOrigin: "center" }];
  }
}

export const Rotate: React.FC<RotateProps> = (props) => {
  const { direction, reverse = false, ...rest } = props;

  const [keyframes, animationCss] = useMemo(
    () => getStyles(reverse, direction),
    [direction, reverse]
  );

  return <Reveal css={animationCss} keyframes={keyframes} {...rest} />;
};
