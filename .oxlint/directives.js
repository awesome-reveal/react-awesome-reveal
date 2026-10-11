const disableDirective = /^\s*(?:oxlint|eslint)-disable(?:-next-line|-line)?(?:\s|$)/;
const description = /\s--\s*\S/;

const requireDescription = {
  meta: {
    type: "suggestion",
    docs: { description: "Require a reason after `--` in disable directives." },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (disableDirective.test(comment.value) && !description.test(comment.value)) {
            context.report({
              loc: comment.loc,
              message: "Explain the disable directive: add ` -- <reason>` after the rule names.",
            });
          }
        }
      },
    };
  },
};

export default {
  meta: { name: "directives" },
  rules: { "require-description": requireDescription },
};
