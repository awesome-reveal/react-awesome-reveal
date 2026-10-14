---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations with the Reveal component and the useReveal hook of @awesome-reveal/react, and native Web Animations keyframes. Use when you animate React elements that enter the viewport.
---

# Add reveal animations

Use the `Reveal` component, or the `useReveal` hook for an element that you render. Spread all the props from `getProps()` on the element, and give your own `ref` to `getProps()`, so that the hook can merge it.

Do not import a stylesheet. The package loads its stylesheet, which hides server-rendered content until hydration.

```tsx
import { Reveal } from "@awesome-reveal/react";
<Reveal from="left">Hello</Reveal>;
```

Set `from` to `"top"`, `"right"`, `"bottom"` or `"left"` for an entrance that starts transparent and 24px away on that side. The defaults are `from: "bottom"`, `duration: 600` (milliseconds) and `threshold: 0`. The entrance plays one time. A `from` object is the complete start state: `{ opacity: 0 }` is a pure fade, and `{ scale: 0.9 }` adds no fade and no movement. A number is in pixels for `x`, `y` and `blur`, and in degrees for `rotate`. A string can contain a CSS value with its unit.

For a custom animation, give native `Keyframe[]` in `keyframes`. Do not use `from` and `keyframes` together. Put the easing of each segment in its keyframe. End at the resting style of the element, because the animation does not keep its last keyframe. Animate `transform` and `opacity` when possible. Do not try to override the automatic reduced-motion behavior.

For a long list, reveal each item separately. Install `@awesome-reveal/core` to use `cascade()`. It animates only the direct element children of a container, with `interval` milliseconds between them and no delay for the first child. Do not split text into elements, and do not collect deeper descendants to animate them.

Use `when` for manual control: `true` reveals the element and `false` resets it. `onReveal` gets the element at each entrance.

In the consumer project, check the build, the type check, the visibility before the reveal, reduced motion and the teardown.
