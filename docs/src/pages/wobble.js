import React from "react"
import { Grid } from "@chakra-ui/core"

// Components
import Card from "../components/card"
import Layout from "../components/layout"

export default ({ location }) => (
  <Layout location={location} title="Wobble">
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
        <Card key={index} animation="wobble" />
      ))}
    </Grid>
  </Layout>
)
