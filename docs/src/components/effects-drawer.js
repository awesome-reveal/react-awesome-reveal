import React from "react"
import { Link as GatsbyLink, withPrefix } from "gatsby"
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  Button,
} from "@chakra-ui/core"

const NavLink = ({ to, location, ...props }) => (
  <Button
    as={GatsbyLink}
    width="100%"
    variant="ghost"
    variantColor="purple"
    borderRadius={20}
    to={to}
    isActive={location.pathname === withPrefix(to)}
    {...props}
  />
)

const EffectsDrawer = ({ isOpen, onClose, drawerButtonRef, location }) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={drawerButtonRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Effects</DrawerHeader>
        <DrawerBody overflowY="auto" pb={4}>
          <Stack as="nav" shouldWrapChildren spacing={4}>
            <NavLink to="/bounce" location={location}>
              Bounce
            </NavLink>
            <NavLink to="/fade" location={location}>
              Fade
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default EffectsDrawer
