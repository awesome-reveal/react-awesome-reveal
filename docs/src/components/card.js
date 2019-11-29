import React from "react"
import { Box, Button } from "@chakra-ui/core"
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
} from "react-awesome-reveal"

const Card = ({ animation, direction, ...rest }) => {
  const box = (
    <Button w="100%" h={64} variantColor="purple" as={Box} {...rest} />
  )

  switch (animation) {
    case "bounce":
      return <Bounce direction={direction}>{box}</Bounce>
    case "flash":
      return <Flash direction={direction}>{box}</Flash>
    case "flip":
      return <Flip direction={direction}>{box}</Flip>
    case "head-shake":
      return <HeadShake direction={direction}>{box}</HeadShake>
    case "heart-beat":
      return <HeartBeat direction={direction}>{box}</HeartBeat>
    case "jack-in-the-box":
      return <JackInTheBox direction={direction}>{box}</JackInTheBox>
    case "jello":
      return <Jello direction={direction}>{box}</Jello>
    case "light-speed":
      return <LightSpeed direction={direction}>{box}</LightSpeed>
    case "pulse":
      return <Pulse direction={direction}>{box}</Pulse>
    case "rotate":
      return <Rotate direction={direction}>{box}</Rotate>
    case "rubber-band":
      return <RubberBand direction={direction}>{box}</RubberBand>
    case "shake":
      return <Shake direction={direction}>{box}</Shake>
    case "slide":
      return <Slide direction={direction}>{box}</Slide>
    case "swing":
      return <Swing direction={direction}>{box}</Swing>
    case "tada":
      return <Tada direction={direction}>{box}</Tada>
    case "wobble":
      return <Wobble direction={direction}>{box}</Wobble>
    case "zoom":
      return <Zoom direction={direction}>{box}</Zoom>
    default:
      return <Fade direction={direction}>{box}</Fade>
  }
}

export default Card
