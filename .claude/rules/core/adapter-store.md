---
paths:
  - "packages/core/src/adapter.ts"
  - "packages/*/src/reveal.css"
---

# Adapter store

- `createReveal` and `createCascade` share one store. It owns the state: the observer, `when ?? inView` and the play. It changes no DOM, except `data-awesome-reveal-ready` on the attached element. The adapter renders `data-awesome-reveal` from `revealed`.
- Start `play` in the same task that removes `data-awesome-reveal`. Between the two, the element shows at full opacity, because `fill: "backwards"` applies the first keyframe only after `play` creates the animation.
- Hide in this order: cancel the animation, then tell the listener. Reveal in this order: tell the listener, then `play`, in the same task.
- `setOptions` replaces the options and does not merge them. Only a change of `when` or `threshold` restarts the observer. `createReveal` copies the options, because a directive can pass the same mutated object again.
- `when == null` means that the viewport decides. Use `??` and `== null`, not default values, because defaults do not apply to `null`.
- A revealed state plays once. `revealed` starts `false`, also with `when: true`, so that the server renders the element hidden. The first `attach` reveals and plays the entrance. A new element keeps the state and does not play again. The same element attached again right after `attach(null)` plays again, because `null` cancelled its animation.
- The behavior spec of the adapters is the contract suite in `packages/test-utils` (`contract.ts`, `contract-ssr.ts`). Change a behavior there first, so that all adapters follow. A framework adapter cannot add behavior that core does not have.
- A cascade store reads the children in `play`, at the reveal, and not at `attach`, so children that the framework renders after the attach also animate. Imperative `cascade()` reads them when it is called. The adapter cascade hides the children, not the container: `[data-awesome-reveal="cascade"] > *`. With a hidden container, its background and border pop in with no animation. A child with `display: contents`, such as an Astro island or host, gets no visible entrance.
- Each adapter renders the hidden markup itself, with `hiddenAttributes` or `cascadeHiddenAttributes`, and ships its own `reveal.css`. The library writes no inline style, so a strict CSP needs no `'unsafe-inline'`. `data-awesome-reveal`, `data-awesome-reveal-ready` and the `awesome-reveal-hold` keyframes are reserved.
- `reveal.css` hides only on screen, with scripting on and no reduced motion. So print, no JavaScript and reduced motion keep the author opacity. Before the attach, a 5 s CSS animation hides the element, so markup that no script attaches shows again. `attach` sets `data-awesome-reveal-ready` on the element, and `opacity: 0 !important` holds it after that. The hold is per element, because a WAAPI hold cannot cover cascade children that render after the attach.
- An attach after the 5 s hides the element again, then plays the entrance. Expiry detection was rejected: it conflicts with `when: false`, and it needs a style flush. The READMEs document the flicker.
