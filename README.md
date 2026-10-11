# awesome-reveal

[![CI](https://github.com/awesome-reveal/awesome-reveal/actions/workflows/ci.yml/badge.svg?branch=next)](https://github.com/awesome-reveal/awesome-reveal/actions/workflows/ci.yml)
[![License](https://badgen.net/github/license/awesome-reveal/awesome-reveal)](LICENSE)

> [!TIP]
> If you like this library, please [consider supporting its creator](https://github.com/sponsors/morellodev).

Reveal-on-scroll animations for many frameworks. awesome-reveal uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

Read the documentation at [awesome-reveal.morello.dev](https://awesome-reveal.morello.dev).

```jsx
import { Reveal } from "@awesome-reveal/react";
import { slide } from "@awesome-reveal/react/keyframes";

<Reveal keyframes={slide({ direction: "left" })}>
  <p>I gently appear as I enter the viewport</p>
</Reveal>;
```

## Packages

| Framework | Package                                                 | Version                                                                                                       |
| --------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| None      | [`@awesome-reveal/core`](packages/core)                 | [![npm](https://badgen.net/npm/v/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)   |
| Astro     | [`@awesome-reveal/astro`](packages/astro)               | [![npm](https://badgen.net/npm/v/@awesome-reveal/astro)](https://www.npmjs.com/package/@awesome-reveal/astro) |
| React     | [`@awesome-reveal/react`](packages/react)               | [![npm](https://badgen.net/npm/v/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react) |
| React     | [`react-awesome-reveal`](packages/react-awesome-reveal) | [![npm](https://badgen.net/npm/v/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal)   |
| Vue       | [`@awesome-reveal/vue`](packages/vue)                   | [![npm](https://badgen.net/npm/v/@awesome-reveal/vue)](https://www.npmjs.com/package/@awesome-reveal/vue)     |

Use `@awesome-reveal/core` with plain DOM code. Its README documents the keyframes and the shared options. `react-awesome-reveal` 5 re-exports `@awesome-reveal/react`, for v4 users. To migrate from v4, read [Migrating from v4](packages/react#migrating-from-v4).

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later, are supported. Read [Browser support](packages/core#browser-support) for the fallbacks.

## Contributing

Open pull requests against the `next` branch. [`AGENTS.md`](AGENTS.md) lists the commands for the build, the tests and the lint.

## License

MIT
