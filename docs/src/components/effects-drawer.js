import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import { Link as GatsbyLink, withPrefix } from "gatsby";
import React from "react";
import { Flip } from "react-awesome-reveal";

import effects from "../effects";

const NavLink = ({ to, location, ...props }) => (
  <Button
    as={GatsbyLink}
    width="100%"
    variant="ghost"
    colorScheme="purple"
    my={2}
    to={to}
    isActive={location.pathname === withPrefix(to)}
    {...props}
  />
);

const EffectsDrawer = ({ isOpen, onClose, referrer, location }) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={referrer}
    >
      <DrawerOverlay>
        <DrawerContent color="purple.50" bg="gray.800">
          <DrawerCloseButton color="purple.50" borderRadius="50%" />
          <DrawerHeader>Effects</DrawerHeader>

          <DrawerBody overflowY="auto" pb={8}>
            <VStack as="nav">
              <Flip triggerOnce>
                {effects.map((effect) => (
                  <NavLink
                    key={effect.name}
                    to={`/${effect.name}`}
                    location={location}
                  >
                    {effect.title}
                  </NavLink>
                ))}
              </Flip>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default EffectsDrawer;
