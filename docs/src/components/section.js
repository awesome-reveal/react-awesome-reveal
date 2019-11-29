import React from "react"
import { Flex } from "@chakra-ui/core"

const Section = ({ children, hasNavbar = true, height = "100vh", ...rest }) => (
  <Flex
    as="section"
    minH={hasNavbar ? `calc(${height} - 4rem)` : height}
    pb={hasNavbar ? 16 : 0}
    direction="column"
    {...rest}
  >
    {children}
  </Flex>
)

export default Section
