import React, { useEffect, useRef, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react"
import { HamburgerIcon } from "@chakra-ui/icons"
import { Fade } from "react-awesome-reveal"

// Components
import EffectsDrawer from "./effects-drawer"

const Header = ({
  location,
  animateHeader,
  leftContent,
  showMenu = true,
  showLeft = true,
  showRight = true,
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            githubUrl
          }
        }
      }
    `
  )

  const [showHeaderShadow, setShowHeaderShadow] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const drawerButtonRef = useRef()

  useEffect(() => {
    function onScrollHandler() {
      setShowHeaderShadow(window.scrollY > 64)
    }

    window.addEventListener("scroll", onScrollHandler)

    return () => {
      window.removeEventListener("scroll", onScrollHandler)
    }
  }, [])

  const headerContent = (
    <Flex direction="row" alignItems="center" justifyContent="space-between">
      <HStack>
        {showMenu && (
          <HStack>
            <IconButton
              onClick={onOpen}
              ref={drawerButtonRef}
              aria-label="Open Effects Drawer"
              colorScheme="purple"
              icon={<HamburgerIcon />}
              variant="ghost"
              isRound
            />
            <EffectsDrawer
              isOpen={isOpen}
              onClose={onClose}
              drawerButtonRef={drawerButtonRef}
              location={location}
            />
          </HStack>
        )}

        {showLeft && leftContent}
      </HStack>

      {showRight && (
        <Button
          colorScheme="purple"
          variant="ghost"
          as="a"
          target="_blank"
          rel="noopener noreferrer"
          href={site.siteMetadata.githubUrl}
        >
          GitHub
        </Button>
      )}
    </Flex>
  )

  return (
    <Flex
      as="header"
      boxShadow={showHeaderShadow ? "base" : null}
      backgroundColor="gray.800"
      py={2}
      px={4}
      position="fixed"
      zIndex={1}
      top={0}
      left={0}
      right={0}
      height={16}
      flexDirection="column"
      justifyContent="center"
    >
      {animateHeader ? (
        <Fade direction="bottom">{headerContent}</Fade>
      ) : (
        headerContent
      )}
    </Flex>
  )
}

export default Header
