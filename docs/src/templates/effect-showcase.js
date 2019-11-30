import React from "react"
import { Button, Heading } from "@chakra-ui/core"

// Components
import Reveal from "../components/reveal"
import Layout from "../components/layout"
import Section from "../components/section"

export default ({ location, pageContext }) => {
  const { title, directions, effect } = pageContext

  return (
    <Layout
      location={location}
      title={title}
      showTitle={false}
      navbarLeftContent={
        <Heading size="md" pl={2} color="purple.50">
          {title}
        </Heading>
      }
    >
      {directions.map((direction, index) => (
        <Section key={index} pb={0} justify="center">
          <Reveal animation={effect} direction={direction}>
            <Button
              h="20vw"
              maxH="calc(100vh - 4rem)"
              width="100%"
              variantColor="purple"
            >
              <Heading size="lg">
                Direction ={" "}
                <code>{direction ? `"${direction}"` : `${direction}`}</code>
              </Heading>
            </Button>
          </Reveal>
        </Section>
      ))}
    </Layout>
  )
}
