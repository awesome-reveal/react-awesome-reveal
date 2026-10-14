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
  3. The `paths` in `tsconfig.base.json` and the alias in `vitest.config.ts`, when another workspace package imports it. Astro has its own aliases in `packages/astro/vitest.config.ts` and `packages/astro/test/e2e/setup.ts`.
  4. The expected files and exports in `test/package/dist.test.ts`.
- `vite.lib.config.ts` makes every bare import external. Declare each one in `dependencies` or `peerDependencies`.
- `tree-shaking.test.ts` bundles consumer fixtures from `dist`, and checks the exports that stay and the minified size. Core also checks the gzip size. Astro has no tree-shaking test: `test/package/dist.test.ts` checks the size of its client script. Before you increase a size limit, find the code that grew, and give the reason in the PR.
- The package tests read `dist`, so run them with `pnpm test:package`, which builds first.
- The root `build` and `test:package` scripts run the packages with `--parallel`, which ignores the dependency order. So a package build or check must not read the `dist` of another package. The tsconfig paths point to the sources, and the build makes the other packages external.
- Core ships no CSS. Each adapter has its own `src/reveal.css`, and its modules import it, so the user imports no stylesheet. React and Vue import it through the `#reveal-style.css` subpath import: the `node` condition resolves to an empty module, so Node and the server builds of bundlers do not import CSS. The browser build gets the CSS, and Next.js adds it to the server HTML. `src/reveal-style.d.ts` declares `#reveal-style.css` for the build type check, which runs before `dist` exists. The `revealCss` plugin of `vite.lib.config.ts` adds `reveal.css.d.ts`, because TypeScript 6 sets `noUncheckedSideEffectImports`, and a side-effect import with no declaration fails with TS2882. The CSS is not a public export.
- Keep `.css` at the end of the subpath import key. The dev server of Vite pre-bundles dependencies, and it makes an import external as CSS only when the specifier ends in `.css`. With a key such as `#reveal-style`, Rolldown parses `reveal.css` as JavaScript and the dev server fails. The smoke test runs `vite optimize` to catch this.
