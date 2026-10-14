---
paths:
  - "packages/core/src/**"
---

# Core

- The root entry has only `reveal`, `cascade` and their types. Adapter machinery (`createReveal`, `hiddenAttributes`, the adapter `RevealOptions` with `when` and `onReveal`) stays in `src/adapter.ts`, behind `@awesome-reveal/core/adapter`. Do not re-export it from `src/index.ts`. The package `dist.test.ts` and `tree-shaking.test.ts` check this boundary.
- Do not add options, aliases or helpers to the imperative API. The API is frozen: `from` or native `keyframes`, `duration`, `threshold`, and `interval` for `cascade`. Each entrance plays once: there is no `once` option, because a reset on exit made the observer see the start state and loop at the viewport edge. Advanced motion uses native `Keyframe[]`. Generated keyframes stay internal in `src/animation.ts`.
- Imperative core needs no CSS. `motion()` creates a paused animation with `fill: "backwards"` at `currentTime = 0`, so the first keyframe hides the element before it enters the viewport. Do not inject a `<style>` and do not import CSS from a core module. SSR pre-hiding belongs to the adapters.
- The generated entrance uses individual `translate`, `scale`, `rotate` and `filter` with `composite: "add"` and neutral end values, so it composes with the element's own styles and has no implicit keyframe, which is not Baseline. Do not use an additive `transform` list: an author `scale(2)` doubles the offset. The opacity start is a separate replace keyframe, because Firefox and WebKit clamp a negative additive opacity before the addition. Chromium does not composite an effect with an additive keyframe. This cost is accepted for composability, and native `keyframes` are the composited escape hatch.
- Every failure leaves content visible. A throw from `animate()`, from the observer constructor or from `observe()` reveals at once. `dispose()` cancels the animations, so the elements go to their resting style. Do not add runtime validation for values that the browser validates.
- Reduced motion is automatic and has no option. When `prefers-reduced-motion: reduce` matches, `reveal` and `cascade` create no animation, and a later change to `reduce` disposes them.
- `cascade` observes each container and animates its direct element children with `delay = index * interval`. It reads the children once, when it starts. Do not add a child selector or a timeline abstraction.
- Do not throw when an API is missing. Without IntersectionObserver, reveal at once. Without `Element.animate`, reveal with no animation.
- Do not use `window` or `document` at module level. Server renderers import core. A selector resolves to no elements when `document` is undefined.
- The `.d.ts` files carry the JSDoc, and the JS output has none. Write the option docs and defaults in the type JSDoc.
- A consumer bundle of an adapter includes core. The tree-shaking tests measure the core code in that bundle, so new code in `animation.ts`, `observe.ts` or `adapter.ts` counts against the size limits of all adapters.

## Adapter store

- `createReveal` owns the state: the observer, `when ?? inView` and the play. It changes no DOM, except `data-reveal-ready` on `<html>`. The adapter renders `data-reveal` from `revealed`.
- Start `play` in the same task that removes `data-reveal`. Between the two, the element shows at full opacity, because `fill: "backwards"` applies the first keyframe only after `play` creates the animation.
- Hide in this order: cancel the animation, then tell the listener. Reveal in this order: tell the listener, then `play`, in the same task.
- `setOptions` replaces the options and does not merge them. Only a change of `when` or `threshold` restarts the observer. `createReveal` copies the options, because a directive can pass the same mutated object again.
- `when == null` means that the viewport decides. Use `??` and `== null`, not default values, because defaults do not apply to `null`.
- A revealed state plays once. `revealed` starts `false`, also with `when: true`, so that the server renders the element hidden. The first `attach` reveals and plays the entrance. A new element keeps the state and does not play again.
- A throwing `onReveal` goes to `report()`, which throws from a microtask, once for each message. Do not throw from `observe`, `play` or `createReveal`, because a render or an effect can call them. Tests that touch a report stub `queueMicrotask`.
- The behavior spec of the adapters is the contract suite in `packages/test-utils` (`contract.ts`, `contract-ssr.ts`). Change a behavior there first, so that all adapters follow. A framework adapter cannot add behavior that core does not have.
- Each adapter renders the hidden markup itself, with `hiddenAttributes`, and ships its own `reveal.css`. The CSS hides `[data-reveal="hidden"]`, and shows it again with reduced motion, with JavaScript off, in print and under `html[data-reveal-failed]`. The library writes no inline style, so a strict CSP needs no `'unsafe-inline'`. `data-reveal` is reserved.
- The first `attach` sets `data-reveal-ready` on `<html>`. A recovery script of the application can read it, and set `data-reveal-failed` when the client script does not start.
