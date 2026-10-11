---
name: migrating-from-v4
description: Migrates code from react-awesome-reveal v4 (Fade, Slide, Zoom, Bounce, cascade, triggerOnce, Emotion keyframes) to @awesome-reveal/react. Use when code imports react-awesome-reveal 4.x or its effect components, or when the user upgrades react-awesome-reveal to v5.
---

# Migrate from react-awesome-reveal v4

## Steps

1. Replace the `react-awesome-reveal` dependency with `@awesome-reveal/react`.
2. Remove `@emotion/react`, unless the app uses it for other code.
3. Make sure that the app uses React 18 or later.
4. Change the imports. `Reveal` is a named export now. The keyframes come from `@awesome-reveal/react/keyframes`.
5. Replace each effect component with `Reveal` and a keyframes factory, as the component table shows.
6. Change the props, as the props table shows.
7. Check the behavior changes below in each place that you change.
8. Run the type check and the tests of the app. Fix the errors, and run them again until they pass.

```tsx
// v4
import { Fade } from "react-awesome-reveal";
<Fade direction="up" cascade damping={0.2} triggerOnce>
  …
</Fade>;
```

```tsx
// @awesome-reveal/react
import { Reveal } from "@awesome-reveal/react";
import { slide } from "@awesome-reveal/react/keyframes";
<Reveal keyframes={slide({ distance: "100%", easing: "ease" })} duration={1000} stagger={200}>
  …
</Reveal>;
```

## Components

In v4, `left` and `right` name the side where the element starts, but `up` and `down` name the movement. `slide` `direction` always names the movement, so only `left` and `right` swap.

| v4                             | @awesome-reveal/react                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `import Reveal from "…"`       | `import { Reveal } from "@awesome-reveal/react"`                                                  |
| `<Reveal>` with no `keyframes` | `slide({ direction: "right", distance: "100%" })`                                                 |
| `<Fade>`                       | `fade()`                                                                                          |
| `<Fade direction="up">`        | `slide()`, or `slide({ distance: "100%" })` for the v4 distance                                   |
| `<Fade direction="down">`      | `slide({ direction: "down" })`                                                                    |
| `<Fade direction="left">`      | `slide({ direction: "right" })`                                                                   |
| `<Fade direction="right">`     | `slide({ direction: "left" })`                                                                    |
| `<Fade direction="left" big>`  | `slide({ direction: "right", distance: 2000 })`                                                   |
| `<Fade direction="top-left">`  | `enter({ x: "-100%", y: "-100%" })`                                                               |
| `<Slide>`                      | `slide({ direction: "right", distance: "100%", opacity: 1 })`                                     |
| `<Slide direction="up">`       | `slide({ distance: "100%", opacity: 1 })`                                                         |
| `<Zoom>`                       | `scale({ from: 0.3 })`, a close match                                                             |
| `<Bounce>`                     | `pop({ from: 0.3 })`, or `scale({ from: 0.3, easing: spring({ bounce: 0.5 }) })` for more bounces |
| `<JackInTheBox>`               | `pop({ from: 0.1 })`, with no rotation                                                            |
| `<Rotate>`                     | `enter({ rotate: -200 })`                                                                         |
| `<Roll>`                       | `enter({ x: "-100%", rotate: -120 })`                                                             |

These have no replacement: exit animations (`reverse`), `Flip`, `Hinge`, `AttentionSeeker`, and the directional `Bounce`, `Zoom` and `Rotate` variants. To keep one, port its keyframes from Animate.css (see below).

## Props

| v4                             | @awesome-reveal/react                                                                                                                                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cascade` and `damping`        | `stagger`, in milliseconds: `duration * damping`. The v4 defaults give `stagger={500}`.                                                                                                                                    |
| `fraction`                     | `threshold`                                                                                                                                                                                                                |
| `triggerOnce`                  | `once`. The default is `true` now. Set `once={false}` where v4 had no `triggerOnce`.                                                                                                                                       |
| `duration` (default `1000`)    | `duration` (default `600`). Set `duration={1000}` to keep the v4 duration.                                                                                                                                                 |
| `ease` timing, with no prop    | The `easing` option of each factory, default `cubic-bezier(0.22, 1, 0.36, 1)`. Set `easing: "ease"` to keep the v4 motion.                                                                                                 |
| `className`, `style`           | They apply to the one element that `Reveal` renders. v4 applied them to the `div` of each child. To keep that, put them on each child.                                                                                     |
| `childClassName`, `childStyle` | Style the children directly.                                                                                                                                                                                               |
| `onVisibilityChange`           | `useReveal` with `once: false`, and its `revealed` value in an effect. With the default `once: true`, `revealed` never goes back to `false`. v4 called the callback for each child, so use one `useReveal` for each child. |
| Emotion `keyframes`            | `defineKeyframes` or a keyframes array                                                                                                                                                                                     |

## Port an Animate.css animation

Copy the keyframes from the Animate.css source, and convert them to a keyframes array:

1. Split grouped selectors such as `from, 20%, 40%` into one keyframe for each offset.
2. Give each keyframe a timing function: its own `animation-timing-function`, or else the `animation-timing-function` of the Animate.css class. The default is `ease`.
3. Merge the keyframes that have the same offset and the same timing function. When two of them set the same property, keep the later value.
4. Remove the keyframes that set only a timing function. Browsers ignore them, so v4 did not show their easing.
5. Sort the keyframes by offset. `element.animate` throws a `TypeError` when an offset is smaller than the offset before it.
6. Write each CSS keyframe as an object, with properties in camelCase.
7. Write `from` as `offset: 0`, `to` as `offset: 1`, and `40%` as `offset: 0.4`.
8. Write the timing function of each keyframe except the last one as `easing`. Web Animations eases a keyframe with no `easing` linearly.

## Behavior changes

- A `<Reveal>` with no `keyframes` now plays `slide()`: it moves up 24px. v4 slid in from the left by 100%. The type check does not find these elements, so search the code for `<Reveal` with no `keyframes`.
- `Reveal` renders one element (`as`, `div` by default) around all its children. v4 rendered one `div` for each child. Check the CSS that targets these wrappers.
- v4 observed each child separately. One observer now watches the whole `Reveal`, and all children reveal together, also children below the fold. Split a long list into several `Reveal` elements, or use `useReveal` for each item.
- Use `stagger` to animate the children one after the other.
- Lists, fragments and text have no special handling. For a list, use `as="ul"` with `stagger`.
- Animations do not stay applied after they finish, so a transformed element no longer breaks `position: fixed` children or `z-index`.
