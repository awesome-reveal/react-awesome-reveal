module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: "react-app",
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
}
