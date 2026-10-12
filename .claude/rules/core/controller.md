---
paths:
  - "packages/core/src/**"
---

# Core controller

- Start `play` in the same task that removes the hidden style. Between the two, the element shows at full opacity, because `fill: "backwards"` applies the first keyframe only after `play` creates the animation.
- Do not throw when an API is missing. Without IntersectionObserver, reveal at once. Without `Element.animate`, reveal with no animation.
- Do not use `window` or `document` at module level. Server renderers import core.
- `createReveal` owns the state: the observer, `when ?? inView`, `once` and the play. It writes no style. `reveal()` wraps it, hides and shows the element when it calls the listener, and restores the element on `destroy()`. An adapter that renders its own style uses `createReveal` and does not call `reveal()`, which breaks hydration.
- Hide in this order: cancel the animation, then tell the listener. Reveal in this order: tell the listener, then `play`, in the same task.
- `setOptions` replaces the options and does not merge them. Only a change of `when`, `threshold`, `rootMargin` or `once` restarts the observer. `createReveal` copies the options, because a directive can pass the same mutated object again.
- `when == null` means that the viewport decides, and `null` is the same as `undefined` for every option of `reveal`, but not for the keyframes factories. Use `??` and `== null`, not default values, because defaults do not apply to `null`.
- A revealed state plays once. `when: true` from the start plays the entrance at the first `attach`. A new element keeps the state and does not play again.
- The browser validates `threshold`, `rootMargin`, easing and the other platform inputs. Library-owned numbers, such as `steps`, are clamped. A failure shows the element and goes to `report()`, which throws from a microtask, once for each message. Do not throw from `observe`, `play` or `createReveal`, because a render or an effect can call them. `play` stays silent when the browser has no `linear()`.
- Tests that touch a report stub `queueMicrotask`. Test the once-per-message rule in a node test with `vi.resetModules()`, because browser mode does not reset module state.
- The `.d.ts` files carry the JSDoc, and the JS output has none. Write the option docs and defaults in the interface JSDoc.
- A consumer bundle of an adapter includes core. The React tree-shaking test measures the core code in that bundle, so new code in `observe`, `play` or `hiddenStyle` counts against the React size limits.
