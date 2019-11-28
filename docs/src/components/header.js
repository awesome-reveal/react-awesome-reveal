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
      {showLeft && (
        <IconButton
          onClick={onOpen}
          ref={drawerButtonRef}
          aria-label="Open Effects Drawer"
          variantColor="purple"
          icon="search-2"
          variant="ghost"
          isRound
        />
      )}
      {showLeft && (
        <EffectsDrawer
          isOpen={isOpen}
          onClose={onClose}
          drawerButtonRef={drawerButtonRef}
          location={location}
        />
      )}

      <Box flexGrow={1} />

      {showRight && (
        <Button
          variantColor="purple"
          variant="outline"
          as="a"
          target="_blank"
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
