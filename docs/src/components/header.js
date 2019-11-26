import React from "react"
import { Link as GatsbyLink, withPrefix } from "gatsby"
import { Flex, Button, Box, useColorMode } from "@chakra-ui/core"
import { Fade } from "react-awesome-reveal"

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
      backgroundColor={
        colorMode === "dark"
          ? "rgba(26, 32, 44, 0.867)"
          : "rgba(255, 255, 255, 0.7)"
      }
      style={{
        backdropFilter: "saturate(50%) blur(20px)",
        WebkitBackdropFilter: "saturate(50%) blur(20px)",
      }}
      p={2}
      position="fixed"
      zIndex="sticky"
      top={0}
      left={0}
      right={0}
      height={16}
      alignItems="center"
      justifyContent="space-between"
      overflowX="auto"
      overflowY="hidden"
    >
      <Fade direction="left">
        <Flex as="nav">
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
        </Flex>
        <Box>{/** Put here right content */}</Box>
      </Fade>
    </Flex>
  )
}

export default Header
