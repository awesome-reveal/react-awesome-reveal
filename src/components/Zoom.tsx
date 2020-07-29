import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import {
  zoomIn,
  zoomInDown,
  zoomInLeft,
  zoomInRight,
  zoomInUp
} from "../animations/zooming_entrances";

type ZoomDirection = "down" | "left" | "right" | "up";

interface ZoomProps extends Omit<RevealProps, "animation"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: ZoomDirection;
}

function getZoomKeyframes(direction?: ZoomDirection) {
  switch (direction) {
    case "down":
      return zoomInDown;
    case "left":
      return zoomInLeft;
    case "right":
      return zoomInRight;
    case "up":
      return zoomInUp;
    default:
      return zoomIn;
  }
}

const Zoom: React.FC<ZoomProps> = ({ direction, ...rest }) => {
  return <Reveal animation={getZoomKeyframes(direction)} {...rest} />;
};

export default Zoom;
