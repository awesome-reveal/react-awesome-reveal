import * as React from "react";
import { Interpolation, Theme } from "@emotion/react";
import { Keyframes } from "@emotion/serialize";

import Reveal, { RevealProps } from "../Reveal";
import {
  rotateIn,
  rotateInDownLeft,
  rotateInDownRight,
  rotateInUpLeft,
  rotateInUpRight
} from "../animations/rotating_entrances";
import {
  rotateOut,
  rotateOutDownLeft,
  rotateOutDownRight,
  rotateOutUpLeft,
  rotateOutUpRight
} from "../animations/rotating_exits";

type RotateDirection =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

interface RotateProps extends Omit<RevealProps, "keyframes"> {
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

function getRotateKeyframesAndCss(
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

const Rotate: React.FC<RotateProps> = ({
  direction,
  reverse = false,
  css,
  ...rest
}) => {
  const [keyframes, animationCss] = getRotateKeyframesAndCss(
    reverse,
    direction
  );

  return <Reveal keyframes={keyframes} css={[css, animationCss]} {...rest} />;
};

export default Rotate;
