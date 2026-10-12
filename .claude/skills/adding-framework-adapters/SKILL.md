---
name: adding-framework-adapters
description: Adds a framework adapter package (@awesome-reveal/<framework>) to the workspace, with its build, tests, consumer skills, example and release config. Use when you start a new framework adapter, such as Svelte, Solid or Angular.
---

# Add a framework adapter

Use `packages/react` and `packages/vue` as models. Both pass the contract suite and have a hydration test. Core does all the work, and an adapter only binds it to the framework, so that every framework behaves the same.

Copy the steps into your task list, and mark each step when it is done.

Keep the item of the adapter on the plan board, https://github.com/orgs/awesome-reveal/projects/1, in sync with the work. Set its Status to "In Progress" before step 1. Add the PR number to each checklist item that a PR covers, tick the item when the PR merges, and set "Done" when all items are ticked.

1. Create `packages/<framework>` with `package.json`, `tsconfig.json`, `vite.config.ts`, `test/tsconfig.json` and the `test/setup` files. Copy them from `packages/react`, and change:
   - `name`, `description`, `keywords` and `repository.directory`.
   - The framework peer dependency and its dev dependencies.
   - The JSX options in `tsconfig.json`, such as `jsxImportSource`. Remove them if the framework has no JSX.
   - `"@awesome-reveal/core": "workspace:^"` stays. Keep `"version"` equal to the other packages.
   - Add the package and its `/keyframes` entry to the `paths` in `tsconfig.base.json`, so that the example type-checks against the sources.
2. Prefer plain TypeScript sources, such as render functions, when the framework allows it. Then the build needs no compiler plugin, and `vite-plugin-dts` emits the declarations. If the framework needs a compiler plugin, pass it to `defineLibConfig` in `vite.config.ts` as the second argument. Check the declarations and the output format:
   - `vite-plugin-dts` emits declarations for `.vue` files only when `@vue/language-core` is installed.
   - `vite-plugin-dts` cannot emit declarations for `.svelte` files. Svelte libraries use `@sveltejs/package`.
   - Solid libraries also publish uncompiled JSX under a `"solid"` export condition, so that the consumer compiles it for the DOM or the server.
3. Add `src/keyframes.ts` with `export * from "@awesome-reveal/core/keyframes";`, and the `./keyframes` export.
4. Write the API as a binding on core. Choose the layer for each API, not for the whole adapter, because one adapter can have both kinds:
   - Use `reveal()` when the adapter owns an element and the framework does not render its style (directives, actions, attachments, custom elements).
   - Use `createReveal` when the framework renders the element, as the React adapter and the Vue `<Reveal>` do. Do not call `reveal()` there: it changes the style after the framework rendered it, and that breaks hydration.
   - Obey the adapter contract:
     - Take exactly the options of core, with the same names, defaults and `null` meaning. Do not add an option or a default.
     - Let one core object own the observer, the animation and `when`. Do not rebuild that state machine in the adapter.
     - Render the hidden state of core on the revealed element: `hiddenStyle` after the user `style`, and `data-reveal="hidden"`, while `revealed` is false. The client render must equal the server markup. A stylesheet rule instead of an inline style is allowed when the framework forbids style attributes, as `security.csp` does for Astro. Then the rule must hide the element before the script, win over an inline `opacity` (`!important`), and have no specificity, so that the print rule of the docs overrides it.
     - Do not replay the animation on a new element, such as a changed `as` tag. `attach` keeps the state. A directive that is bound to its element is the only exception.
     - Treat `data-reveal` as reserved, and give back the inline `opacity` of the user at the reveal.
     - Do not delay the start of the animation: core starts it in the task of the report.
     - Do not catch the errors of core. It reports them.
5. Render the hidden state in the server markup, so that the element does not show before hydration. Add a hydration test that renders on the server, hydrates in jsdom, and fails on a mismatch warning, as `packages/react/test/hydration.test.tsx` and `packages/vue/test/hydration.test.ts` do. A style that only the server renders can cause a mismatch.
6. Add the Vitest projects to `vitest.config.ts`: `<framework>:unit`, `<framework>:package`, and `<framework>:ssr` when the framework renders on a server.
   - Give the `sources` alias to `:unit` and `:ssr`, and only the `testUtils` alias to `:package`, because `:package` tests `dist`.
   - Add the package to the coverage thresholds.
   - Add a `typecheck` block to `:unit`, as `react:unit` has, so that `pnpm test` runs the type tests. If `tsc` cannot read the component files, set the `checker` that can, such as `vue-tsc` for Vue.
   - If the tests compile component files, add the compiler plugin to the project `plugins`, and to the root `devDependencies`, because the root `vitest.config.ts` imports it.
   - If the components have their own file extension, such as `.vue`, make sure that `.lintstagedrc.mjs` passes it to `vitest related`.
7. Write the unit tests with the mocks of `@awesome-reveal/test-utils`. Add a `test/intersect.ts` that wraps `intersect()` in the update scope of the framework, as `packages/react/test/intersect.ts` does. Add `test/contract.test.ts` with a harness for `describeContract` of each public API, and run `describeSSRContract` from the SSR test, as the React and Vue packages do. A scenario that fails is a bug of the adapter. Do not skip it. Use `drift` only for a known gap that has an item on the board.
8. Port the tests of `packages/react/test/package`: the dist files and exports, the server markup, `describeDocs`, and the tree-shaking fixtures with size limits. Drop the `"use client"` test if the framework has no server components. `describeDocs` type-checks only the `ts` and `tsx` fences of the consumer skills and of the README, so put setup and keyframes examples in these fences, as whole modules with their imports.
9. Add the consumer skills in `packages/<framework>/skills/<name>/SKILL.md`, and add `skills` to `files`. Port `adding-reveal-animations` from the React package. Include the `<noscript>` and print CSS of the core README, or say why the adapter needs none.
10. Add `examples/<framework>`, with the sections of `examples/react`.
11. Add the package to `release-please-config.json`, with `"component"` set to the package name, and to `linked-versions`. Without `"component"`, release-please drops the npm scope from the tags. Add its path to `.release-please-manifest.json`, with the current version of core. Before the release PR merges, do "Publish a new package" in the `releasing-packages` skill. Its steps need the npm one-time codes of the user, so list them in your final report.
12. Update the repo config for the framework:
    - If the peer range covers an older major version of the framework, add it to the `framework` matrix in `.github/workflows/ci.yml`.
    - Add a `<framework>` case to `cases` in `scripts/smoke.mjs`, as the `vue` case does: it installs the tarballs, builds a page, and checks the server markup. Add entries to the `smoke` matrix in `ci.yml` for the lowest and the highest version of the peer range. Add the case to the usage comment of `smoke.mjs` and to the `smoke.mjs` command in `AGENTS.md`. The "Require CI" ruleset lists each `smoke` matrix name, and only an admin can change it, so list the new names in your final report.
    - Add a group with the framework packages to the `npm` entry of `.github/dependabot.yml`.
    - If oxlint has a plugin for the framework, such as `vue`, enable it in an `overrides` entry of `.oxlintrc.json`. Limit the entry to the package and its example, as the React entry does.
13. Add the package to the package tables in the root `README.md` and in `packages/core/README.md`. In `.github/ISSUE_TEMPLATE/bug_report.yml`, add it to the `package` dropdown, and add the `vite.new` template of the framework, such as `vite.new/vue-ts`, to the reproduction field.
14. Add `.claude/rules/<framework>/adapter.md` for the gotchas of the framework, with `paths: ["packages/<framework>/**", "examples/<framework>/**"]`.
15. Add the docs work for the adapter page to the "adapter pages" item of the docs project, https://github.com/users/morellodev/projects/4. The docs site is a separate repo.
16. Run the checks:
    - `pnpm test --coverage`
    - `pnpm exec tsc -p packages/<framework>/test`, or the checker of step 6, such as `pnpm --filter @awesome-reveal/vue exec vue-tsc -p test`
    - `pnpm test:package`
    - `node scripts/smoke.mjs <framework>`, after `pnpm test:package` built the packages
    - `pnpm lint` and `pnpm format:check`
    - A manual check of the example in a browser

    Fix each failure, then run all the checks again. Open the PR only when all of them pass.
