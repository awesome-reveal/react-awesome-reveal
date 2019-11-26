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

const Card = ({ animation, ...rest }) => {
  const box = (
    <Box w="100%" h={64} as={Button} variantColor="purple" {...rest} />
  )

  switch (animation) {
    case "bounce":
      return <Bounce>{box}</Bounce>
    case "flash":
      return <Flash>{box}</Flash>
    case "flip":
      return <Flip>{box}</Flip>
    case "headShake":
      return <HeadShake>{box}</HeadShake>
    case "heartBeat":
      return <HeartBeat>{box}</HeartBeat>
    case "jackInTheBox":
      return <JackInTheBox>{box}</JackInTheBox>
    case "jello":
      return <Jello>{box}</Jello>
    case "lightSpeed":
      return <LightSpeed>{box}</LightSpeed>
    case "pulse":
      return <Pulse>{box}</Pulse>
    case "rubberBand":
    case "rotate":
      return <Rotate>{box}</Rotate>
    case "rubberBand":
      return <RubberBand>{box}</RubberBand>
    case "shake":
      return <Shake>{box}</Shake>
    case "slide":
      return <Slide>{box}</Slide>
    case "swing":
      return <Swing>{box}</Swing>
    case "tada":
      return <Tada>{box}</Tada>
    case "wobble":
      return <Wobble>{box}</Wobble>
    case "zoom":
      return <Zoom>{box}</Zoom>
    default:
      return <Fade>{box}</Fade>
  }
}

export default Card
