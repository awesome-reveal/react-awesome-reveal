import React from "react"
import { Link as GatsbyLink } from "gatsby"
import { Heading, Button } from "@chakra-ui/core"

// Components
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = ({ location }) => (
  <Layout showNavbar={false}>
    <SEO title="404: Not found" />
    <Heading mb={4}>Not Found</Heading>
    <Heading mb={8} size="md">
      Page <code>{location.pathname}</code> does not exist
    </Heading>
    <Button as={GatsbyLink}>Home</Button>
  </Layout>
)

export default NotFoundPage
