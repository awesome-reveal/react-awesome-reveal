---
paths:
  - "packages/react/**"
---

# React adapter

- Support React 18 and 19. CI runs the tests with each version. Keep `forwardRef` until the peer range drops React 18.
- Start `play` in a layout effect, in the commit that removes `hiddenStyle`. A passive effect can run after the paint, and then the element flashes.
- Keep `"use client"` at the top of each module that uses hooks. The build keeps one directive for each module.
- `react:unit` runs in jsdom, with the IntersectionObserver and `Element.animate` mocks in `test/mocks`. Use `intersect()` to change the visibility. The core browser tests cover the real browser behavior.
- A `console.error` or `console.warn` call fails the test. React reports invalid props, `act()` problems and server render problems only through the console.
- Type tests in `test/types` run with `react:unit`.
