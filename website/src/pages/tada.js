import React from "react"
import { Heading, Grid } from "@chakra-ui/core"

// Components
import Card from "../components/card"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ location }) => (
  <Layout location={location} title="Tada">
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
      {Array.from({ length: 120 }).map((_, index) => (
        <Card key={index} animation="tada" />
      ))}
    </Grid>
  </Layout>
)
