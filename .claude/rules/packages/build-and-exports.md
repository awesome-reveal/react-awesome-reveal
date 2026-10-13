---
paths:
  - "packages/*/package.json"
  - "packages/*/vite.config.ts"
  - "packages/*/test/package/**"
  - "vite.lib.config.ts"
  - "tsconfig.base.json"
---

# Build and exports

- A new entry point needs these changes:
  1. The `exports` map in `package.json`.
  2. The entry list in the package `vite.config.ts`.
  3. The `paths` in `tsconfig.base.json` and the alias in `vitest.config.ts`, when another workspace package imports it.
  4. The expected files and exports in `test/package/dist.test.ts`.
- `vite.lib.config.ts` makes every bare import external. Declare each one in `dependencies` or `peerDependencies`.
- `tree-shaking.test.ts` bundles consumer fixtures from `dist`, and checks the exports that stay and the minified size. Before you increase a size limit, find the code that grew, and give the reason in the PR.
- The package tests read `dist`, so run them with `pnpm test:package`, which builds first.
- The root `build` and `test:package` scripts run the packages with `--parallel`, which ignores the dependency order. So a package build or check must not read the `dist` of another package. The tsconfig paths point to the sources, and the build makes the other packages external.
- `reveal.css` lives in `packages/core/src`. The `revealCss` plugin of `vite.lib.config.ts` copies it into each package that exports it, with a `reveal.css.d.ts`. TypeScript 6 sets `noUncheckedSideEffectImports`, so a side-effect import with no declaration fails with TS2882.
