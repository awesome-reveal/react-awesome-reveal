---
paths:
  - "packages/*/test/browser/**"
---

# Browser tests

- Vitest browser mode runs each test in Chromium, Firefox and WebKit through Playwright. The viewport size is fixed in `vitest.config.ts`, because the helpers scroll by viewport heights.
- The tests run inside an iframe. Browsers ignore the `rootMargin` of the implicit root for a target in an iframe, so check `rootMargin` through the observer options, not through scroll positions.
- Coverage uses istanbul, because v8 coverage works only in Chromium in browser mode.
- Use a long `duration` (60 s) when a test inspects a running animation, so that it does not finish first.
- Wait for a DOM change with `expect.element(...)`. Use `settle()` when you expect no change.
- In CI, a failed test runs again, and the first retry records a Playwright trace. Vitest copies the traces and the failure screenshots into `.vitest/attachments`, and CI uploads that folder.
