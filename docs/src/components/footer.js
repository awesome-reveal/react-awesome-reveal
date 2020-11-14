import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Box, Link, Stack, Text } from "@chakra-ui/react"
import { Fade } from "react-awesome-reveal"

import Copyleft from "./copyleft"
import HeartIcon from "../icons/heart"

const Footer = () => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          author {
            name
            website
          }
        }
      }
    }
  `)

  return (
    <Box as="footer" backgroundColor="gray.900" p={[8, 16]} overflow="hidden">
      <Fade direction="top">
        <Stack color="gray.400">
          <Text textAlign="center">
            Made in Italy with <HeartIcon color="red.600" aria-label="Heart" />
          </Text>
          <Text textAlign="center" mt={[0, 0, 2, 2]}>
            Copyleft <Copyleft /> {new Date().getFullYear()}{" "}
            <Link href={site.siteMetadata.author.website} isExternal>
              {site.siteMetadata.author.name}
            </Link>
          </Text>
        </Stack>
      </Fade>
    </Box>
  )
}

export default Footer
