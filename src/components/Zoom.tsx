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
import Reveal, { RevealProps } from "../Reveal";

type ZoomDirection = "down" | "left" | "right" | "up";

export interface ZoomProps extends Omit<RevealProps, "keyframes" | "css"> {
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

function getZoomKeyframes(reverse: boolean, direction?: ZoomDirection) {
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

const Zoom: React.FC<ZoomProps> = ({
  direction,
  reverse = false,
  ...otherProps
}) => {
  return (
    <Reveal keyframes={getZoomKeyframes(reverse, direction)} {...otherProps} />
  );
};

export default Zoom;
