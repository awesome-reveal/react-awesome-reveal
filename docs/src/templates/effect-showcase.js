import React from "react"
import { Grid, Heading } from "@chakra-ui/core"
import { Fade } from "react-awesome-reveal"

// Components
import Card from "../components/card"
import Layout from "../components/layout"
import Section from "../components/section"

export default ({ location, pageContext }) => {
  const { title, directions, effect } = pageContext

  return (
    <Layout location={location} title={title} pb={[2, 4, 8, 16]}>
      {directions.map((direction, index) => (
        <Section key={index} height="0px" pb={0}>
          <Fade direction="bottom" triggerOnce>
            <Heading size="lg" mt={8}>
              Direction ={" "}
              <code>{direction ? `"${direction}"` : `${direction}`}</code>
            </Heading>
          </Fade>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ]}
            gap={8}
            my={8}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                h="15vw"
                animation={effect}
                direction={direction}
              />
            ))}
          </Grid>
        </Section>
      ))}
    </Layout>
  )
}
