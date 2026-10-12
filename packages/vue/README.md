# @awesome-reveal/vue

[![npm version](https://badgen.net/npm/v/@awesome-reveal/vue)](https://www.npmjs.com/package/@awesome-reveal/vue)
[![npm downloads](https://badgen.net/npm/dt/@awesome-reveal/vue)](https://www.npmjs.com/package/@awesome-reveal/vue)
[![Types](https://badgen.net/npm/types/@awesome-reveal/vue)](https://www.npmjs.com/package/@awesome-reveal/vue)
[![License](https://badgen.net/npm/license/@awesome-reveal/vue)](https://www.npmjs.com/package/@awesome-reveal/vue)

[awesome-reveal](https://awesome-reveal.morello.dev) adds reveal-on-scroll animations to Vue apps. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

<p align="center"><img src="https://raw.githubusercontent.com/awesome-reveal/awesome-reveal/next/.github/assets/demo.gif" alt="Elements fade, slide, scale and blur in as the page scrolls" width="640"></p>

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Entry points](#entry-points)
- [Keyframes](#keyframes)
- [The `v-reveal` directive](#the-v-reveal-directive)
- [The `Reveal` component](#the-reveal-component)
- [Options](#options)
- [Server-side rendering](#server-side-rendering)
- [Recipes](#recipes)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Agent skills](#agent-skills)
- [Support](#support)
- [License](#license)

## Features

- 🪶 **Tiny** – No third-party dependencies. `v-reveal` adds about 1.5 kB gzipped to your bundle, and `Reveal` with one keyframes factory adds about 1.8 kB.
- 🌳 **Tree-shakeable** – Each keyframes factory is a small function. Your bundle includes only the factories that you import.
- 🧩 **Composable** – Use the `v-reveal` directive on your own elements, or the `Reveal` component.
- ⚙️ **Native APIs** – Intersection Observer detects the reveal. Web Animations run it on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree.
- 💻 **SSR** – Content renders hidden on the server, with the directive and with the component.
- 🏷 **TypeScript** – Strict types for the directive value, the props and the keyframes.

## Installation

```sh
npm install @awesome-reveal/vue
```

Use `pnpm add`, `yarn add` or `bun add` in the same way.

Vue 3.5 or a later Vue 3 version is necessary. TypeScript needs `moduleResolution` set to `bundler`, `node16` or `nodenext`, because the package uses `exports` for `/keyframes`.

## Quick start

```vue
<script setup>
import { vReveal } from "@awesome-reveal/vue";
</script>

<template>
  <p v-reveal>I gently appear as I enter the viewport</p>
</template>
```

With no `keyframes`, the element fades in and moves up, as with `slide()`. To choose another animation, see [Keyframes](#keyframes).

## Entry points

| Import path                     | Contents                                                    |
| ------------------------------- | ----------------------------------------------------------- |
| `@awesome-reveal/vue`           | The `v-reveal` directive and the `Reveal` component.        |
| `@awesome-reveal/vue/keyframes` | The built-in keyframes, `defineKeyframes`, and their types. |

`@awesome-reveal/vue/keyframes` does not import Vue. You can use it with `element.animate()` directly.

## Keyframes

The `keyframes` option takes the keyframes that a factory of `@awesome-reveal/vue/keyframes` returns, or a keyframes array:

```vue
<script setup>
import { Reveal, vReveal } from "@awesome-reveal/vue";
import { enter, slide } from "@awesome-reveal/vue/keyframes";

const fromLeft = slide({ direction: "left", distance: 40 });
</script>

<template>
  <div v-reveal="{ keyframes: fromLeft }">…</div>
  <Reveal :keyframes="enter({ y: 40, scale: 0.9 })">…</Reveal>
</template>
```

The [`@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#keyframes) documents the built-in keyframes, `spring()`, `defineKeyframes` and keyframes arrays.

## The `v-reveal` directive

`v-reveal` animates your own element, with no wrapper. Its value is an object with the [options](#options). On a component, it animates the root element of the component.

In `<script setup>`, import `vReveal` to use it as `v-reveal`. To use it in all components, register it on the app:

```ts
import { createApp } from "vue";
import { vReveal } from "@awesome-reveal/vue";
import App from "./App.vue";

createApp(App).directive("reveal", vReveal).mount("#app");

// Types v-reveal in the templates of all components.
declare module "vue" {
  interface GlobalDirectives {
    vReveal: typeof vReveal;
  }
}
```

While the element is hidden, it has an inline `opacity: 0` and `data-reveal="hidden"`. The reveal removes `data-reveal` and restores the inline `opacity` that the element had when `v-reveal` mounted. Set an opacity that changes in a class.

## The `Reveal` component

`Reveal` renders one element around its default slot. Use `as` to choose the tag. Other attributes go to that element:

```vue
<Reveal as="section" :keyframes="slide()" class="hero" id="intro">…</Reveal>
```

`Reveal` keeps your own `style`. The hidden `opacity: 0` overrides your opacity until the reveal, which restores it.

## Options

`Reveal` takes the [options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#options) as props, and `v-reveal` takes them as one object. Examples are `keyframes`, `duration`, `stagger`, `once` and `when`.

`once` and `when` are optional. With no value, they keep the core behavior: `<Reveal>` reveals once, and observes the viewport. `<Reveal :once="false">` and `<Reveal :when="loaded">` change them.

A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal, and do not replay an animation that already played.

When Vue replaces the element of `v-reveal`, for example with a new `key` or tag, the new element starts a new reveal. `Reveal` keeps its state when its `as` tag changes, and does not replay.

## Server-side rendering

Both APIs render the element hidden on the server, with `opacity: 0` and `data-reveal="hidden"`, unless `when` is `true`. The animation starts in the browser, when the element enters the viewport.

On the server, `v-reveal` also renders `data-allow-mismatch="style"`. The client render of the element does not have the hidden style, so without this attribute, a `style` binding on the element causes a hydration mismatch warning. The attribute allows a style mismatch on that element only.

The server markup of `v-reveal` replaces an inline `opacity` of your own. After the reveal, the element has the opacity of your stylesheet. Set the opacity in a class when you render on the server.

## Recipes

### Lists

```vue
<Reveal as="ul" :keyframes="slide()" :stagger="80">
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</Reveal>
```

`stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. With an inline `as` tag, `Reveal` itself also needs `display: inline-block`, or it only fades.

### Content that loads

```vue
<Reveal as="ul" :when="data !== undefined" :stagger="50">…</Reveal>
```

With `when`, your code controls the reveal, and nothing observes the viewport. `threshold`, `rootMargin` and `once` have no effect.

## Accessibility

The [Accessibility section of the `@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#accessibility) describes reduced motion, the `<noscript>` and print CSS, and Content Security Policy. Server markup hides the content until the script runs, so add that CSS to show it when JavaScript does not run and in print. Both APIs set `data-reveal="hidden"` on hidden elements. The attribute is reserved.

## Browser support

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later. Read [Browser support](https://www.npmjs.com/package/@awesome-reveal/core#browser-support) for the fallbacks.

## Agent skills

This package ships the `adding-reveal-animations` agent skill, which helps a coding agent add reveal animations to your project. pnpm 12.11 or later links it into your agent folders after you run `pnpm approve`.

## Support

- Report a bug in the [issue tracker](https://github.com/awesome-reveal/awesome-reveal/issues).
- Ask a question or suggest a feature in [Discussions](https://github.com/awesome-reveal/awesome-reveal/discussions).
- Read the [changelog](https://github.com/awesome-reveal/awesome-reveal/blob/next/packages/vue/CHANGELOG.md) for the changes of each release.
- If you like this library, [consider supporting its creator](https://github.com/sponsors/morellodev).

## License

MIT
