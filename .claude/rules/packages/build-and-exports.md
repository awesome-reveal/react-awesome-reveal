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
