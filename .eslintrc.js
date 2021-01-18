module.exports = {
  extends: [
    "react-app",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  plugins: ["@emotion"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
};
