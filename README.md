# awesome-reveal: reveal-on-scroll animations for React, Vue, Astro and JavaScript

[![CI](https://github.com/awesome-reveal/awesome-reveal/actions/workflows/ci.yml/badge.svg?branch=next)](https://github.com/awesome-reveal/awesome-reveal/actions/workflows/ci.yml)
[![npm version](https://badgen.net/npm/v/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![npm downloads](https://badgen.net/npm/dt/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![GitHub stars](https://badgen.net/github/stars/awesome-reveal/awesome-reveal)](https://github.com/awesome-reveal/awesome-reveal/stargazers)
[![License](https://badgen.net/github/license/awesome-reveal/awesome-reveal)](LICENSE)

awesome-reveal adds reveal-on-scroll animations (fade-in, slide-in and more) to React, Vue, Astro and plain DOM code. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

<p align="center"><img src="https://raw.githubusercontent.com/awesome-reveal/awesome-reveal/next/.github/assets/demo.gif" alt="Elements fade, slide, scale and blur in as the page scrolls" width="640"></p>

Read the documentation at [awesome-reveal.dev](https://awesome-reveal.dev).

## Quick start

Install the package for your framework. You do not need to import a stylesheet.

```tsx
import { Reveal } from "@awesome-reveal/react";

<Reveal from="left">Hello</Reveal>;
```

```vue
<script setup>
import { Reveal, vReveal } from "@awesome-reveal/vue";
</script>
<template>
  <Reveal from="left">Hello</Reveal>
  <p v-reveal="{ from: { opacity: 0 } }">Pure fade</p>
</template>
```

```astro
---
import { Reveal } from "@awesome-reveal/astro";
---
<Reveal from="left">Hello</Reveal>
```

```ts
import { reveal, cascade } from "@awesome-reveal/core";

const hero = reveal(".hero");
reveal(".card", { from: "left" });
cascade(".features", { interval: 80 });
hero.dispose();
```

`@awesome-reveal/core` has no dependencies and needs no CSS. The framework packages hide server-rendered content until hydration. If the script fails, the content shows after 5 seconds. All the packages obey the reduced-motion preference automatically. For a custom animation, use native `Keyframe[]`.

## Packages

| Framework | Package                                                 | Version                                                                                                       |
| --------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| None      | [`@awesome-reveal/core`](packages/core)                 | [![npm](https://badgen.net/npm/v/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)   |
| Astro     | [`@awesome-reveal/astro`](packages/astro)               | [![npm](https://badgen.net/npm/v/@awesome-reveal/astro)](https://www.npmjs.com/package/@awesome-reveal/astro) |
| React     | [`@awesome-reveal/react`](packages/react)               | [![npm](https://badgen.net/npm/v/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react) |
| React     | [`react-awesome-reveal`](packages/react-awesome-reveal) | [![npm](https://badgen.net/npm/v/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal)   |
| Vue       | [`@awesome-reveal/vue`](packages/vue)                   | [![npm](https://badgen.net/npm/v/@awesome-reveal/vue)](https://www.npmjs.com/package/@awesome-reveal/vue)     |

Each package README documents its API. The [`@awesome-reveal/core` README](packages/core) documents the entrance and viewport options that the packages share.

Version 5 of `react-awesome-reveal` re-exports `@awesome-reveal/react` for v4 users. To migrate from v4, read [Migrating from v4](packages/react#migrating-from-v4).

The packages include agent skills that help a coding agent use the library. Each package README gives the names of its skills. The [`examples`](examples) folder has a small app for React, Vue, Astro and Next.js.

## Browser support

The packages use the native IntersectionObserver and Web Animations API. If one of these APIs is not available, the content reveals immediately and does not stay hidden. Read [Core browser support](packages/core#exports-and-browser-support).

## Contributing

Open pull requests against the `next` branch. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) to set up the workspace. [`AGENTS.md`](AGENTS.md) lists the commands for the build, the tests and the lint.

## Support

- Report a bug in the [issue tracker](https://github.com/awesome-reveal/awesome-reveal/issues).
- Use [Discussions](https://github.com/awesome-reveal/awesome-reveal/discussions) to ask a question or to suggest a feature.
- If awesome-reveal helps you, [star the repository](https://github.com/awesome-reveal/awesome-reveal) or [support its creator](https://github.com/sponsors/morellodev).

## License

[MIT](LICENSE)
