---
"react-awesome-reveal": major
---

Support React 19 and update `react-intersection-observer` to v11.

- **Breaking:** the `react` peer dependency is now `>=17.0.0`. `react-intersection-observer` already required React 17 or later.
- **Breaking:** `onVisibilityChange` no longer fires with `false` on mount for elements that start off-screen. It first fires when the element becomes visible. Later enter and leave changes fire as before.
- Fragment and text children with `triggerOnce` and a non-zero `fraction` now animate. Before, they could stay hidden.
- Fragment children are detected on React 17 and 18 again. The `react-is` dependency is removed.
