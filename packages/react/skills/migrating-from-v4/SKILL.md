---
name: migrating-from-v4
description: Migrates code from react-awesome-reveal v4 (Fade, Slide, Zoom, Bounce, cascade, triggerOnce, Emotion keyframes) to @awesome-reveal/react. Use when code imports react-awesome-reveal 4.x or its effect components, or when the user upgrades react-awesome-reveal to v5.
---

# Migrate from react-awesome-reveal v4

## Steps

1. Replace the `react-awesome-reveal` dependency with `@awesome-reveal/react`.
2. Remove `@emotion/react`, unless the app uses it for other code.
3. Make sure that the app uses React 18 or later.
4. Import `@awesome-reveal/react/reveal.css` once, in the root of the app. Without it, the elements show before the reveal.
5. Change the imports. `Reveal` is a named export now. The keyframes factories come from `@awesome-reveal/react`.
6. Replace each effect component with `Reveal`, as the component table shows.
7. Change the props, as the props table shows.
8. Check the behavior changes below in each place that you change.
9. Run the type check and the tests of the app. Fix the errors, and run them again until they pass.

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
<Reveal distance="100%" easing="ease" duration={1000} stagger={200}>
  …
</Reveal>;
```

## Components

`from` names the side where the element starts. In v4, `left` and `right` name that side too, but `up` and `down` name the movement. So `up` becomes `from="bottom"`, and `down` becomes `from="top"`.

| v4                             | @awesome-reveal/react                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `import Reveal from "…"`       | `import { Reveal } from "@awesome-reveal/react"`                                                             |
| `<Reveal>` with no `keyframes` | `<Reveal from="left" distance="100%">`                                                                       |
| `<Fade>`                       | `<Reveal keyframes={fade()}>`                                                                                |
| `<Fade direction="up">`        | `<Reveal>`, or `<Reveal distance="100%">` for the v4 distance                                                |
| `<Fade direction="down">`      | `<Reveal from="top">`                                                                                        |
| `<Fade direction="left">`      | `<Reveal from="left">`                                                                                       |
| `<Fade direction="right">`     | `<Reveal from="right">`                                                                                      |
| `<Fade direction="left" big>`  | `<Reveal from="left" distance={2000}>`                                                                       |
| `<Fade direction="top-left">`  | `<Reveal from={{ x: "-100%", y: "-100%" }}>`                                                                 |
| `<Slide>`                      | `<Reveal from={{ x: "-100%", opacity: 1 }}>`                                                                 |
| `<Slide direction="up">`       | `<Reveal from={{ y: "100%", opacity: 1 }}>`                                                                  |
| `<Zoom>`                       | `<Reveal from={{ scale: 0.3 }}>`, a close match                                                              |
| `<Bounce>`                     | `<Reveal keyframes={pop({ from: 0.3 })}>`, or `<Reveal from={{ scale: 0.3 }} bounce={0.5}>` for more bounces |
| `<JackInTheBox>`               | `<Reveal keyframes={pop({ from: 0.1 })}>`, with no rotation                                                  |
| `<Rotate>`                     | `<Reveal from={{ rotate: -200 }}>`                                                                           |
| `<Roll>`                       | `<Reveal from={{ x: "-100%", rotate: -120 }}>`                                                               |

These have no replacement: exit animations (`reverse`), `Flip`, `Hinge`, `AttentionSeeker`, and the directional `Bounce`, `Zoom` and `Rotate` variants. To keep one, port its keyframes from Animate.css (see below).

## Props

| v4                             | @awesome-reveal/react                                                                                                                                                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cascade` and `damping`        | `stagger`, in milliseconds: `duration * damping`. The v4 defaults give `stagger={500}`.                                                                                                                                |
| `fraction`                     | `threshold`                                                                                                                                                                                                            |
| `triggerOnce`                  | `once`. The default is `true` now. Set `once={false}` where v4 had no `triggerOnce`.                                                                                                                                   |
| `duration` (default `1000`)    | `duration` (default `600`). Set `duration={1000}` to keep the v4 duration.                                                                                                                                             |
| `ease` timing, with no prop    | `easing`, default `cubic-bezier(0.22, 1, 0.36, 1)`. Set `easing="ease"` to keep the v4 motion.                                                                                                                         |
| `className`, `style`           | They apply to the one element that `Reveal` renders. v4 applied them to the `div` of each child. To keep that, put them on each child.                                                                                 |
| `childClassName`, `childStyle` | Style the children directly.                                                                                                                                                                                           |
| `onVisibilityChange`           | `onReveal` for each reveal. To also know when the element hides, use `useReveal` with `once: false`, and its `revealed` value in an effect. v4 called the callback for each child, so use one `Reveal` for each child. |
| Emotion `keyframes`            | `defineKeyframes` or a keyframes array                                                                                                                                                                                 |

## Port an Animate.css animation

Copy the keyframes from the Animate.css source, https://github.com/animate-css/animate.css/tree/main/source, and convert them to a keyframes array:

1. Split grouped selectors such as `from, 20%, 40%` into one keyframe for each offset.
2. Give each keyframe a timing function: its own `animation-timing-function`, or else the `animation-timing-function` of the Animate.css class. The default is `ease`.
3. Merge the keyframes that have the same offset and the same timing function. When two of them set the same property, keep the later value.
4. Remove the keyframes that set only a timing function. Browsers ignore them, so v4 did not show their easing.
5. Sort the keyframes by offset. `element.animate` throws a `TypeError` when an offset is smaller than the offset before it.
6. Write each CSS keyframe as an object, with properties in camelCase.
7. Write `from` as `offset: 0`, `to` as `offset: 1`, and `40%` as `offset: 0.4`.
8. Write the timing function of each keyframe except the last one as `easing`. Web Animations eases a keyframe with no `easing` linearly.

## Behavior changes

- A `<Reveal>` with no `keyframes` now moves up 24px. v4 slid in from the left by 100%. The type check does not find these elements, so search the code for `<Reveal` with no `keyframes`.
- `Reveal` renders one element (`as`, `div` by default) around all its children. v4 rendered one `div` for each child. Check the CSS that targets these wrappers.
- v4 observed each child separately. One observer now watches the whole `Reveal`, and all children reveal together, also children below the fold. Split a long list into several `Reveal` elements, or use `useReveal` for each item.
- Use `stagger` to animate the children one after the other.
- Lists, fragments and text have no special handling. For a list, use `as="ul"` with `stagger`.
- v4 kept the last keyframe applied after the animation. Animations now do not stay applied after they finish, so:
  - A transformed element no longer breaks `position: fixed` children or `z-index`.
  - A style such as `opacity: 1` no longer replaces your own `opacity`. Your CSS `opacity` applies after the reveal. While the element is hidden, `reveal.css` sets `opacity: 0` over your own opacity. Check the elements that have an `opacity` below 1 in your CSS.
