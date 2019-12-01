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
import { Flip } from "react-awesome-reveal"

// Effects
import effects from "../effects"

const NavLink = ({ to, location, ...props }) => (
  <Button
    as={GatsbyLink}
    width="100%"
    variant="ghost"
    variantColor="purple"
    my={2}
    to={to}
    isActive={location.pathname === withPrefix(to)}
    {...props}
  />
)

const EffectsDrawer = ({ isOpen, onClose, referrer, location }) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={referrer}
    >
      <DrawerOverlay />
      <DrawerContent color="purple.50" bg="gray.800">
        <DrawerCloseButton color="purple.50" borderRadius="50%" />
        <DrawerHeader>Effects</DrawerHeader>
        <DrawerBody overflowY="auto" pb={8}>
          <Stack as="nav" my={-2}>
            <Flip triggerOnce>
              {effects.map(effect => (
                <NavLink
                  key={effect.name}
                  to={`/${effect.name}`}
                  location={location}
                >
                  {effect.title}
                </NavLink>
              ))}
            </Flip>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default EffectsDrawer
