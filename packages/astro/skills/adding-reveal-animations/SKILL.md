---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations with the Reveal and Cascade components of @awesome-reveal/astro and native Web Animations keyframes. Use when you animate elements of an Astro page that enter the viewport.
---

# Add reveal animations

Import `Reveal` or `Cascade` in the component script (frontmatter). `Cascade` reveals the children of an element in sequence. The component loads its custom element and its CSS, and it needs no hydration directive.

Do not import a stylesheet. The package loads its stylesheet, which hides server-rendered content until the client script runs.

```ts
import type { CascadeProps, RevealProps } from "@awesome-reveal/astro";
const options: RevealProps = { from: "left", duration: 500 };
const list: CascadeProps<"ul"> = { as: "ul", interval: 120 };
export { list, options };
```

Set `from` to `"top"`, `"right"`, `"bottom"` or `"left"` for an entrance that starts transparent and 24px away on that side. The defaults are `from: "bottom"`, `duration: 600` (milliseconds) and `threshold: 0`. Without `when`, the entrance plays one time. An element that leaves the viewport before it reaches `threshold` reveals then, so keep `threshold` low for tall elements. A `from` object is the complete start state: `{ opacity: 0 }` is a pure fade, and `{ scale: 0.9 }` adds no fade and no movement. A number is in pixels for `x`, `y` and `blur`, and in degrees for `rotate`. A string can contain a CSS value with its unit. The entrance adds its offset, scale, rotation and blur to the element's own transforms and filter. It fades to the element's own opacity. So do not override these styles for the entrance.

For a custom animation, give native `Keyframe[]` in `keyframes`. Do not use `from` and `keyframes` together. Put the easing of each segment in its keyframe. End at the resting style of the element, because the animation does not keep its last keyframe. Animate `transform` and `opacity` when possible. Leave reduced motion to the package: it shows the content with no entrance when the user prefers reduced motion.

For a long list, reveal each item separately. For a short group, use `Cascade`. It animates the direct element children in sequence, `interval` milliseconds apart (default 80), with no delay for the first child. It takes the same options as `Reveal`. Do not install `@awesome-reveal/core` for a cascade. The cascade reads the children when the container reveals, so a child that you add later shows with no animation. To cascade words or sentences, wrap each one in an element in the markup. Give inline children `display: inline-block`, because a transform does not apply to an inline box. The cascade does not animate a child with `display: contents`, such as a framework island or the host of a nested `Reveal`. Wrap an island in an element to put it in the cascade. Do not collect deeper descendants to animate them.

Use `when` for manual control: `true` reveals the element and `false` resets it. The rendered tag dispatches a `reveal` event that bubbles.

In the consumer project, check the build, the type check, the visibility before the reveal, reduced motion and the teardown.
