# @awesome-reveal/vue

`@awesome-reveal/vue` adds reveal-on-scroll animations to Vue 3 (3.5 or later). The package loads its stylesheet automatically, so you do not import CSS.

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

## Component and directive

`Reveal` renders one element. `as` sets the tag, and the default is `div`. The component passes the other attributes to the element. `vReveal` animates an element that you already render. Both accept the [core reveal options](https://www.npmjs.com/package/@awesome-reveal/core) and a reactive `when`.

`when: true` reveals the element manually, and `when: false` resets it. With `null` or `undefined`, the viewport controls the reveal. The entrance plays one time, and the observation stops when it starts. A change to `when` or `threshold` restarts the observation. A change to the other options applies at the next entrance.

The component emits `reveal` with the element, and gives `revealed` to its default slot. The directive accepts `onReveal` in its options.

```ts
import { h } from "vue";
import { Reveal } from "@awesome-reveal/vue";

export const card = h(Reveal, { from: "left", when: true }, () => "Hello");
```

## Cascade

`Cascade` works like `Reveal`, but it animates each direct child element in turn when the element enters the viewport. `interval` sets the milliseconds between two children, and the default is 80. The first child starts immediately. `vCascade` does the same for an element that you already render, for example `<ul v-cascade="{ interval: 120 }">`. The cascade observes the container, and the `reveal` event and `onReveal` get the container.

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
- Do not put a reveal directly inside a cascade. The two entrances add up on the same element.
- For a long or a virtualized list, reveal each item separately. A cascade has one observer, so the children below the viewport animate before you scroll to them.
- A `<TransitionGroup>` as a direct child adds its own animations to the children.

## SSR and accessibility

On the server, the components and the directives add `data-reveal="hidden"`, or `data-reveal="cascade"` for a cascade. The package stylesheet hides this element, or the direct children of a cascade, until hydration, so the content does not flash. The stylesheet shows the content for reduced motion, for print, and when scripting is off. On the server, the `node` import condition resolves the internal stylesheet import to an empty module. The browser build resolves it to the CSS.

Reduced motion shows the content immediately and cancels the active animation. The package does not change your styles. If hydration fails while JavaScript is on, the content can stay hidden. See [Recover when the script fails](#recover-when-the-script-fails).

### Recover when the script fails

The stylesheet does not show the content when a script fails or a blocker stops it, because the browser still runs scripts. To show the content in this case, put this script in the document head:

```html
<script>
  setTimeout(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-reveal-ready")) html.setAttribute("data-reveal-failed", "");
  }, 5000);
</script>
```

The package sets `data-reveal-ready` on `<html>` when it attaches the first element. If the attribute is not there after the timeout, the script sets `data-reveal-failed`, and the stylesheet shows the hidden elements.

- Use a timeout that is longer than the load time of your script on a slow network.
- The script does not cover code that loads later and fails, such as a dynamic `import()`.
- With a strict Content Security Policy, give the `<script>` a `nonce`, or allow its hash.

### Limits

- The `scripting: none` rule needs Chrome 120, Firefox 113 or Safari 17. In older browsers, the content stays hidden when JavaScript is off.
- The stylesheet does not reach a shadow root, so it does not hide an element in a shadow root before the reveal.
- Do not give a hidden element an inline `opacity` with `!important`. It wins over the stylesheet, so the element shows before the reveal.
- Hidden content stays focusable. A focused control can stay hidden when `when` is `false` or `threshold` is high. Do not hide the only way to a control.

## Agent skills and license

The package includes the `adding-reveal-animations` agent skill. The license is MIT.
