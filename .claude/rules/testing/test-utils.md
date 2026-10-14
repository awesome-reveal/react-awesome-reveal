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
- The DOM setup adds the adapter `reveal.css` to the document with `installStylesheet()`, because Vitest turns CSS imports into empty strings. jsdom does not update the computed style of an element that is not in the document. Attach the element to `document.body` before you check `toHaveStyle` after a change.
- `contract.ts` (`describeContract`) and `contract-ssr.ts` (`describeSSRContract`) hold one scenario list that every adapter runs, so that all adapters behave the same. Each adapter has a `test/contract.test.ts(x)`, and the SSR contract runs from the `ssr.test` file of the adapter. The Astro contract runs in jsdom, and Astro builds the markup of `Reveal.astro` by hand, so `ssr.test.ts` checks the real output.
- Do not skip a contract scenario to make a run pass. A scenario that fails is a bug of the adapter.
- Scenarios that expect a report must collect it: reports are thrown from a microtask, which Vitest counts as an unhandled error. Use a unique error message in each scenario, so that a once-per-page report of an identical message cannot hide it.
- Server markup in a hydration test is a literal. React 18 warns when jsdom, which has a `document`, renders it with `renderToString`.
