import React from "react"
import { Link as GatsbyLink } from "gatsby"
import { Button, Heading } from "@chakra-ui/react"

// Components
import Layout from "../components/layout"
import Section from "../components/section"

const NotFoundPage = ({ location }) => (
  <Layout location={location} title="Not Found">
    <Section>
      <Heading my={8} size="md">
        Page <code>{location.pathname}</code> does not exist
      </Heading>
    </Section>
    <Button as={GatsbyLink}>Home</Button>
  </Layout>
)

export default NotFoundPage
