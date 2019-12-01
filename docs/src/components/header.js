import React, { useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import {
  Box,
  Button,
  Flex,
  Stack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/core"
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

  const { isOpen, onOpen, onClose } = useDisclosure()
  const drawerButtonRef = useRef()

  const headerContent = (
    <Stack isInline alignItems="center">
      {showMenu && (
        <IconButton
          onClick={onOpen}
          ref={drawerButtonRef}
          aria-label="Open Effects Drawer"
          variantColor="purple"
          icon="hamburger"
          variant="ghost"
          isRound
        />
      )}
      {showMenu && (
        <EffectsDrawer
          isOpen={isOpen}
          onClose={onClose}
          drawerButtonRef={drawerButtonRef}
          location={location}
        />
      )}

      {showLeft && leftContent}

      <Box flexGrow={1} />

      {showRight && (
        <Button
          variantColor="purple"
          variant="ghost"
          as="a"
          target="_blank"
          rel="noopener"
          href={site.siteMetadata.githubUrl}
        >
          GitHub
        </Button>
      )}
    </Stack>
  )

  return (
    <Flex
      as="header"
      boxShadow="sm"
      backgroundColor="gray.800"
      py={2}
      px={4}
      position="fixed"
      zIndex="sticky"
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
