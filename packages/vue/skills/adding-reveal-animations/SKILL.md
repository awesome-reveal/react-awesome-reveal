---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations with the Reveal and Cascade components and the vReveal and vCascade directives of @awesome-reveal/vue, and native Web Animations keyframes. Use when you animate Vue elements that enter the viewport.
license: MIT
compatibility: Requires @awesome-reveal/vue and Vue 3.5 or later.
---

# Add reveal animations

Use the `Reveal` component, or the `vReveal` directive on an element that you render. `Cascade` and `vCascade` reveal the children of an element in sequence. The directive follows reactive options.

Do not import a stylesheet. The package loads its stylesheet, which hides the content until it reveals. The stylesheet replaces a CSS `animation` of the hidden element or of a cascade child until the reveal, so put your own animation on an inner element.

```ts
import { h } from "vue";
import { Cascade, Reveal } from "@awesome-reveal/vue";
export const card = h(Reveal, { from: "left" }, () => "Hello");
export const list = h(Cascade, { as: "ul", interval: 120 }, () => [
  h("li", "Fast"),
  h("li", "Small"),
]);
```

Set `from` to `"top"`, `"right"`, `"bottom"` or `"left"` for an entrance that starts transparent and 24px away on that side. The defaults are `from: "bottom"`, `duration: 600` (milliseconds), `delay: 0` (milliseconds) and `threshold: 0`. Use `delay` to start separate elements at different times. During the delay, the element stays in its start state. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly. Without `when`, the entrance plays one time. An element that is too large to reach `threshold` in the viewport reveals when it enters. In a scroll container that is too small to show `threshold` of it, it reveals when it leaves the visible area, so keep `threshold` low for tall elements. Focus in a waiting element shows it at once, with no entrance, except with `when: false`. A `from` object is the complete start state: `{ opacity: 0 }` is a pure fade, and `{ scale: 0.9 }` adds no fade and no movement. A number is in pixels for `x`, `y` and `blur`, and in degrees for `rotate`. A string can contain a CSS value with its unit. The entrance adds its offset, scale, rotation and blur to the element's own transforms and filter. It fades to the element's own opacity. So do not override these styles for the entrance.

For a custom animation, give native `Keyframe[]` in `keyframes`. Do not use `from` and `keyframes` together. Put the easing of each segment in its keyframe. End at the resting style of the element, because the animation does not keep its last keyframe. Animate `transform` and `opacity` when possible. Leave reduced motion to the package: it shows the content with no entrance when the user prefers reduced motion.

For a long list, reveal each item separately. For a short group, use `Cascade`, or the `vCascade` directive on an element that you render. It animates the direct element children in sequence, `interval` milliseconds apart (default 80). The first child starts after `delay`, so `delay` moves the whole sequence. It takes the same options as `Reveal`. Do not install `@awesome-reveal/core` for a cascade. The cascade reads the children when the container reveals, so a child that you add later shows with no animation. To cascade words or sentences, wrap each one in an element in the markup. Give inline children `display: inline-block`, because a transform does not apply to an inline box. Do not put a `Reveal` directly inside a `Cascade`, because the two entrances add up. Do not collect deeper descendants to animate them.

Use `when` for manual control: `true` reveals the element and `false` resets it. `null` or `undefined` gives the control back to the viewport. The component emits `reveal` with the element. The directive accepts `onReveal` in its options.

In the consumer project, check the build, the type check, the visibility before the reveal, reduced motion and the teardown.
