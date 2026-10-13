---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations to Vue components with @awesome-reveal/vue, including staggered children and custom keyframes. Use when the user wants elements to animate as they enter the viewport, or when you edit code that imports @awesome-reveal/vue.
---

# Reveal on scroll with @awesome-reveal/vue

`@awesome-reveal/vue` hides an element until it enters the viewport, then animates it with the Web Animations API. It needs Vue 3.5 or later.

## Set up

Import `reveal.css` once, in the entry module of the app. It hides the elements until the reveal. Without it, the elements show before the reveal, and the library reports an error:

```ts
import "@awesome-reveal/vue/reveal.css";
```

## Choose the API

- `v-reveal` animates an element of your own, with no wrapper. Its value is the options object, or nothing for the defaults. On a component, it animates the root element of the component.
- `Reveal` renders one element and animates it. Use `as` to choose the tag (default `div`). It passes the other attributes and the default slot to that element.

```vue
<script setup lang="ts">
import { Reveal, vReveal } from "@awesome-reveal/vue";
</script>

<template>
  <Reveal as="section" from="left" class="hero">…</Reveal>

  <article v-reveal="{ from: { scale: 0.95 }, threshold: 0.3 }">…</article>
</template>
```

A `<script setup>` block can use `vReveal` as `v-reveal` after the import. To use `v-reveal` in all components, register it once:

```ts
import { createApp } from "vue";
import { vReveal } from "@awesome-reveal/vue";

createApp({}).directive("reveal", vReveal);

declare module "vue" {
  interface GlobalDirectives {
    vReveal: typeof vReveal;
  }
}
```

To run code at each reveal, listen to the `reveal` event of `Reveal`, or pass `onReveal` in the `v-reveal` options. Both get the element, in the task that starts the animation. The default slot of `Reveal` gets `revealed`:

```vue
<template>
  <Reveal as="section" @reveal="track('hero')" v-slot="{ revealed }">
    {{ revealed ? "Hello!" : "" }}
  </Reveal>
</template>
```

## Entrance

Without options, the element fades in and moves up 24px. These options change the entrance:

| Option     | Description                                                                                                     | Default                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `from`     | Where the element starts: `"top"`, `"bottom"`, `"left"` or `"right"` of its resting position, or a start state. | `"bottom"`                         |
| `distance` | Distance from the side of `from`.                                                                               | `24`                               |
| `easing`   | A CSS easing, or `"spring"`.                                                                                    | `"cubic-bezier(0.22, 1, 0.36, 1)"` |
| `bounce`   | Overshoot of the spring, from `0` to `0.8`. When `easing` is not set, it selects the spring.                    | `0.3`                              |

- A start state is an object with `x`, `y`, `scale`, `rotate`, `blur` and `opacity`, such as `{ scale: 0.9, blur: 8 }`. `distance` applies only to a side.
- The element fades in from `opacity: 0`. Add `opacity: 1` to a start state for movement with no fade.
- A number for a length is in pixels, and a number for `rotate` is in degrees. A string can be any CSS length or angle.
- `"spring"` uses CSS `linear()`. Chrome before 113, Firefox before 112 and Safari before 17.2 get the default easing.

## Keyframes

For an animation that the entrance options cannot give, set `keyframes`. It replaces the entrance options. Each factory takes optional options and returns Web Animations keyframes that end at the element's own style. Import the factories from `@awesome-reveal/vue` or `@awesome-reveal/vue/keyframes`.

| Factory   | Effect                                     | Options                                                                                           |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                          |
| `slide()` | Fades in and moves in from a side.         | `from` (`"bottom"` default, `"top"`, `"left"`, `"right"`), `distance` (`24`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (`0.95`), `opacity`, `easing`                                                              |
| `blur()`  | Fades in and removes a blur.               | `from` (`8`), `opacity`, `easing`                                                                 |
| `pop()`   | Fades in, grows past its size and settles. | `from` (`0.8`), `opacity`, `easing`                                                               |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                          |

- `opacity` is the start opacity (default `0`).
- `spring()` returns an easing that follows a spring, for the `easing` option of a factory: `slide({ easing: spring({ bounce: 0.5 }) })`. Prefer the `easing: "spring"` option when the factory runs on the server, because `spring()` can check the browser support only in the browser.

For a custom animation, use `defineKeyframes` or a keyframes array:

```ts
import { defineKeyframes, type KeyframesFactory } from "@awesome-reveal/vue/keyframes";

// keyframe(t) gets the progress t from 0 to 1. At t = 1, return the resting style.
const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
  keyframe: (t) => ({ opacity: t, transform: `rotate(${(1 - t) * turns * 360}deg)` }),
}));

// The last keyframe must be the resting style: the animation does not stay applied.
const drop: KeyframesFactory<{ height?: number }> = ({ height = 40 } = {}) => [
  { opacity: 0, transform: `translateY(${-height}px)`, easing: "ease-out" },
  {},
];
```

## Options

`Reveal` takes the options as props, and `v-reveal` takes them as one object.

| Option          | Description                                                                                                    | Default  |
| --------------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| `keyframes`     | The animation. It replaces the entrance options.                                                               | –        |
| `duration`      | Duration in milliseconds.                                                                                      | `600`    |
| `delay`         | Delay in milliseconds.                                                                                         | `0`      |
| `stagger`       | Animates the element children, each one this many milliseconds after the last one. `0` animates them together. | –        |
| `threshold`     | Fraction of the element (0 to 1) that must be visible.                                                         | `0`      |
| `rootMargin`    | Grows or shrinks the viewport area, as a CSS margin in `px` or `%`.                                            | `"0px"`  |
| `once`          | When `false`, the element hides again when it leaves the viewport.                                             | `true`   |
| `when`          | Controls the reveal as a level: `true` reveals, `false` hides, `undefined` or `null` lets the viewport decide. | –        |
| `onReveal`      | `v-reveal` only. Called with the element each time it is revealed. `Reveal` emits `reveal` instead.            | –        |
| `reducedMotion` | `"user"` follows `prefers-reduced-motion`. `"always"` skips, `"never"` plays.                                  | `"user"` |

## Rules

- A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal, and do not replay an animation that already played.
- `stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. With an inline `as` tag, `Reveal` itself also needs `display: inline-block`, or it only fades. It skips text nodes, so put text in an element. It reads the children when the element is revealed.
- `when: true` at the start plays the entrance once, after hydration. It ignores `threshold`, `rootMargin` and `once`. The server renders the element hidden.
- `threshold: 1` never reveals an element that is taller than the viewport plus its `rootMargin`. A negative `rootMargin` never reveals an element at the end of the page that cannot scroll into the shrunk area.
- `data-reveal` is reserved. Do not use it for other data.
- Call `slide()` and the other factories in `<script setup>`, not in the template, when the component renders often. Each call in the template creates the keyframes again at each render.
- Keep `reducedMotion` at `"user"` unless the user asks for a different behavior. It respects the operating system setting of people whom motion makes ill.
- Do not give a hidden element an inline `opacity` with `!important`. It wins over `reveal.css`, so the element shows before the reveal. The library writes no inline style, so a strict Content Security Policy needs no `'unsafe-inline'` for it.
- `reveal.css` shows the hidden elements when JavaScript is off, in Chrome 120, Firefox 113 and Safari 17 or later, and in print. If the script fails or a blocker stops it, the content stays hidden. To show it after a timeout, put this in the document head. The library sets `data-reveal-ready` on `<html>` when the first element mounts or hydrates. When the attribute is not there in time, the script sets `data-reveal-failed`, and `reveal.css` shows the hidden elements. Use a timeout that is longer than the load time of the script on a slow network. The attribute does not cover a part of the page that loads later and fails, such as an async component. Under a strict Content Security Policy, give the `<script>` a `nonce`:

  ```html
  <script>
    setTimeout(() => {
      const html = document.documentElement;
      if (!html.hasAttribute("data-reveal-ready")) html.setAttribute("data-reveal-failed", "");
    }, 5000);
  </script>
  ```
