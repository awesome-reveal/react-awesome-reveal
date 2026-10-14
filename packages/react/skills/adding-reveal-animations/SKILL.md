---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations with the Reveal and Cascade components and the useReveal and useCascade hooks of @awesome-reveal/react, and native Web Animations keyframes. Use when you animate React elements that enter the viewport.
---

# Add reveal animations

Use the `Reveal` component, or the `useReveal` hook for an element that you render. `Cascade` and `useCascade` reveal the children of an element in sequence. Spread all the props from `getProps()` on the element, and give your own `ref` to `getProps()`, so that the hook can merge it.

Do not import a stylesheet. The package loads its stylesheet, which hides server-rendered content until hydration.

```tsx
import { Cascade, Reveal } from "@awesome-reveal/react";
<Reveal from="left">Hello</Reveal>;
<Cascade as="ul" interval={120}>
  <li>Fast</li>
  <li>Small</li>
</Cascade>;
```

Set `from` to `"top"`, `"right"`, `"bottom"` or `"left"` for an entrance that starts transparent and 24px away on that side. The defaults are `from: "bottom"`, `duration: 600` (milliseconds) and `threshold: 0`. The entrance plays one time. An element that leaves the viewport before it reaches `threshold` reveals then, so keep `threshold` low for tall elements. A `from` object is the complete start state: `{ opacity: 0 }` is a pure fade, and `{ scale: 0.9 }` adds no fade and no movement. A number is in pixels for `x`, `y` and `blur`, and in degrees for `rotate`. A string can contain a CSS value with its unit. The entrance adds its offset, scale, rotation and blur to the element's own transforms and filter, and fades to the element's own opacity, so do not override them for the entrance.

For a custom animation, give native `Keyframe[]` in `keyframes`. Do not use `from` and `keyframes` together. Put the easing of each segment in its keyframe. End at the resting style of the element, because the animation does not keep its last keyframe. Animate `transform` and `opacity` when possible. Do not try to override the automatic reduced-motion behavior.

For a long list, reveal each item separately. For a short group, use `Cascade`, or `useCascade` on an element that you render. It animates the direct element children in sequence, `interval` milliseconds apart (default 80), with no delay for the first child. It takes the same options as `Reveal`. Do not install `@awesome-reveal/core` for a cascade. The cascade reads the children when the container reveals, so a child that you add later shows with no animation. To cascade words or sentences, wrap each one in an element in the markup, and give inline children `display: inline-block`, because a transform does not apply to an inline box. Do not put a `Reveal` directly inside a `Cascade`, because the two entrances add up. Do not collect deeper descendants to animate them.

Use `when` for manual control: `true` reveals the element and `false` resets it. `onReveal` gets the element at each entrance.

In the consumer project, check the build, the type check, the visibility before the reveal, reduced motion and the teardown.
