import baseConfig from "../../.lintstagedrc.mjs";

export default {
  ...baseConfig,
  "*.{js,jsx,ts,tsx}": "eslint --fix",
};
