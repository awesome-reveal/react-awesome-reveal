---
name: adding-framework-adapters
description: Adds a framework adapter package (@awesome-reveal/<framework>) to the workspace, with its build, tests, consumer skills, playground and release config. Use when you start the Vue, Svelte, Solid, Angular or another framework adapter.
---

# Add a framework adapter

Use `packages/react` as the model. Keep the option names and defaults of core, so that the docs of all adapters agree.

Copy the steps into your task list, and mark each step when it is done.

1. Create `packages/<framework>` with `package.json`, `tsconfig.json`, `vite.config.ts`, `test/tsconfig.json` and the `test/setup` files. Copy them from `packages/react`, and change:
   - `name`, `description`, `keywords` and `repository.directory`.
   - The framework peer dependency and its dev dependencies.
   - The JSX options in `tsconfig.json`, such as `jsxImportSource`. Remove them if the framework has no JSX.
   - `"@awesome-reveal/core": "workspace:^"` stays. Keep `"version"` equal to the other packages.
2. If the framework needs a compiler plugin, pass it to `defineLibConfig` in `vite.config.ts` as the second argument. Check the declarations and the output format:
   - `vite-plugin-dts` emits declarations for `.vue` files only when `@vue/language-core` is installed.
   - `vite-plugin-dts` cannot emit declarations for `.svelte` files. Svelte libraries use `@sveltejs/package`.
   - Solid libraries also publish uncompiled JSX under a `"solid"` export condition, so that the consumer compiles it for the DOM or the server.
3. Add `src/keyframes.ts` with `export * from "@awesome-reveal/core/keyframes";`, and the `./keyframes` export.
4. Write the API on core:
   - Use `reveal()` when the adapter owns an element and the framework does not render its style (directives, actions).
   - Use `observe`, `play` and `hiddenStyle` when the framework renders the style, as the React adapter does.
   - Add `when` in the adapter.
5. Render `hiddenStyle` and `data-reveal="hidden"` in the server markup, so that the element does not show before hydration.
6. Add the Vitest projects to `vitest.config.ts`: `<framework>:unit`, `<framework>:package`, and `<framework>:ssr` when the framework renders on a server.
   - Give the `sources` alias to `:unit` and `:ssr`, and only the `testUtils` alias to `:package`, because `:package` tests `dist`.
   - Add the package to the coverage thresholds.
   - If the components have their own file extension, such as `.vue`, make sure that `.lintstagedrc.mjs` passes it to `vitest related`.
7. Write the unit tests with the mocks of `@awesome-reveal/test-utils`. Add a `test/intersect.ts` that wraps `intersect()` in the update scope of the framework, as `packages/react/test/intersect.ts` does.
8. Port the tests of `packages/react/test/package`: the dist files and exports, the server markup, `describeSkills`, and the tree-shaking fixtures with size limits.
9. Add the consumer skills in `packages/<framework>/skills/<name>/SKILL.md`, and add `skills` to `files`. Port `adding-reveal-animations` from the React package.
10. Add `playgrounds/<framework>`, with the sections of `playgrounds/react`.
11. Add the package to `release-please-config.json`, with `"component"` set to the package name, and to `linked-versions`. Without `"component"`, release-please drops the npm scope from the tags. Add its path to `.release-please-manifest.json`, with the current version of core. Before the release PR merges, do "Publish a new package" in the `releasing-packages` skill.
12. Update the repo config for the framework:
    - If the peer range covers an older major version of the framework, add it to the `framework` matrix in `.github/workflows/ci.yml`.
    - Add a group with the framework packages to the `npm` entry of `.github/dependabot.yml`.
    - If oxlint has a plugin for the framework, such as `vue`, enable it in an `overrides` entry of `.oxlintrc.json`. Limit the entry to the package and its playground, as the React entry does.
13. Add the package to the package tables in the root `README.md` and in `packages/core/README.md`, and to the `package` dropdown in `.github/ISSUE_TEMPLATE/bug_report.yml`.
14. Add `.claude/rules/<framework>/adapter.md` for the gotchas of the framework, with `paths: ["packages/<framework>/**"]`.
15. Run the checks:
    - `pnpm test --coverage`
    - `pnpm exec tsc -p packages/<framework>/test`
    - `pnpm test:package`
    - `pnpm lint` and `pnpm format:check`
