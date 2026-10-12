---
paths:
  - "packages/react/**"
---

# React adapter

- Support React 18 and 19. CI runs the tests with each version. Keep `forwardRef` until the peer range drops React 18.
- Core starts `play` in the task of the report. React removes `hiddenStyle` in a microtask render of the same task, so the element does not flash. Do not start the animation in a passive effect.
- Keep `"use client"` at the top of each module that uses hooks. The build keeps one directive for each module.
- `react:unit` runs in jsdom, with the IntersectionObserver and `Element.animate` mocks of `@awesome-reveal/test-utils`. Use `intersect()` from `test/intersect.ts` to change the visibility, because it wraps the change in `act`. The core browser tests cover the real browser behavior.
- React reports `act()` warnings and server render warnings only through the console, so the shared console setup catches them.
- Type tests in `test/types` run with `react:unit`.
- `useReveal` gives the element to core in a layout effect, after `setOptions` of the same commit, and not in the ref callback. A ref callback runs before the layout effect, so core would start the animation with the options of the previous render. A detach waits one microtask: React detaches and attaches the same element again in one commit when a callback ref changes, as an inline callback does on each render. Without the wait, each render cancels and replays the animation.
- Core starts the animation in the task of the report, before React renders the change of `revealed`. Children that the consumer renders only when `revealed` is true are not stagger targets.
