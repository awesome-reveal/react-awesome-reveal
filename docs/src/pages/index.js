import React, { useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Heading, Button, Flex, useDisclosure } from "@chakra-ui/core"
import { Zoom } from "react-awesome-reveal"

// Components
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
          <Flex mt={16} direction={{ xs: "column", sm: "row" }}>
            <Button
              ref={getStartedButtonRef}
              size="lg"
              variantColor="purple"
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
              variantColor="purple"
              onClick={onEffectsDrawerOpen}
              variant="outline"
              width={{ sm: "full" }}
            >
              Browse
            </Button>
          </Flex>
        </Zoom>
      </Section>
    </Layout>
  )
}
