---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations to Vue components with @awesome-reveal/vue, including staggered children and custom keyframes. Use when the user wants elements to animate as they enter the viewport, or when you edit code that imports @awesome-reveal/vue.
---

# Reveal on scroll with @awesome-reveal/vue

`@awesome-reveal/vue` hides an element until it enters the viewport, then animates it with the Web Animations API. It needs Vue 3.5 or later.

## Choose the API

- `v-reveal` animates an element of your own, with no wrapper. Its value is the options object, or nothing for the defaults. On a component, it animates the root element of the component.
- `Reveal` renders one element and animates it. Use `as` to choose the tag (default `div`). It passes the other attributes and the default slot to that element.

```vue
<script setup lang="ts">
import { Reveal, vReveal } from "@awesome-reveal/vue";
import { fade, slide } from "@awesome-reveal/vue/keyframes";
</script>

<template>
  <Reveal as="section" :keyframes="slide()" class="hero">…</Reveal>

  <article v-reveal="{ keyframes: fade(), threshold: 0.3 }">…</article>
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

## Keyframes

`keyframes` is optional. Without it, the element fades in and moves up, as with `slide()`. Each factory takes optional options and returns Web Animations keyframes that end at the element's own style.

| Factory   | Effect                                     | Options                                                                                             |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                            |
| `slide()` | Fades in and moves in a direction.         | `direction` (`"up"` default, `"down"`, `"left"`, `"right"`), `distance` (`24`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (`0.95`), `opacity`, `easing`                                                                |
| `blur()`  | Fades in and removes a blur.               | `from` (`8`), `opacity`, `easing`                                                                   |
| `pop()`   | Fades in, grows past its size and settles. | `from` (`0.8`), `opacity`, `easing`                                                                 |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                            |

- `direction` is the direction of the movement. `"up"` starts below the resting position.
- A number for a length is in pixels, and a number for `rotate` is in degrees. A string can be any CSS length or angle.
- `opacity` is the start opacity (default `0`). Set it to `1` for movement with no fade.
- `spring()` returns an easing that follows a spring, for the `easing` option of any factory: `slide({ easing: spring({ bounce: 0.5 }) })`. `bounce` (default `0.3`, from `0` to `0.8`) sets the overshoot. It uses CSS `linear()`. Chrome before 113, Firefox before 112 and Safari before 17.2 get the default easing. If you call `spring()` on the server, these browsers show the element with no animation.

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

| Option          | Description                                                                                                    | Default   |
| --------------- | -------------------------------------------------------------------------------------------------------------- | --------- |
| `keyframes`     | The animation.                                                                                                 | `slide()` |
| `duration`      | Duration in milliseconds.                                                                                      | `600`     |
| `delay`         | Delay in milliseconds.                                                                                         | `0`       |
| `stagger`       | Animates the element children, each one this many milliseconds after the last one. `0` animates them together. | –         |
| `threshold`     | Fraction of the element (0 to 1) that must be visible.                                                         | `0`       |
| `rootMargin`    | Grows or shrinks the viewport area, as a CSS margin in `px` or `%`.                                            | `"0px"`   |
| `once`          | When `false`, the element hides again when it leaves the viewport.                                             | `true`    |
| `when`          | Controls the reveal as a level: `true` reveals, `false` hides, `undefined` or `null` lets the viewport decide. | –         |
| `reducedMotion` | `"user"` follows `prefers-reduced-motion`. `"always"` skips, `"never"` plays.                                  | `"user"`  |

## Rules

- A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal, and do not replay an animation that already played.
- `stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. With an inline `as` tag, `Reveal` itself also needs `display: inline-block`, or it only fades. It skips text nodes, so put text in an element. It reads the children when the element is revealed.
- `when: true` at the start plays the entrance once. It ignores `threshold`, `rootMargin` and `once`. A server renders the element shown, so the entrance can flash after hydration. To avoid the flash, start with `when` false and set it to true later.
- `threshold: 1` never reveals an element that is taller than the viewport plus its `rootMargin`. A negative `rootMargin` never reveals an element at the end of the page that cannot scroll into the shrunk area.
- `data-reveal` is reserved. Do not use it for other data.
- Call `slide()` and the other factories in `<script setup>`, not in the template, when the component renders often. Each call in the template creates the keyframes again at each render.
- Keep `reducedMotion` at `"user"` unless the user asks for a different behavior. It respects the operating system setting of people whom motion makes ill.
- Prefer `transform` and `opacity`. `filter` (`blur()`) and `clip-path` repaint on each frame in some engines, so use them on small elements.
- While the element is hidden, its inline `opacity` is `0`, also over an `opacity` of your own. After the reveal, `Reveal` restores your `opacity`. `v-reveal` restores the inline `opacity` of its mount, and with server rendering it cannot. Set an opacity that changes, or that you need with server rendering, in a class.
- Server-rendered content stays hidden (`opacity: 0`) until JavaScript runs. Both APIs render the hidden style on the server. To show the content when JavaScript does not run and in print, put this in the document head:

  ```html
  <noscript>
    <style>
      [data-reveal="hidden"] {
        opacity: 1 !important;
      }
    </style>
  </noscript>
  <style>
    @media print {
      [data-reveal="hidden"] {
        opacity: 1 !important;
      }
    }
  </style>
  ```

- On the server, `v-reveal` also renders `data-allow-mismatch="style"`, because the hidden style is not in the client render. It allows a style mismatch on that element only.
- Under a strict Content Security Policy, the inline `opacity: 0` style of the server markup needs `style-src-attr 'unsafe-inline'`.
