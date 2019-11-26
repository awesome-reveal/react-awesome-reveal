import React from "react"
import { Box, Button } from "@chakra-ui/core"
import {
  Bounce,
  Fade,
  Flip,
  LightSpeed,
  Rotate,
  Slide,
  Swing,
  Tada,
  Zoom,
} from "react-awesome-reveal"

const Card = ({ animation, ...rest }) => {
  const box = (
    <Box w="100%" h={64} as={Button} variantColor="purple" {...rest} />
  )

  switch (animation) {
    case "bounce":
      return <Bounce>{box}</Bounce>
    case "flip":
      return <Flip>{box}</Flip>
    case "lightSpeed":
      return <LightSpeed>{box}</LightSpeed>
    case "rotate":
      return <Rotate>{box}</Rotate>
    case "slide":
      return <Slide>{box}</Slide>
    case "swing":
      return <Swing>{box}</Swing>
    case "tada":
      return <Tada>{box}</Tada>
    case "zoom":
      return <Zoom>{box}</Zoom>
    default:
      return <Fade>{box}</Fade>
  }
}

export default Card
