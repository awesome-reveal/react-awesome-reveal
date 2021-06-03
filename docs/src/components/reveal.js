import React from "react";
import {
  Bounce,
  Fade,
  Flash,
  Flip,
  HeadShake,
  HeartBeat,
  JackInTheBox,
  Jello,
  LightSpeed,
  Pulse,
  Rotate,
  RubberBand,
  Shake,
  Slide,
  Swing,
  Tada,
  Wobble,
  Zoom,
} from "react-awesome-reveal";

const Reveal = ({ animation, direction, children }) => {
  switch (animation) {
    case "bounce":
      return <Bounce direction={direction}>{children}</Bounce>;
    case "flash":
      return <Flash direction={direction}>{children}</Flash>;
    case "flip":
      return <Flip direction={direction}>{children}</Flip>;
    case "head-shake":
      return <HeadShake direction={direction}>{children}</HeadShake>;
    case "heart-beat":
      return <HeartBeat direction={direction}>{children}</HeartBeat>;
    case "jack-in-the-box":
      return <JackInTheBox direction={direction}>{children}</JackInTheBox>;
    case "jello":
      return <Jello direction={direction}>{children}</Jello>;
    case "light-speed":
      return <LightSpeed direction={direction}>{children}</LightSpeed>;
    case "pulse":
      return <Pulse direction={direction}>{children}</Pulse>;
    case "rotate":
      return <Rotate direction={direction}>{children}</Rotate>;
    case "rubber-band":
      return <RubberBand direction={direction}>{children}</RubberBand>;
    case "shake":
      return <Shake direction={direction}>{children}</Shake>;
    case "slide":
      return <Slide direction={direction}>{children}</Slide>;
    case "swing":
      return <Swing direction={direction}>{children}</Swing>;
    case "tada":
      return <Tada direction={direction}>{children}</Tada>;
    case "wobble":
      return <Wobble direction={direction}>{children}</Wobble>;
    case "zoom":
      return <Zoom direction={direction}>{children}</Zoom>;
    default:
      return <Fade direction={direction}>{children}</Fade>;
  }
};

export default Reveal;
