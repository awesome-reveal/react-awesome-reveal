---
paths:
  - "packages/core/src/adapter.ts"
---

# Adapter store

- `createReveal` and `createCascade` share one store. It owns the state: the observer, `when ?? inView` and the play. It changes no DOM, except `data-reveal-ready` on `<html>`. The adapter renders `data-reveal` from `revealed`.
- Start `play` in the same task that removes `data-reveal`. Between the two, the element shows at full opacity, because `fill: "backwards"` applies the first keyframe only after `play` creates the animation.
- Hide in this order: cancel the animation, then tell the listener. Reveal in this order: tell the listener, then `play`, in the same task.
- `setOptions` replaces the options and does not merge them. Only a change of `when` or `threshold` restarts the observer. `createReveal` copies the options, because a directive can pass the same mutated object again.
- `when == null` means that the viewport decides. Use `??` and `== null`, not default values, because defaults do not apply to `null`.
- A revealed state plays once. `revealed` starts `false`, also with `when: true`, so that the server renders the element hidden. The first `attach` reveals and plays the entrance. A new element keeps the state and does not play again. The same element attached again right after `attach(null)` plays again, because `null` cancelled its animation.
- The behavior spec of the adapters is the contract suite in `packages/test-utils` (`contract.ts`, `contract-ssr.ts`). Change a behavior there first, so that all adapters follow. A framework adapter cannot add behavior that core does not have.
- A cascade store reads the children in `play`, at the reveal, and not at `attach`, so children that the framework renders after the attach also animate. Imperative `cascade()` reads them when it is called. The adapter cascade hides the children, not the container: `[data-reveal="cascade"] > *`. With a hidden container, its background and border pop in with no animation. A child with `display: contents`, such as an Astro island or host, gets no visible entrance.
- Each adapter renders the hidden markup itself, with `hiddenAttributes` or `cascadeHiddenAttributes`, and ships its own `reveal.css`. The CSS hides `[data-reveal="hidden"]` and `[data-reveal="cascade"] > *`, and shows them again with reduced motion, with JavaScript off, in print and under `html[data-reveal-failed]`. The library writes no inline style, so a strict CSP needs no `'unsafe-inline'`. `data-reveal` is reserved.
- The first `attach` sets `data-reveal-ready` on `<html>`. A recovery script of the application can read it, and set `data-reveal-failed` when the client script does not start.
