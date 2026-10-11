// A task in the "*" list runs after the formatter; a separate glob would run at the same time.
const testRelated = (files) => {
  const sources = files.filter((file) => /\.(tsx?|vue|svelte)$/.test(file));
  return sources.length
    ? `vitest related --run --project "*:unit" --project "*:ssr" ${sources.map((file) => JSON.stringify(file)).join(" ")}`
    : [];
};

export default {
  "*": [
    "oxlint --fix --no-error-on-unmatched-pattern",
    "oxfmt --no-error-on-unmatched-pattern",
    testRelated,
  ],
};
