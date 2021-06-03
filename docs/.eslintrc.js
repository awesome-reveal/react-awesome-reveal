module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: "react-app",
  plugins: ["react-hooks", "simple-import-sort"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
