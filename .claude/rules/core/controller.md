---
paths:
  - "packages/core/src/**"
---

# Core controller

- Start `play` in the same task that removes the hidden style. Between the two, the element shows at full opacity, because `fill: "backwards"` applies the first keyframe only after `play` creates the animation.
- Do not throw when an API is missing. Without IntersectionObserver, reveal at once. Without `Element.animate`, reveal with no animation.
- Do not use `window` or `document` at module level. Server renderers import core.
- `reveal().update` replaces the options and does not merge them. Only a change of `when`, `threshold`, `rootMargin` or `once` restarts the observer. `reveal()` copies the options, because a directive can pass the same mutated object again.
- The element shows `when ?? inView`, as in the adapters that render the style. When `when` is removed, the element returns to the observed state, so it can hide and play again.
- The `.d.ts` files carry the JSDoc, and the JS output has none. Write the option docs and defaults in the interface JSDoc.
- A consumer bundle of an adapter includes core. The React tree-shaking test measures the core code in that bundle, so new code in `observe`, `play` or `hiddenStyle` counts against the React size limits.
