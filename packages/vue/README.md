# @awesome-reveal/vue

`@awesome-reveal/vue` adds reveal-on-scroll animations to Vue 3 (3.5 or later). The package loads its stylesheet automatically. Only an Astro island needs a [setup step](#stylesheet).

```sh
npm install @awesome-reveal/vue
```

```vue
<script setup lang="ts">
import { Cascade, Reveal, vReveal } from "@awesome-reveal/vue";
</script>
<template>
  <Reveal from="left">Hello</Reveal>
  <p v-reveal="{ from: { opacity: 0 }, duration: 500 }">Pure fade</p>
  <Reveal
    :keyframes="[
      { opacity: 0, transform: 'scale(.8)' },
      { opacity: 1, transform: 'scale(1)' },
    ]"
    >Native animation</Reveal
  >
  <Cascade as="ul" :interval="120">
    <li>Fast</li>
    <li>Small</li>
  </Cascade>
</template>
```

## Stylesheet

The modules of the package import its stylesheet. On the server, the `node` import condition resolves this import to an empty module, and the browser build resolves it to the CSS. A client bundler, such as Vite, adds the CSS to the page, so you do not import it.

An Astro island needs a step. Astro collects the CSS of a page from the server build, so it does not get the stylesheet. Import the stylesheet in the page or in the layout that renders the island:

```astro
---
import "@awesome-reveal/vue/reveal.css";
---
```

## Component and directive

`Reveal` renders one element. `as` sets the tag, and the default is `div`. The component passes the other attributes to the element. `vReveal` animates an element that you already render. Both accept the [core reveal options](https://www.npmjs.com/package/@awesome-reveal/core) and a reactive `when`.

`delay` sets the time between the reveal and the entrance, in milliseconds. The default is 0. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly.

`when: true` reveals the element manually, and `when: false` resets the entrance. With `null` or `undefined`, the viewport controls the reveal. When the viewport controls the reveal, the entrance plays one time, and the observation stops at the reveal. A change of `when` from `false` to `true` plays the entrance again. `when: false` during the `delay` also resets the entrance, and the entrance does not play.

`when` controls the entrance. It does not show or hide content. With `when: false`, the element is transparent. Screen readers still read it, and the keyboard can focus its controls. To hide content, use the `hidden` attribute, or do not render it with `v-if`. `inert` does not hide the element. It only blocks focus, clicks and assistive technology.

A change to `when` or `threshold` applies immediately. A change to the other options applies at the next reveal.

The component emits `reveal` with the element, and gives `revealed` to its default slot. The directive accepts `onReveal` in its options.

```ts
import { h } from "vue";
import { Reveal } from "@awesome-reveal/vue";

export const card = h(Reveal, { from: "left", when: true }, () => "Hello");
```

## Cascade

`Cascade` works like `Reveal`, but it animates each direct child element in sequence when the element enters the viewport. `interval` sets the time between the entrances of two children, in milliseconds, and the default is 80. `delay` moves the start of the whole sequence: the first child starts after `delay`, and `interval` spaces the other children. `vCascade` does the same for an element that you already render, for example `<ul v-cascade="{ interval: 120 }">`. The cascade observes the container, and the `reveal` event and `onReveal` get the container.

```ts
import { h } from "vue";
import { Cascade } from "@awesome-reveal/vue";

export const list = h(Cascade, { as: "ul", from: "left" }, () => [
  h("li", "Fast"),
  h("li", "Small"),
]);
```

- It reads the children when the container reveals. A child that you add after the reveal shows with no animation.
- Only the direct element children animate. Text and children with `display: contents` show immediately.
- Do not put a reveal directly inside a cascade. The two entrances combine on the same element.
- A cascade schedules all children when its container enters the viewport, so the last children of a long list start late or out of view. For a long list, a virtualized list, or a grid that is taller than the viewport, use `Reveal` or `vReveal` on each item.
- A `<TransitionGroup>` as a direct child adds its own animations to the children.

## SSR and accessibility

On the server, the components and the directives add `data-awesome-reveal="hidden"`, or `data-awesome-reveal="cascade"` for a cascade. The package stylesheet hides this element, or the direct children of a cascade, until it reveals, so the content does not flash. The stylesheet shows the content in these cases:

- The user prefers reduced motion.
- The user prints the page.
- JavaScript is off.

Reduced motion shows the content immediately and cancels the active animation. The package does not change your styles.

The stylesheet hides the server markup for at most 5 seconds before the script attaches the element. At the attach, the package adds `data-awesome-reveal-attached` to the element, and the element stays hidden until it reveals. So if the script fails, the content shows after 5 seconds. If the attach happens after the 5 seconds, the element shows, then hides again until it reveals. This happens with slow hydration, and often with lazy hydration, such as `hydrateOnVisible()` or a Nuxt `hydrate-on-visible` component, when the user scrolls to the content after 5 seconds. Hydrate reveal content eagerly.

The package writes no `style` attribute and no inline script. A Content Security Policy that blocks inline styles and scripts, such as `style-src 'self'; script-src 'self'`, works in a production build when your bundler emits the package CSS as a file.

### Limits

- The stylesheet does not reach a shadow root, so it does not hide an element in a shadow root before the reveal.
- Do not give a hidden element an inline `opacity` with `!important`. It has priority over the stylesheet, so the element shows before the reveal.
- The stylesheet hides with the `awesome-reveal-hold` CSS animation, which replaces your own `animation` on a hidden element or cascade child until it reveals. If no script reveals the element, such as when the script fails or JavaScript is off, your animation does not run. Put your own animation on an inner element.
- An `animation` of your own with `!important` can have priority over the hold. Then the element shows until the script attaches it. The hold fires `animationstart` and `animationend` events, and shows in `getAnimations()`.
- Focus in a waiting element shows it at once, with no entrance, but not with `when: false`. Focus during a running entrance or its delay does not shorten it, so keep `delay` and `interval` short.
- In browsers without the `scripting` media feature, such as Safari 16, content shows after 5 seconds when JavaScript is off.

## Agent skills and license

The package includes the `adding-reveal-animations` agent skill. The license is MIT.
