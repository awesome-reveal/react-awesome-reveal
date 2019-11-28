import React from "react"
import PropTypes from "prop-types"
import { Box, Heading, DarkMode } from "@chakra-ui/core"
import { Fade } from "react-awesome-reveal"

import Header from "./header"
import SEO from "./seo"

const Layout = ({
  children,
  location,
  title,
  animateHeader = false,
  showNavbar = true,
  showNavbarLeftContent = true,
  showNavbarRightContent = true,
  showTitle = true,
}) => (
  <DarkMode>
    <SEO title={title} />
    <Box
      overflowX="hidden"
      bg="gray.800"
      color="purple.50"
      mt={showNavbar ? 16 : 0}
    >
      {showNavbar && (
        <Header
          location={location}
          animateHeader={animateHeader}
          showLeft={showNavbarLeftContent}
          showRight={showNavbarRightContent}
        />
      )}
      <Box
        as="main"
        px={4}
        mx="auto"
        width={["100%", "100%", "100%", "66.667%"]}
      >
        {showTitle && (
          <Fade direction="bottom" triggerOnce>
            <Heading mt={[2, 4, 8, 16]} size="2xl">
              {title}
            </Heading>
          </Fade>
        )}
        {children}
      </Box>
    </Box>
  </DarkMode>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
