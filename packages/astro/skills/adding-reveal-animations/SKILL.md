---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations with the Reveal and Cascade components of @awesome-reveal/astro and native Web Animations keyframes. Use when you animate elements of an Astro page that enter the viewport.
license: MIT
compatibility: Requires @awesome-reveal/astro and Astro 6 or 7.
---

# Add reveal animations

Import `Reveal` or `Cascade` in the component script (frontmatter). `Cascade` reveals the children of an element in sequence. The component loads its custom element and its CSS, and it needs no hydration directive.

Do not import a stylesheet. The package loads its stylesheet, which hides server-rendered content until it reveals. The stylesheet replaces a CSS `animation` of the hidden element or of a cascade child until the reveal, so put your own animation on an inner element.

```ts
import type { CascadeProps, RevealProps } from "@awesome-reveal/astro";
const options: RevealProps = { from: "left", duration: 500 };
const list: CascadeProps<"ul"> = { as: "ul", interval: 120 };
export { list, options };
```

Set `from` to `"top"`, `"right"`, `"bottom"` or `"left"` for an entrance that starts transparent and 24px away on that side. The defaults are `from: "bottom"`, `duration: 600` (milliseconds), `delay: 0` (milliseconds) and `threshold: 0`. Without `when`, the entrance plays one time.

Use `delay` to start separate elements at different times. During the delay, the element stays in its start state. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly.

An element that is too large to reach `threshold` in the viewport reveals when it enters. In a scroll container that is too small to show `threshold` of it, it reveals when it leaves the visible area. So keep `threshold` low for tall elements. Focus in a waiting element shows it at once, with no entrance, except with `when: false`.

A `from` object is the complete start state: `{ opacity: 0 }` is a pure fade, and `{ scale: 0.9 }` adds no fade and no movement. A number is in pixels for `x`, `y` and `blur`, and in degrees for `rotate`. A string can contain a CSS value with its unit. The entrance adds its offset, scale, rotation and blur to the element's own transforms and filter. It fades to the element's own opacity. So do not override these styles for the entrance.

For a custom animation, give native `Keyframe[]` in `keyframes`. Do not use `from` and `keyframes` together. Put the easing of each segment in its keyframe. End at the resting style of the element, because the animation does not keep its last keyframe. Animate `transform` and `opacity` when possible. Leave reduced motion to the package: it shows the content with no entrance when the user prefers reduced motion.

A cascade schedules all children when its container enters the viewport, so the last children of a long list start late or out of view. For a long list, or a grid that is taller than the viewport, use `Reveal` on each item. For a short group, use `Cascade`. It animates the direct element children in sequence, `interval` milliseconds apart (default 80). The first child starts after `delay`, so `delay` moves the whole sequence. It takes the same options as `Reveal`, and also `interval`. Do not install `@awesome-reveal/core` for a cascade.

The cascade reads the children when the container reveals, so a child that you add later shows with no animation. To cascade words or sentences, wrap each one in an element in the markup. Give inline children `display: inline-block`, because a transform does not apply to an inline box. The cascade does not animate a child with `display: contents`, such as a framework island or the host of a nested `Reveal`. Wrap an island in an element to put it in the cascade. Do not collect deeper descendants to animate them.

Use `when` for manual control: `true` reveals the element and `false` resets the entrance. `null` or `undefined` returns the control to the viewport. `when` does not show or hide content. With `when: false`, the element is transparent, but screen readers still read it, and the keyboard can focus its controls. To hide content, add the `hidden` attribute to the rendered tag, not to the host, or do not render it. `inert` does not hide the element. It only blocks focus, clicks and assistive technology. After the page loads, set the `when` property of the `awesome-reveal` host element. The rendered tag dispatches a `reveal` event that bubbles, one time for each reveal, also when no entrance plays.

In the consumer project, check the build, the type check, the visibility before the reveal, reduced motion and the teardown.
