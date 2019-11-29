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

// Effects
import effects from "../effects"

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
      <DrawerContent color="purple.50" bg="gray.800">
        <DrawerCloseButton color="purple.50" borderRadius="50%" />
        <DrawerHeader>Effects</DrawerHeader>
        <DrawerBody overflowY="auto" pb={8}>
          <Stack as="nav" shouldWrapChildren spacing={4}>
            {effects.map(effect => (
              <NavLink
                key={effect.name}
                to={`/${effect.name}`}
                location={location}
              >
                {effect.title}
              </NavLink>
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default EffectsDrawer
