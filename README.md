# awesome-reveal: reveal on scroll animations for React, Vue, Astro and JavaScript

[![CI](https://github.com/awesome-reveal/awesome-reveal/actions/workflows/ci.yml/badge.svg?branch=next)](https://github.com/awesome-reveal/awesome-reveal/actions/workflows/ci.yml)
[![npm version](https://badgen.net/npm/v/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![npm downloads](https://badgen.net/npm/dt/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![GitHub stars](https://badgen.net/github/stars/awesome-reveal/awesome-reveal)](https://github.com/awesome-reveal/awesome-reveal/stargazers)
[![License](https://badgen.net/github/license/awesome-reveal/awesome-reveal)](LICENSE)

awesome-reveal adds reveal-on-scroll animations (fade-in, slide-in and more) to React, Vue, Astro and plain DOM code. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

<p align="center"><img src="https://raw.githubusercontent.com/awesome-reveal/awesome-reveal/next/.github/assets/demo.gif" alt="Elements fade, slide, scale and blur in as the page scrolls" width="640"></p>

Read the documentation at [awesome-reveal.dev](https://awesome-reveal.dev).

## Features

- 🪶 **Tiny** – No third-party dependencies. Your bundle includes only the keyframes factories that you import.
- 🧩 **One behavior, many frameworks** – All the adapters share one core, so they have the same options and the same behavior.
- ⚙️ **Native APIs** – No animation loop in JavaScript. Web Animations run on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree.
- 💻 **SSR** – The React, Vue and Astro adapters render content hidden on the server, so it does not flash before the script runs.
- 🏷 **TypeScript** – Strict types for the options and the keyframes.

## Quick start

Install the package for your framework. The examples use `npm install`. You can also use `pnpm add`, `yarn add` or `bun add`.

### React

```sh
npm install @awesome-reveal/react
```

```tsx
import { Reveal } from "@awesome-reveal/react";
import { slide } from "@awesome-reveal/react/keyframes";

<Reveal keyframes={slide({ direction: "left" })}>
  <p>I gently appear as I enter the viewport</p>
</Reveal>;
```

### Vue

```sh
npm install @awesome-reveal/vue
```

```vue
<script setup>
import { vReveal } from "@awesome-reveal/vue";
import { slide } from "@awesome-reveal/vue/keyframes";

const fromLeft = slide({ direction: "left" });
</script>

<template>
  <p v-reveal="{ keyframes: fromLeft }">I gently appear as I enter the viewport</p>
</template>
```

### Astro

```sh
npm install @awesome-reveal/astro
```

```astro
---
import { Reveal } from "@awesome-reveal/astro";
import { slide } from "@awesome-reveal/astro/keyframes";
---

<Reveal keyframes={slide({ direction: "left" })}>
  <p>I gently appear as I enter the viewport</p>
</Reveal>
```

### Plain DOM

```sh
npm install @awesome-reveal/core
```

```ts
import { reveal } from "@awesome-reveal/core";
import { slide } from "@awesome-reveal/core/keyframes";

reveal(document.querySelector(".hero")!, { keyframes: slide({ direction: "left" }) });
```

## Packages

| Framework | Package                                                 | Version                                                                                                       |
| --------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| None      | [`@awesome-reveal/core`](packages/core)                 | [![npm](https://badgen.net/npm/v/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)   |
| Astro     | [`@awesome-reveal/astro`](packages/astro)               | [![npm](https://badgen.net/npm/v/@awesome-reveal/astro)](https://www.npmjs.com/package/@awesome-reveal/astro) |
| React     | [`@awesome-reveal/react`](packages/react)               | [![npm](https://badgen.net/npm/v/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react) |
| React     | [`react-awesome-reveal`](packages/react-awesome-reveal) | [![npm](https://badgen.net/npm/v/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal)   |
| Vue       | [`@awesome-reveal/vue`](packages/vue)                   | [![npm](https://badgen.net/npm/v/@awesome-reveal/vue)](https://www.npmjs.com/package/@awesome-reveal/vue)     |

Each package README documents its API. The [`@awesome-reveal/core` README](packages/core) also documents the keyframes and the options that all the packages share.

`react-awesome-reveal` 5 re-exports `@awesome-reveal/react`, for v4 users. To migrate from v4, read [Migrating from v4](packages/react#migrating-from-v4).

The packages ship agent skills that help a coding agent use the library. Each package README describes them. The [`examples`](examples) folder has a small app for React, Vue and Astro.

## Browser support

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later. Read [Browser support](packages/core#browser-support) for the fallbacks.

## Contributing

Open pull requests against the `next` branch. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) to set up the workspace. [`AGENTS.md`](AGENTS.md) lists the commands for the build, the tests and the lint.

## Support

- Report a bug in the [issue tracker](https://github.com/awesome-reveal/awesome-reveal/issues).
- Ask a question or suggest a feature in [Discussions](https://github.com/awesome-reveal/awesome-reveal/discussions).
- If awesome-reveal helps you, [star the repository](https://github.com/awesome-reveal/awesome-reveal) or [consider supporting its creator](https://github.com/sponsors/morellodev).

## License

[MIT](LICENSE)
