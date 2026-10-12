---
paths:
  - "packages/vue/**"
  - "examples/vue/**"
---

# Vue adapter

- The sources are TypeScript render functions, not SFCs. The build needs no Vue plugin, and `vite-plugin-dts` emits the declarations. Only the tests and the example have `.vue` files. `@vitejs/plugin-vue` is a root dev dependency, because `vitest.config.ts` imports it.
- `vue:unit` type-checks the tests with `vue-tsc`, because `tsc` cannot read `.vue` files. Use `pnpm --filter @awesome-reveal/vue exec vue-tsc -p test`, not `tsc -p packages/vue/test`. `test/types/Templates.vue` checks the template types with `<!-- @vue-expect-error -->`.
- `Reveal` declares `once` and `when` with `default: undefined`. Vue casts an absent Boolean prop to `false`, which turns off `once` and makes `when` control the reveal.
- `Reveal` gives the element to core with a function ref. Vue calls it with `null` at unmount, so no unmount hook is needed. Vue calls it in the patch, but a pending `<Suspense>` keeps the element outside the document, so `attach` waits for `onMounted`, which Suspense defers. A later ref call attaches at once.
- `Reveal` runs `setOptions` in a post-flush watcher, after the patch. A pre-flush watcher runs while the old element is still attached, so an `as` change with a `when` change in the same tick plays on the old element. Core plays in the task of the report, and Vue removes the hidden style in a microtask render of the same task, before the frame.
- `Reveal` sets `inheritAttrs: false` and merges the attributes before its own props. Vue merges inherited attributes last, so a user `opacity` would override the hidden style.
- `v-reveal` uses core `reveal()`, so the reveal belongs to its element. A directive keeps no state across elements, so a new element, such as a changed `key` or tag, starts a new reveal. The directive is `deep`, so that a reactive options object that changes in place calls `updated`. Its `updated` hook calls `setOptions`, which hides the element again after a patch of a `style` binding (see the core rule).
- Of all directives, the hydration check of Vue knows only `v-show`. So `getSSRProps` of `v-reveal` adds `data-allow-mismatch="style"`. Without it, a `style` binding on the element causes a mismatch warning. The attribute needs Vue 3.5, which sets the start of the peer range.
- Mount with `attachTo: document.body` when a test checks `toHaveStyle` after a change. `test/setup/dom.ts` unmounts the wrappers after each test.
- `describeDocs` does not check the `vue` fences. The `ts` fence of the README imports `./App.vue`, so the Vue package gives `describeDocs` an `ambient` declaration for `*.vue`.
