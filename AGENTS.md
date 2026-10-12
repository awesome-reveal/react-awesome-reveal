# awesome-reveal

Reveal-on-scroll animations for many frameworks, built on IntersectionObserver and the Web Animations API. This pnpm workspace publishes the `@awesome-reveal/*` packages.

## Map

- `packages/core`: the framework-independent controller and the `/keyframes` entry point.
- `packages/react`, `packages/vue`, `packages/astro`: the framework adapters. Each depends on core and re-exports `/keyframes`.
- `packages/react-awesome-reveal`: the compat package for v4 users. It re-exports `@awesome-reveal/react`.
- `packages/test-utils`: private test mocks, setup files and checks for the adapters.
- `packages/*/skills`: agent skills for the users of each package. pnpm links them into consumer projects.
- `examples/react`, `examples/vue`, `examples/astro`, `examples/next`: apps for manual checks (`pnpm --filter example-react dev`). Build the packages first for `examples/next`.
- `vite.lib.config.ts`: the library build that all packages share.
- `vitest.config.ts`: one Vitest project for each package and test kind, named `<package>:<kind>`.

## Commands

Use the Node version in `.nvmrc`. jsdom needs Node `^22.22.2`, `^24.15.0` or `>=26`.

- `pnpm exec playwright install --with-deps --only-shell chromium firefox webkit`: run once before the browser tests.
- `pnpm test`: the unit, SSR and browser tests. Add `--coverage` to check the CI thresholds.
- `pnpm vitest run --project core:browser`: one project.
- `pnpm exec tsc -p packages/<package>/test`: type-check the tests. Vue uses `vue-tsc` instead of `tsc`. `pnpm build` type-checks only `src`.
- `pnpm test:package`: build, then test the `dist` output with Vitest, publint and attw.
- `pnpm build`, then `node scripts/smoke.mjs <core|react|compat|vue|astro|next> [dependency@version ...]`: install the packed tarballs into a clean project and build it. CI runs the matrix.
- `pnpm lint` and `pnpm format`.

The pre-commit hook runs oxlint, oxfmt and the unit and SSR tests related to the staged files.

## Rules

- Open PRs against `next`. `main` keeps the v4 line until 1.0 ships.
- Use Conventional Commits. release-please writes the changelog from them, so mark each breaking change with `!` and a `BREAKING CHANGE:` footer.
- All packages share one version, through `linked-versions` in `release-please-config.json`. Each adapter depends on `@awesome-reveal/core` with `workspace:^`.
- `react-awesome-reveal` is the exception. It continues the v4 version line, from 5.0.0. Do not add it to `linked-versions`: release-please gives all linked packages the highest version.
- Core imports no framework. The reveal options and all the behavior live in core, and an adapter only binds them to its framework, so that all adapters behave the same. The contract suite in `packages/test-utils` checks it.
- The packages are ESM-only, with `"sideEffects": false`. The build keeps one file per module, so bundlers drop the modules that a consumer does not import.
- Tests and type checks use the sources of other workspace packages, through the `tsconfig.base.json` paths and the `vitest.config.ts` alias. No build is necessary first.
