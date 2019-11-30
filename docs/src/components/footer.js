import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Box, Icon, Link, Stack, Text } from "@chakra-ui/core"
import { Fade } from "react-awesome-reveal"

const Footer = () => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          year
          author {
            website
          }
        }
      }
    }
  `)

  return (
    <Box as="footer" backgroundColor="gray.900" p={[2, 4, 8, 16]}>
      <Fade direction="top">
        <Stack color="gray.400">
          <Text textAlign="center">
            Made in Italy with{" "}
            <Icon name="heart" color="red.600" aria-label="Heart" />
          </Text>
          <Text textAlign="center" mt={[0, 0, 2, 2]}>
            Copyright &copy; {site.siteMetadata.year}{" "}
            <Link
              href={site.siteMetadata.author.website}
              target="_blank"
              rel="noopener"
            >
              Dennis Morello
            </Link>
          </Text>
        </Stack>
      </Fade>
    </Box>
  )
}

export default Footer
