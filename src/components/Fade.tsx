import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
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
  fadeInUpBig
} from "../animations/fading_entrances";

interface FadeProps extends Omit<RevealProps, "animation"> {
  /**
   * Origin of the animation.
   * @default undefined
   */
  direction?:
    | "bottom-left"
    | "bottom-right"
    | "down"
    | "down-big"
    | "left"
    | "left-big"
    | "right"
    | "right-big"
    | "top-left"
    | "top-right"
    | "up"
    | "up-big";
}

const Fade: React.FC<FadeProps> = ({ direction, ...rest }) => {
  switch (direction) {
    case "bottom-left":
      return <Reveal animation={fadeInBottomLeft} {...rest} />;
    case "bottom-right":
      return <Reveal animation={fadeInBottomRight} {...rest} />;
    case "down":
      return <Reveal animation={fadeInDown} {...rest} />;
    case "down-big":
      return <Reveal animation={fadeInDownBig} {...rest} />;
    case "left":
      return <Reveal animation={fadeInLeft} {...rest} />;
    case "left-big":
      return <Reveal animation={fadeInLeftBig} {...rest} />;
    case "right":
      return <Reveal animation={fadeInRight} {...rest} />;
    case "right-big":
      return <Reveal animation={fadeInRightBig} {...rest} />;
    case "top-left":
      return <Reveal animation={fadeInTopLeft} {...rest} />;
    case "top-right":
      return <Reveal animation={fadeInTopRight} {...rest} />;
    case "up":
      return <Reveal animation={fadeInUp} {...rest} />;
    case "up-big":
      return <Reveal animation={fadeInUpBig} {...rest} />;
    default:
      return <Reveal animation={fadeIn} {...rest} />;
  }
};

export default Fade;
