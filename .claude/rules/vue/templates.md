---
paths:
  - "**/*.vue"
---

# Vue single-file components

Obey the [Vue Style Guide](https://vuejs.org/style-guide/) in each `.vue` file. oxfmt applies only the multi-attribute rule, through `singleAttributePerLine` in `.oxfmtrc.json`. Apply these rules yourself:

- Order the blocks `<script>`, `<template>`, `<style>`, with one blank line between two blocks.
- Use PascalCase component names in templates, and self-close a component that has no content.
- Put each attribute value in quotes. Use the `:`, `@` and `#` shorthands.
- Order the attributes as the "Element attribute order" rule tells: `v-for`, conditionals, `ref` and `key`, `v-model`, other attributes, events, then content. Put a custom directive, such as `v-reveal`, before the other attributes, as the default order of the eslint-plugin-vue `attributes-order` rule does.
- Give new components multi-word names. `Reveal` is the exception, because it is the public name of the package component.

Do not set `htmlWhitespaceSensitivity: "ignore"` for Vue files. It can trim the spaces in inline elements and change the rendered text.

With the default whitespace sensitivity, oxfmt moves the `>` of a multi-line element to the next line when the text touches the tags. Put the text on its own line between the opening and the closing tag.
