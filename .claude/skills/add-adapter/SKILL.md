---
name: add-adapter
description: Adds a framework adapter package (@awesome-reveal/<framework>) to the workspace. Use when starting the Vue, Svelte, Solid, Angular or another adapter.
---

# Add a framework adapter

Use `packages/react` as the model. Keep the option names and defaults of core, so that the docs of all adapters agree.

1. Create `packages/<framework>` with `package.json`, `tsconfig.json`, `vite.config.ts`, `test/tsconfig.json` and the `test/setup` files. Copy them from `packages/react`, and change:
   - `name`, `description`, `keywords` and `repository.directory`.
   - The framework peer dependency and its dev dependencies.
   - `"@awesome-reveal/core": "workspace:^"` stays. Keep `"version"` equal to the other packages.
2. If the framework needs a compiler plugin, extend `defineLibConfig` in `vite.lib.config.ts` to accept plugins.
3. Add `src/keyframes.ts` with `export * from "@awesome-reveal/core/keyframes";`, and the `./keyframes` export.
4. Write the API on core:
   - Use `reveal()` when the adapter owns an element and the framework does not render its style (directives, actions).
   - Use `observe`, `play` and `hiddenStyle` when the framework renders the style, as the React adapter does.
   - Add `when` in the adapter.
5. Render `hiddenStyle` and `data-reveal="hidden"` in the server markup, so that the element does not show before hydration.
6. Add the Vitest projects to `vitest.config.ts`: `<framework>:unit`, `<framework>:package`, and `<framework>:ssr` when the framework renders on a server. Give the `resolve` alias to `:unit` and `:ssr` only, because `:package` tests `dist`.
7. Port the tests of `packages/react/test/package`: the dist files and exports, the server markup, the skills, and the tree-shaking fixtures with size limits.
8. Add the consumer skills in `packages/<framework>/skills/<name>/SKILL.md`, and add `skills` to `files`. Port `adding-reveal-animations` from the React package.
9. Add `playgrounds/<framework>`, with the sections of `playgrounds/react`.
10. Add the package to `release-please-config.json`, with `"component"` set to the package name, and to `linked-versions`. Without `"component"`, release-please drops the npm scope from the tags. Add its path to `.release-please-manifest.json`, with the current version of core. Before the release PR merges, do "Publish a new package" in the `release` skill.
11. Add a CI matrix entry only when the peer range covers more than one major version of the framework.
12. Add `.claude/rules/<framework>/adapter.md` for the gotchas of the framework, with `paths: ["packages/<framework>/**"]`.
13. Run the checks:
    - `pnpm test --coverage`
    - `pnpm exec tsc -p packages/<framework>/test`
    - `pnpm test:package`
    - `pnpm lint` and `pnpm format:check`
