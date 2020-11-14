import React, { useRef } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Button, Heading, Stack, useDisclosure } from "@chakra-ui/react"
import { Zoom } from "react-awesome-reveal"

import EffectsDrawer from "../components/effects-drawer"
import GetStartedModal from "../components/get-started-modal"
import Layout from "../components/layout"
import Section from "../components/section"

export default ({ location }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  const {
    isOpen: isGetStartedModalOpen,
    onOpen: onGetStartedModalOpen,
    onClose: onGetStartedModalClose,
  } = useDisclosure()

  const {
    isOpen: isEffectsDrawerOpen,
    onOpen: onEffectsDrawerOpen,
    onClose: onEffectsDrawerClose,
  } = useDisclosure()

  const getStartedButtonRef = useRef()
  const effectsDrawerButtonRef = useRef()

  return (
    <Layout
      location={location}
      showTitle={false}
      animateHeader
      showNavbarMenu={false}
    >
      <EffectsDrawer
        isOpen={isEffectsDrawerOpen}
        onClose={onEffectsDrawerClose}
        referrer={effectsDrawerButtonRef}
        location={location}
      />
      <GetStartedModal
        isOpen={isGetStartedModalOpen}
        onClose={onGetStartedModalClose}
        referrer={getStartedButtonRef}
      />
      <Section align="center" justify="center">
        <Zoom triggerOnce>
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            fontWeight={900}
            letterSpacing="tighter"
          >
            {site.siteMetadata.title}
          </Heading>
        </Zoom>
        <Zoom direction="bottom" triggerOnce>
          <Stack direction={["column", "row"]} mt={16} spacing={4}>
            <Button
              ref={getStartedButtonRef}
              size="lg"
              colorScheme="purple"
              onClick={onGetStartedModalOpen}
              mr={{ xs: 0, sm: 4 }}
              mb={{ xs: 4, sm: 0 }}
              width={{ sm: "full" }}
            >
              Get Started
            </Button>
            <Button
              ref={effectsDrawerButtonRef}
              size="lg"
              colorScheme="purple"
              onClick={onEffectsDrawerOpen}
              variant="outline"
              width={{ sm: "full" }}
            >
              Effects
            </Button>
          </Stack>
        </Zoom>
      </Section>
    </Layout>
  )
}
