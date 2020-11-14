import React from "react"
import { Button, Heading } from "@chakra-ui/react"

// Components
import Layout from "../components/layout"
import Reveal from "../components/reveal"
import Section from "../components/section"

export default ({ location, pageContext }) => {
  const { title, directions, effect } = pageContext

  return (
    <Layout
      location={location}
      title={title}
      showTitle={false}
      navbarLeftContent={
        <Heading size="md" color="purple.50">
          {title}
        </Heading>
      }
    >
      {directions.map((direction, index) => (
        <Section key={index} px={[4, 12]} pb={0} justify="center">
          <Reveal animation={effect} direction={direction}>
            <Button
              h="15vw"
              minH={32}
              maxH="calc(100vh - 4rem)"
              width="100%"
              colorScheme="purple"
            >
              {direction && (
                <Heading size="lg">
                  <span>
                    Direction = <code>{`"${direction}"`}</code>
                  </span>
                </Heading>
              )}
            </Button>
          </Reveal>
        </Section>
      ))}
    </Layout>
  )
}
