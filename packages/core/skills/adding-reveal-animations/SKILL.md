---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations with reveal() and cascade() from @awesome-reveal/core and native Web Animations keyframes. Use when you animate elements that enter the viewport in plain JavaScript or TypeScript.
license: MIT
compatibility: Requires @awesome-reveal/core in a project that runs in the browser.
---

# Add reveal animations

Use `reveal(target, options?)` to animate each target element when it enters the viewport. Use `cascade(container, options?)` to animate the direct element children of a container in sequence. Both functions return only `{ dispose() }`. Call `dispose()` when you remove the targets before they reveal. After all the entrances of a call finish, the call needs no `dispose()`.

Core needs no stylesheet. It creates a paused native animation for each element when you call it. Code that waits for all page animations to finish must skip the paused ones. Core does not hide server-rendered content. Only the framework packages do that.

```ts
import { reveal, cascade } from "@awesome-reveal/core";
const handle = reveal(".card", { from: "left" });
cascade(".features", { interval: 80 });
handle.dispose();
```

Set `from` to `"top"`, `"right"`, `"bottom"` or `"left"` for an entrance that starts transparent and 24px away on that side. The defaults are `from: "bottom"`, `duration: 600` (milliseconds), `delay: 0` (milliseconds) and `threshold: 0`. The entrance plays one time.

A `from` object is the complete start state: `{ opacity: 0 }` is a pure fade, and `{ scale: 0.9 }` adds no fade and no movement. A number is in pixels for `x`, `y` and `blur`, and in degrees for `rotate`. A string can contain a CSS value with its unit. The entrance adds its offset, scale, rotation and blur to the element's own transforms and filter. It fades to the element's own opacity. So do not override these styles for the entrance.

Use `delay` to start separate elements at different times. During the delay, the element stays in its start state. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly.

An element that is too large to reach `threshold` in the viewport reveals when it enters. In a scroll container that is too small to show `threshold` of it, it reveals when it leaves the visible area. So keep `threshold` low for tall elements. Focus in a waiting element shows it at once, with no entrance.

Inside an ancestor that clips its overflow, such as a carousel or a box with `overflow: hidden`, use a start state with `opacity: 0`, such as a side. Other start states and native keyframes wait at their first keyframe, and the observer sees that box. If the clip hides that box fully, the element never reveals.

For a custom animation, give native `Keyframe[]` in `keyframes`. Do not use `from` and `keyframes` together. Put the easing of each segment in its keyframe. End at the resting style of the element, because the animation does not keep its last keyframe. Animate `transform` and `opacity` when possible. Leave reduced motion to the package: it shows the content with no entrance when the user prefers reduced motion.

A cascade schedules all children when its container enters the viewport, so the last children of a long list start late or out of view. For a long list, or a grid that is taller than the viewport, use `reveal()` on each item. `cascade()` animates only the direct element children of a container, with `interval` milliseconds between them. The first child starts after `delay`, so `delay` moves the whole sequence. `cascade()` reads the children when you call it, so a child that you add later does not animate.

To cascade words or sentences, wrap each one in an element in the markup. Give inline children `display: inline-block`, because a transform does not apply to an inline box. Do not collect deeper descendants to animate them.

Core has no `when` option and no reveal callback. Only the framework packages have them. The only core option for the viewport is `threshold`.

Core has no manual trigger. For content that the observer cannot see, such as a clipped carousel slide, play the paused animations of the element. For a cascade, use `getAnimations({ subtree: true })` on the container. A later entry into the viewport does not play the entrance again. The observer stays connected until the element enters the viewport or gets focus, or until `dispose()`. The loop also plays the other paused animations of the element.

```ts
export function playEntrance(element: Element) {
  for (const animation of element.getAnimations()) {
    if (animation.playState === "paused") animation.play();
  }
}
```

In the consumer project, check the build, the type check, the visibility before the reveal, reduced motion and the teardown.
