---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations to React components with @awesome-reveal/react. Use when the user wants elements to animate as they enter the viewport, or when editing code that imports @awesome-reveal/react.
---

# Reveal on scroll with @awesome-reveal/react

`@awesome-reveal/react` hides an element until it enters the viewport, then animates it with the Web Animations API. It needs React 18 or later.

## Choose the API

- `Reveal` renders one element and animates it. Use `as` to choose the tag (default `div`). It passes the other props and `ref` to that element.
- `useReveal(options)` animates your own element or component, with no wrapper. It returns `{ ref, style, revealed }`. Attach `ref` to the element, and merge `style` into its style.

```tsx
import { Reveal, useReveal } from "@awesome-reveal/react";
import { fade, slide } from "@awesome-reveal/react/keyframes";

<Reveal as="section" keyframes={slide()} className="hero">
  …
</Reveal>;

function Card() {
  const { ref, style, revealed } = useReveal({ keyframes: fade(), threshold: 0.3 });
  return (
    <article
      ref={ref}
      style={{ ...style, padding: 16 }}
      data-reveal={revealed ? undefined : "hidden"}
    >
      …
    </article>
  );
}
```

## Keyframes

`keyframes` is required. Each factory takes optional options and returns Web Animations keyframes that end at the element's own style.

| Factory   | Effect                                     | Options                                                                                             |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                            |
| `slide()` | Fades in and moves in a direction.         | `direction` (`"up"` default, `"down"`, `"left"`, `"right"`), `distance` (`16`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (`0.95`), `opacity`, `easing`                                                                |
| `blur()`  | Fades in and removes a blur.               | `amount` (`8`), `opacity`, `easing`                                                                 |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                            |

- `direction` is the direction of the movement. `"up"` starts below the resting position.
- A number for a length is in pixels, and a number for `rotate` is in degrees. A string can be any CSS length or angle.
- `opacity` is the start opacity (default `0`). Set it to `1` for movement with no fade.

For a custom animation, use `defineKeyframes` or a keyframes array:

```tsx
import { defineKeyframes, type KeyframesFactory } from "@awesome-reveal/react/keyframes";

// keyframe(t) gets the progress from 0 to 1. At t = 1, return the resting style.
const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
  keyframe: (t) => ({ opacity: t, transform: `rotate(${(1 - t) * turns * 360}deg)` }),
}));

// The last keyframe must be the resting style: the animation does not stay applied.
const drop: KeyframesFactory<{ height?: number }> = ({ height = 40 } = {}) => [
  { opacity: 0, transform: `translateY(${-height}px)`, easing: "ease-out" },
  {},
];
```

## Options

| Option          | Description                                                                        | Default  |
| --------------- | ---------------------------------------------------------------------------------- | -------- |
| `keyframes`     | The animation.                                                                     | –        |
| `duration`      | Duration in milliseconds.                                                          | `600`    |
| `delay`         | Delay in milliseconds.                                                             | `0`      |
| `stagger`       | Animates the element children, each one this many milliseconds after the last one. | –        |
| `threshold`     | Fraction of the element (0 to 1) that must be visible.                             | `0`      |
| `rootMargin`    | Grows or shrinks the viewport area, as a CSS margin.                               | `"0px"`  |
| `once`          | When `false`, the element hides again when it leaves the viewport.                 | `true`   |
| `when`          | Controls the reveal manually. When set, the viewport is not observed.              | –        |
| `reducedMotion` | `"user"` follows `prefers-reduced-motion`. `"always"` skips, `"never"` plays.      | `"user"` |

## Rules

- Do not import the effect components of react-awesome-reveal v4 (`Fade`, `Slide`, `Zoom`). This package does not have them. For v4 code, use the `migrating-from-v4` skill of this package.
- Option changes apply at the next reveal. They do not replay an animation that already played.
- `stagger` animates element children only. Transforms do not apply to inline elements, so give inline children `display: inline-block`.
- Call a `defineKeyframes` factory outside the component when the component renders often. Each call samples the function again.
- The keyframes factories do not import React. You can call them in a Server Component and pass the result to `Reveal`.
- Keep `reducedMotion` at `"user"` unless the user asks for a different behavior. It respects the operating system setting of people whom motion makes ill.
- Prefer `transform` and `opacity`. `filter` (`blur()`) and `clip-path` repaint on each frame in some engines, so use them on small elements.
- Server-rendered content stays hidden (`opacity: 0`) until JavaScript runs. To show it when JavaScript does not run, put this in the document head:

  ```html
  <noscript>
    <style>
      [data-reveal="hidden"] {
        opacity: 1 !important;
      }
    </style>
  </noscript>
  ```

  `Reveal` sets `data-reveal="hidden"` itself. With `useReveal`, set it as in the example above.

- Under a strict Content Security Policy, the inline `opacity: 0` style of the server markup needs `style-src-attr 'unsafe-inline'`.
