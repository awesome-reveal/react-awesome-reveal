---
paths:
  - "packages/vue/**"
  - "examples/vue/**"
---

# Vue adapter

- The sources are TypeScript render functions, not SFCs. The build needs no Vue plugin, and `vite-plugin-dts` emits the declarations. Only the tests and the example have `.vue` files. `@vitejs/plugin-vue` is a root dev dependency, because `vitest.config.ts` imports it.
- `vue:unit` type-checks the tests with `vue-tsc`, because `tsc` cannot read `.vue` files. Use `pnpm --filter @awesome-reveal/vue exec vue-tsc -p test`, not `tsc -p packages/vue/test`. `test/types/Templates.vue` checks the template types with `<!-- @vue-expect-error -->`.
- `Reveal` and `Cascade` share `defineReveal`. It declares `when` with `default: undefined`. Vue casts an absent Boolean prop to `false`, which makes `when` control the reveal.
- `defineReveal` gives the element to core with a function ref. Vue calls it with `null` at unmount, so no unmount hook is needed. Vue calls it in the patch, but a pending `<Suspense>` keeps the element outside the document, so `attach` waits for `onMounted`, which Suspense defers. A later ref call attaches at once.
- `defineReveal` runs `setOptions` in a post-flush watcher, after the patch. A pre-flush watcher runs while the old element is still attached. So an `as` change and a `when` change in the same tick play the entrance on the old element. Core plays in the task of the report, and Vue removes `data-awesome-reveal` in a microtask render of the same task, before the frame.
- `v-reveal` and `v-cascade` create one store for each element, with `createReveal` or `createCascade`, and set `data-awesome-reveal` itself, so the reveal belongs to its element. A directive keeps no state across elements, so a new element, such as a changed `key` or tag, starts a new reveal. The directive is `deep`, so that a reactive options object that changes in place calls `updated`. Its `updated` hook calls `setOptions`. A patch of a `style` binding cannot show a hidden element, because the package `reveal.css` hides it.
- `getSSRProps` of the directives returns only `hiddenAttributes` or `cascadeHiddenAttributes`. Do not add a style there: of all directives, the hydration check of Vue knows only `v-show`, so a style that only the server renders causes a mismatch warning.
- Mount with `attachTo: document.body` when a test checks `toHaveStyle` after a change. The test setup adds `reveal.css`, so `toHaveStyle({ opacity: "0" })` checks the hidden state. `test/setup/dom.ts` unmounts the wrappers after each test.
- `describeDocs` does not check the `vue` fences.
