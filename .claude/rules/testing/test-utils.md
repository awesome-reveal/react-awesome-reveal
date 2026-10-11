---
paths:
  - "packages/test-utils/**"
  - "packages/*/test/**"
---

# Shared test utilities

- `@awesome-reveal/test-utils` is private. It has no build, and release-please does not know it.
- The adapters do not list it as a dependency. They resolve it through the `tsconfig.base.json` paths and the `testUtils` alias in `vitest.config.ts`. A `workspace:*` dev dependency makes `pnpm publish` fail, because test-utils has no `version` field.
- Keep it free of frameworks. Each adapter wraps `intersect()` in its own update scope, such as React `act` or an awaited Vue `nextTick`.
- Each adapter imports the setup files from its own `test/setup` files. Then `tsc -p packages/<package>/test` sees the jest-dom matcher types.
- The console setup fails a test on each `console.error` or `console.warn` call, because frameworks report warnings, such as invalid props, only through the console.
