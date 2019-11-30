import React from "react"
import { theme } from "@chakra-ui/core"

export default {
  ...theme,
  icons: {
    ...theme.icons,
    hamburger: {
      path: (
        <path
          fill="currentColor"
          d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z"
        />
      ),
      viewBox: "0 0 512 512",
    },
  },
}
