import React from "react"
import PropTypes from "prop-types"
import { Box, DarkMode, Heading } from "@chakra-ui/react"
import { Fade } from "react-awesome-reveal"

import Footer from "./footer"
import Header from "./header"
import SEO from "./seo"

const Layout = ({
  children,
  location,
  title,
  showTitle = true,
  animateHeader = false,
  showNavbar = true,
  showNavbarMenu = true,
  showNavbarLeftContent = true,
  showNavbarRightContent = true,
  navbarLeftContent,
  showFooter = true,
  ...rest
}) => (
  <DarkMode>
    <SEO title={title} />
    <Box
      overflowX="hidden"
      overflowY="scroll"
      bg="gray.800"
      color="purple.50"
      mt={showNavbar ? 16 : 0}
    >
      {showNavbar && (
        <Header
          location={location}
          animateHeader={animateHeader}
          leftContent={navbarLeftContent}
          showMenu={showNavbarMenu}
          showLeft={showNavbarLeftContent}
          showRight={showNavbarRightContent}
        />
      )}
      <Box
        as="main"
        px={4}
        mx="auto"
        width={["100%", "100%", "100%", "66.667%"]}
        {...rest}
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
      {showFooter && <Footer />}
    </Box>
  </DarkMode>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
