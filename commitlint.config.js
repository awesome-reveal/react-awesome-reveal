export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // release-please copies a `BREAKING CHANGE:` footer into the changelog as one paragraph.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
