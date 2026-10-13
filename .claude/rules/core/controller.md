---
paths:
  - "packages/core/src/**"
---

# Core controller

- Start `play` in the same task that removes `data-reveal`. Between the two, the element shows at full opacity, because `fill: "backwards"` applies the first keyframe only after `play` creates the animation.
- Do not throw when an API is missing. Without IntersectionObserver, reveal at once. Without `Element.animate`, reveal with no animation.
- Do not use `window` or `document` at module level. Server renderers import core.
- `createReveal` owns the state: the observer, `when ?? inView`, `once` and the play. It changes no DOM, except `data-reveal-ready` on `<html>`. `reveal()` wraps it, and sets or removes `data-reveal` when it calls the listener. An adapter that renders the attribute itself uses `createReveal` and does not call `reveal()`, which breaks hydration.
- Hide in this order: cancel the animation, then tell the listener. Reveal in this order: tell the listener, then `play`, in the same task.
- `setOptions` replaces the options and does not merge them. Only a change of `when`, `threshold`, `rootMargin` or `once` restarts the observer. `createReveal` copies the options, because a directive can pass the same mutated object again.
- `when == null` means that the viewport decides, and `null` is the same as `undefined` for every option of `reveal`, but not for the keyframes factories. Use `??` and `== null`, not default values, because defaults do not apply to `null`.
- A revealed state plays once. `revealed` starts `false`, also with `when: true`, so that the server renders the element hidden. The first `attach` reveals and plays the entrance. A new element keeps the state and does not play again.
- The browser validates `threshold`, `rootMargin`, easing and the other platform inputs. Library-owned numbers, such as `steps`, are clamped. A failure shows the element and goes to `report()`, which throws from a microtask, once for each message. Do not throw from `observe`, `play` or `createReveal`, because a render or an effect can call them. `play` stays silent when the browser has no `linear()`.
- Tests that touch a report stub `queueMicrotask`. Test the once-per-message rule in a node test with `vi.resetModules()`, because browser mode does not reset module state.
- The `.d.ts` files carry the JSDoc, and the JS output has none. Write the option docs and defaults in the interface JSDoc.
- A consumer bundle of an adapter includes core. The tree-shaking tests measure the core code in that bundle, so new code in `createReveal`, `observe`, `play` or the guards counts against the size limits of all adapters.
- The behavior spec is the contract suite in `packages/test-utils` (`contract.ts`, `contract-ssr.ts`). Change a behavior there first, so that all adapters follow. A framework adapter cannot add behavior that core does not have.
- Each adapter renders the hidden markup itself, with `hiddenAttributes`. `reveal.css` hides `[data-reveal="hidden"]`, and shows it again with JavaScript off, in print and under `html[data-reveal-failed]`. The library writes no inline style, so a strict CSP needs no `'unsafe-inline'`, and a framework that patches `style` cannot show a hidden element. `data-reveal` is reserved. The contract suites fail on an adapter that differs.
- The first `attach` sets `data-reveal-ready` on `<html>` for the recovery script of the docs. Once per page, it also reads the computed opacity of a hidden element, and reports a missing `reveal.css`. Keep this check out of the later attaches, because `getComputedStyle` forces a style recalculation.
