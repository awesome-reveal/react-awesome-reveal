import React from "react"
import { Flex } from "@chakra-ui/core"

const Section = ({ children, hasNavbar = true }) => (
  <Flex
    as="section"
    minH={hasNavbar ? "calc(100vh - 4rem)" : "100vh"}
    align="center"
    justify="center"
    direction="column"
    pb={hasNavbar ? 16 : 0}
  >
    {children}
  </Flex>
)

export default Section
