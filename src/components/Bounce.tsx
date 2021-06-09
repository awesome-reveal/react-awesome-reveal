import {
  bounceIn,
  bounceInDown,
  bounceInLeft,
  bounceInRight,
  bounceInUp,
} from "../animations/bouncing_entrances";
import {
  bounceOut,
  bounceOutDown,
  bounceOutLeft,
  bounceOutRight,
  bounceOutUp,
} from "../animations/bouncing_exits";
import Reveal, { RevealProps } from "../Reveal";

type BounceDirection = "down" | "left" | "right" | "up";

export interface BounceProps extends Omit<RevealProps, "keyframes" | "css"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?: BounceDirection;
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getBounceKeyframes(reverse: boolean, direction?: BounceDirection) {
  switch (direction) {
    case "down":
      return reverse ? bounceOutDown : bounceInDown;
    case "left":
      return reverse ? bounceOutLeft : bounceInLeft;
    case "right":
      return reverse ? bounceOutRight : bounceInRight;
    case "up":
      return reverse ? bounceOutUp : bounceInUp;
    default:
      return reverse ? bounceOut : bounceIn;
  }
}

const Bounce: React.FC<BounceProps> = ({
  direction,
  reverse = false,
  ...otherProps
}) => {
  return (
    <Reveal
      keyframes={getBounceKeyframes(reverse, direction)}
      {...otherProps}
    />
  );
};

export default Bounce;
