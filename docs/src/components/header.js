import React from "react"
import { Link as GatsbyLink, withPrefix } from "gatsby"
import { Flex, Button, Box, Stack, useColorMode } from "@chakra-ui/core"

const NavLink = ({ to, location, ...props }) => (
  <Button
    as={GatsbyLink}
    variant="ghost"
    variantColor="purple"
    borderRadius={20}
    to={to}
    mx={2}
    isActive={location.pathname === withPrefix(to)}
    {...props}
  />
)

const Header = ({ location }) => {
  const { colorMode } = useColorMode()

  return (
    <Flex
      as="header"
      boxShadow="sm"
      backgroundColor={colorMode === "dark" ? "gray.800" : "white"}
      p={2}
      position="fixed"
      zIndex="sticky"
      top={0}
      left={0}
      right={0}
      height={16}
      maxW="100%"
      alignItems="center"
      justifyContent="space-between"
      overflowX="auto"
      overflowY="hidden"
    >
      <Stack as="nav" shouldWrapChildren isInline>
        <NavLink to="/" location={location}>
          Fade
        </NavLink>
        <NavLink to="/bounce" location={location}>
          Bounce
        </NavLink>
        <NavLink to="/flash" location={location}>
          Flash
        </NavLink>
        <NavLink to="/flip" location={location}>
          Flip
        </NavLink>
        <NavLink to="/headshake" location={location}>
          Head Shake
        </NavLink>
        <NavLink to="/heartbeat" location={location}>
          Heart Beat
        </NavLink>
        <NavLink to="/jackinthebox" location={location}>
          Jack In The Box
        </NavLink>
        <NavLink to="/jello" location={location}>
          Jello
        </NavLink>
        <NavLink to="/lightspeed" location={location}>
          Light Speed
        </NavLink>
        <NavLink to="/pulse" location={location}>
          Pulse
        </NavLink>
        <NavLink to="/rotate" location={location}>
          Rotate
        </NavLink>
        <NavLink to="/rubberband" location={location}>
          Rubber Band
        </NavLink>
        <NavLink to="/shake" location={location}>
          Shake
        </NavLink>
        <NavLink to="/slide" location={location}>
          Slide
        </NavLink>
        <NavLink to="/swing" location={location}>
          Swing
        </NavLink>
        <NavLink to="/tada" location={location}>
          Tada
        </NavLink>
        <NavLink to="/wobble" location={location}>
          Wobble
        </NavLink>
        <NavLink to="/zoom" location={location}>
          Zoom
        </NavLink>
      </Stack>
      <Box>{/** Put here right content */}</Box>
    </Flex>
  )
}

export default Header
