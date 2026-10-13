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
- [Entrance](#entrance)
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

- 🪶 **Tiny** – No third-party dependencies. `v-reveal` adds about 2.2 kB gzipped to your bundle, and `Reveal` adds about 2.3 kB.
- 🌳 **Tree-shakeable** – Each keyframes factory is a small function. Your bundle includes only the factories that you import.
- 🔒 **CSP-ready** – A stylesheet hides the content. The library writes no inline style.
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

Vue 3.5 or a later Vue 3 version is necessary. TypeScript needs `moduleResolution` set to `bundler`, `node16` or `nodenext`, because the package uses `exports` for its entry points.

Import `reveal.css` once, in your entry module or in the CSS of your Nuxt config. It hides the elements until the reveal. Without it, the elements show before the reveal, and the library reports an error:

```js
import "@awesome-reveal/vue/reveal.css";
```

## Quick start

```vue
<script setup>
import { vReveal } from "@awesome-reveal/vue";
</script>

<template>
  <p v-reveal>I gently appear as I enter the viewport</p>
  <p v-reveal="{ from: 'left' }">I come from the left</p>
</template>
```

With no options, the element fades in and moves up. To change the entrance, see [Entrance](#entrance).

## Entry points

| Import path                      | Contents                                                            |
| -------------------------------- | ------------------------------------------------------------------- |
| `@awesome-reveal/vue`            | The `v-reveal` directive, the `Reveal` component and the keyframes. |
| `@awesome-reveal/vue/keyframes`  | Only the built-in keyframes, `defineKeyframes`, and their types.    |
| `@awesome-reveal/vue/reveal.css` | The stylesheet that hides the elements until the reveal.            |

The keyframes do not touch the DOM. You can use them with `element.animate()` directly.

## Entrance

The `from`, `distance`, `easing` and `bounce` options set the entrance:

```vue
<script setup>
import { Reveal, vReveal } from "@awesome-reveal/vue";
</script>

<template>
  <div v-reveal="{ from: 'left', distance: 40 }">…</div>
  <Reveal :from="{ scale: 0.9, blur: 8 }" :bounce="0.4">…</Reveal>
</template>
```

`from` is a side (`"top"`, `"bottom"`, `"left"` or `"right"`) or a start state. The [Entrance options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#entrance) describe them.

## Keyframes

For an animation that the entrance options cannot give, set `keyframes`. It takes the keyframes that a factory returns, or a keyframes array:

```vue
<script setup>
import { Reveal, enter, slide, vReveal } from "@awesome-reveal/vue";

const fromLeft = slide({ from: "left", distance: 40 });
</script>

<template>
  <div v-reveal="{ keyframes: fromLeft }">…</div>
  <Reveal :keyframes="enter({ y: 40, rotate: -5 })">…</Reveal>
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

While the element is hidden, it has `data-reveal="hidden"`, and `reveal.css` hides it. The reveal removes the attribute. Your `style` binding stays as it is, and your `opacity` applies after the reveal.

To run code at each reveal, pass `onReveal` in the value. It gets the element, in the task that starts the animation.

## The `Reveal` component

`Reveal` renders one element around its default slot. Use `as` to choose the tag. Other attributes go to that element:

```vue
<Reveal as="section" from="left" class="hero" id="intro">…</Reveal>
```

`Reveal` emits `reveal` with the element each time it is revealed. Its default slot gets `revealed`:

```vue
<Reveal @reveal="track" v-slot="{ revealed }">
  <p>{{ revealed ? "Hello!" : "…" }}</p>
</Reveal>
```

`Reveal` keeps your own `style`. Your `opacity` applies after the reveal.

## Options

`Reveal` takes the [options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#options) as props, and `v-reveal` takes them as one object. Examples are `from`, `duration`, `stagger`, `once` and `when`. `v-reveal` also takes `onReveal`. `Reveal` emits `reveal` instead.

`once` and `when` are optional. With no value, they keep the core behavior: `<Reveal>` reveals once, and observes the viewport. `<Reveal :once="false">` and `<Reveal :when="loaded">` change them.

A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal, and do not replay an animation that already played.

When Vue replaces the element of `v-reveal`, for example with a new `key` or tag, the new element starts a new reveal. `Reveal` keeps its state when its `as` tag changes, and does not replay.

## Server-side rendering

Both APIs render the element hidden on the server, with `data-reveal="hidden"`. The animation starts in the browser, when the element enters the viewport. With `when` set to `true`, the entrance plays after hydration.

The server markup keeps your `style`, so a `style` binding hydrates with no mismatch.

## Recipes

### Lists

```vue
<Reveal as="ul" :stagger="80">
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

The [Accessibility section of the `@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#accessibility) describes reduced motion, focus, the stylesheet and Content Security Policy. Both APIs set `data-reveal="hidden"` on hidden elements. The attribute is reserved.

The server markup hides the content until the script runs. `reveal.css` shows it when JavaScript is off and in print. If the script fails or a blocker stops it, the content stays hidden. The [recovery recipe](https://www.npmjs.com/package/@awesome-reveal/core#recover-when-the-script-fails) shows it again after a timeout. Put its script in the document head. The library sets the `data-reveal-ready` attribute of the recipe when the first element mounts or hydrates. The attribute does not cover a part of the page that loads later and fails, such as an async component.

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
