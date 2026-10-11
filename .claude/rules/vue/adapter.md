---
paths:
  - "packages/vue/**"
  - "playgrounds/vue/**"
---

# Vue adapter

- The sources are TypeScript render functions, not SFCs. The build needs no Vue plugin, and `vite-plugin-dts` emits the declarations. Only the tests and the playground have `.vue` files. `@vitejs/plugin-vue` is a root dev dependency, because `vitest.config.ts` imports it.
- `vue:unit` type-checks the tests with `vue-tsc`, because `tsc` cannot read `.vue` files. Use `pnpm --filter @awesome-reveal/vue exec vue-tsc -p test`, not `tsc -p packages/vue/test`. `test/types/Templates.vue` checks the template types with `<!-- @vue-expect-error -->`.
- `Reveal` declares `once` and `when` with `default: undefined`. Vue casts an absent Boolean prop to `false`, which turns off `once` and makes `when` control the reveal.
- `Reveal` renders the hidden style itself, with `observe` and `play` from core. Vue sets the element ref in a post-flush job, so the `observe` watcher is `sync`: then the observer exists when `mount()` returns. The `play` watcher is post-flush, so it runs after the patch that removes the hidden style, in the same task.
- `Reveal` sets `inheritAttrs: false` and merges the attributes before its own props. Vue merges inherited attributes last, so a user `opacity` would override the hidden style.
- `v-reveal` uses core `reveal()`. It is `deep`, so that a reactive options object that changes in place calls `updated`. Its `updated` hook sets the hidden opacity again, because a patch of a string `style` binding replaces the whole inline style.
- Of all directives, the hydration check of Vue knows only `v-show`. So `getSSRProps` of `v-reveal` adds `data-allow-mismatch="style"`. Without it, a `style` binding on the element causes a mismatch warning. The attribute needs Vue 3.5, which sets the start of the peer range.
- jsdom does not update the computed style of a detached element. Mount with `attachTo: document.body` before you check `toHaveStyle` after a change. `test/setup/dom.ts` unmounts the wrappers after each test.
- `describeSkills` type-checks only the `ts` fences of the consumer skills, not the `vue` fences.
