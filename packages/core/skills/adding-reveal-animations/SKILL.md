---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations with reveal() and cascade() from @awesome-reveal/core and native Web Animations keyframes. Use when you animate elements that enter the viewport in plain JavaScript or TypeScript.
---

# Add reveal animations

Use `reveal(target, options?)` to animate each target element when it enters the viewport. Use `cascade(container, options?)` to animate the direct element children of a container in sequence. Both functions return only `{ dispose() }`. Call `dispose()` in your teardown code.

Core needs no stylesheet. It applies the start state when you call it. It does not hide server-rendered content. Only the framework packages do that.

```ts
import { reveal, cascade } from "@awesome-reveal/core";
const handle = reveal(".card", { from: "left" });
cascade(".features", { interval: 80 });
handle.dispose();
```

Set `from` to `"top"`, `"right"`, `"bottom"` or `"left"` for an entrance that starts transparent and 24px away on that side. The defaults are `from: "bottom"`, `duration: 600` (milliseconds), `threshold: 0` and `once: true`. A `from` object is the complete start state: `{ opacity: 0 }` is a pure fade, and `{ scale: 0.9 }` adds no fade and no movement. A number is in pixels for `x`, `y` and `blur`, and in degrees for `rotate`. A string can contain a CSS value with its unit.

For a custom animation, give native `Keyframe[]` in `keyframes`. Do not use `from` and `keyframes` together. Put the easing of each segment in its keyframe. End at the resting style of the element, because the animation does not keep its last keyframe. Animate `transform` and `opacity` when possible. Do not try to override the automatic reduced-motion behavior.

For a long list, reveal each item separately. `cascade()` from `@awesome-reveal/core` animates only the direct element children of a container, with `interval` milliseconds between them and no delay for the first child. Do not split text into elements, and do not collect deeper descendants to animate them.

Core has no `when` option and no reveal callback. Only the framework packages have them. The core options for the viewport are `threshold` and `once`.

In the consumer project, check the build, the type check, the visibility before the reveal, reduced motion and the teardown.
