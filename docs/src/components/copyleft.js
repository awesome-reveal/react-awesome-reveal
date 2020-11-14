import React from "react"
import { Text } from "@chakra-ui/react"

const Copyleft = () => {
  return (
    <Text
      as="span"
      css={{
        display: "inline-block",
        transform: "rotateY(180deg)",
        "::after": { content: "'\\00a9'" },
      }}
    />
  )
}

export default Copyleft
