---
name: adding-framework-adapters
description: Adds a framework adapter package (@awesome-reveal/<framework>) to the workspace, with its build, tests, consumer skills, playground and release config. Use when you start the Vue, Svelte, Solid, Angular or another framework adapter.
---

# Add a framework adapter

Use `packages/react` as the model. Keep the option names and defaults of core, so that the docs of all adapters agree.

Copy the steps into your task list, and mark each step when it is done.

Keep the item of the adapter on the plan board, https://github.com/orgs/awesome-reveal/projects/1, in sync with the work. Set its Status to "In Progress" before step 1. Add the PR number to each checklist item that a PR covers, tick the item when the PR merges, and set "Done" when all items are ticked.

1. Create `packages/<framework>` with `package.json`, `tsconfig.json`, `vite.config.ts`, `test/tsconfig.json` and the `test/setup` files. Copy them from `packages/react`, and change:
   - `name`, `description`, `keywords` and `repository.directory`.
   - The framework peer dependency and its dev dependencies.
   - The JSX options in `tsconfig.json`, such as `jsxImportSource`. Remove them if the framework has no JSX.
   - `"@awesome-reveal/core": "workspace:^"` stays. Keep `"version"` equal to the other packages.
   - Add the package and its `/keyframes` entry to the `paths` in `tsconfig.base.json`, so that the playground type-checks against the sources.
2. Prefer plain TypeScript sources, such as render functions, when the framework allows it. Then the build needs no compiler plugin, and `vite-plugin-dts` emits the declarations. If the framework needs a compiler plugin, pass it to `defineLibConfig` in `vite.config.ts` as the second argument. Check the declarations and the output format:
   - `vite-plugin-dts` emits declarations for `.vue` files only when `@vue/language-core` is installed.
   - `vite-plugin-dts` cannot emit declarations for `.svelte` files. Svelte libraries use `@sveltejs/package`.
   - Solid libraries also publish uncompiled JSX under a `"solid"` export condition, so that the consumer compiles it for the DOM or the server.
3. Add `src/keyframes.ts` with `export * from "@awesome-reveal/core/keyframes";`, and the `./keyframes` export.
4. Write the API on core. Choose the layer for each API, not for the whole adapter, because one adapter can have both kinds:
   - Use `reveal()` when the adapter owns an element and the framework does not render its style (directives, actions, attachments).
   - Use `observe`, `play` and `hiddenStyle` when the framework renders the element, as the React adapter and the Vue `<Reveal>` do. Render the hidden style in the element, so that the client render matches the server markup. Show the element when `when ?? inView` is true, as `reveal()` does.
   - A new element after the reveal, such as a changed `as` tag, must not replay the animation.
5. Render `hiddenStyle` and `data-reveal="hidden"` in the server markup, so that the element does not show before hydration. Add a hydration test that renders on the server, hydrates in jsdom, and fails on a mismatch warning, as `packages/vue/test/hydration.test.ts` does. A style that only the server renders can cause a mismatch.
6. Add the Vitest projects to `vitest.config.ts`: `<framework>:unit`, `<framework>:package`, and `<framework>:ssr` when the framework renders on a server.
   - Give the `sources` alias to `:unit` and `:ssr`, and only the `testUtils` alias to `:package`, because `:package` tests `dist`.
   - Add the package to the coverage thresholds.
   - Add a `typecheck` block to `:unit`, as `react:unit` has, so that `pnpm test` runs the type tests. If `tsc` cannot read the component files, set the `checker` that can, such as `vue-tsc` for Vue.
   - If the tests compile component files, add the compiler plugin to the project `plugins`, and to the root `devDependencies`, because the root `vitest.config.ts` imports it.
   - If the components have their own file extension, such as `.vue`, make sure that `.lintstagedrc.mjs` passes it to `vitest related`.
7. Write the unit tests with the mocks of `@awesome-reveal/test-utils`. Add a `test/intersect.ts` that wraps `intersect()` in the update scope of the framework, as `packages/react/test/intersect.ts` does.
8. Port the tests of `packages/react/test/package`: the dist files and exports, the server markup, `describeSkills`, and the tree-shaking fixtures with size limits. Drop the `"use client"` test if the framework has no server components. `describeSkills` type-checks only `ts` and `tsx` fences, so put setup and keyframes examples of the consumer skills in `ts` fences.
9. Add the consumer skills in `packages/<framework>/skills/<name>/SKILL.md`, and add `skills` to `files`. Port `adding-reveal-animations` from the React package.
10. Add `playgrounds/<framework>`, with the sections of `playgrounds/react`.
11. Add the package to `release-please-config.json`, with `"component"` set to the package name, and to `linked-versions`. Without `"component"`, release-please drops the npm scope from the tags. Add its path to `.release-please-manifest.json`, with the current version of core. Before the release PR merges, do "Publish a new package" in the `releasing-packages` skill. Its steps need the npm one-time codes of the user, so list them in your final report.
12. Update the repo config for the framework:
    - If the peer range covers an older major version of the framework, add it to the `framework` matrix in `.github/workflows/ci.yml`.
    - Add a group with the framework packages to the `npm` entry of `.github/dependabot.yml`.
    - If oxlint has a plugin for the framework, such as `vue`, enable it in an `overrides` entry of `.oxlintrc.json`. Limit the entry to the package and its playground, as the React entry does.
13. Add the package to the package tables in the root `README.md` and in `packages/core/README.md`. In `.github/ISSUE_TEMPLATE/bug_report.yml`, add it to the `package` dropdown, and add the `vite.new` template of the framework, such as `vite.new/vue-ts`, to the reproduction field.
14. Add `.claude/rules/<framework>/adapter.md` for the gotchas of the framework, with `paths: ["packages/<framework>/**", "playgrounds/<framework>/**"]`.
15. Add the docs work for the adapter page to the "adapter pages" item of the docs project, https://github.com/users/morellodev/projects/4. The docs site is a separate repo.
16. Run the checks:
    - `pnpm test --coverage`
    - `pnpm exec tsc -p packages/<framework>/test`, or the checker of step 6, such as `pnpm --filter @awesome-reveal/vue exec vue-tsc -p test`
    - `pnpm test:package`
    - `pnpm lint` and `pnpm format:check`
    - A manual check of the playground in a browser
