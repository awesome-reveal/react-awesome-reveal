---
paths:
  - "packages/test-utils/**"
  - "packages/*/test/**"
---

# Shared test utilities

- `@awesome-reveal/test-utils` is private. It has no build, and release-please does not know it.
- The adapters do not list it as a dependency. They resolve it through the `tsconfig.base.json` paths and the `testUtils` alias in `vitest.config.ts`. A `workspace:*` dev dependency would put a version that is not on npm into the published `package.json`.
- Keep it free of frameworks. Each adapter wraps `intersect()` in its own update scope, such as React `act` or Vue `nextTick`.
- Each adapter imports the setup files from a one-line `test/setup` file. Then `tsc -p packages/<package>/test` sees the jest-dom matcher types.
- The console setup fails a test on each `console.error` or `console.warn` call, because frameworks report invalid props and render problems only through the console.
