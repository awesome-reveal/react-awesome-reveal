# React Awesome Reveal

[![Version](https://badgen.net/npm/v/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal/v/latest)
[![Last Commit](https://badgen.net/github/last-commit/awesome-reveal/react-awesome-reveal/main)](https://github.com/awesome-reveal/react-awesome-reveal/commit)
[![Downloads](https://badgen.net/npm/dt/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal/v/latest)
[![Size](https://badgen.net/bundlephobia/minzip/react-awesome-reveal)](https://bundlephobia.com/result?p=react-awesome-reveal@latest)
[![License](https://badgen.net/npm/license/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal/v/latest)

> [!TIP]
> If you like this library, please [consider supporting its creator](https://github.com/sponsors/morellodev).

[React Awesome Reveal](https://react-awesome-reveal.morello.dev) adds reveal-on-scroll animations to React apps. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Entry points](#entry-points)
- [Keyframes](#keyframes)
- [The `Reveal` component](#the-reveal-component)
- [The `useReveal` hook](#the-usereveal-hook)
- [Options](#options)
- [Recipes](#recipes)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Migrating from v4](#migrating-from-v4)
- [Past releases](#past-releases)
- [License](#license)

## Features

- 🪶 **Tiny** – No dependencies. `Reveal` with one keyframes factory adds about 1.5 kB gzipped to your bundle.
- 🌳 **Tree-shakeable** – Each keyframes factory is a small function. Your bundle includes only the factories that you import.
- 🧩 **Composable** – Use the `Reveal` component, or the `useReveal` hook on your own elements and components.
- ⚙️ **Native APIs** – Intersection Observer detects the reveal. Web Animations run it on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree.
- 💻 **SSR and React Server Components** – Content renders hidden on the server. Keyframes can be created in Server Components.
- 🏷 **TypeScript** – Strict types for options, elements and keyframes.

## Installation

```sh
pnpm add react-awesome-reveal
```

React 18 or later is necessary.

## Quick start

```jsx
import { Reveal } from "react-awesome-reveal";
import { slide } from "react-awesome-reveal/keyframes";

<Reveal keyframes={slide()}>
  <p>I gently appear as I enter the viewport</p>
</Reveal>;
```

## Entry points

| Import path                      | Contents                                                    |
| -------------------------------- | ----------------------------------------------------------- |
| `react-awesome-reveal`           | The `Reveal` component and the `useReveal` hook.            |
| `react-awesome-reveal/keyframes` | The built-in keyframes, `defineKeyframes`, and their types. |

`react-awesome-reveal/keyframes` does not import React. You can call it in Server Components, or use it with `element.animate()` directly.

## Keyframes

Each keyframes factory is a function. It takes its options, which you can leave out, and returns new [Web Animations keyframes](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats). The animation ends at the element's own style.

```jsx
<Reveal keyframes={slide()} />
<Reveal keyframes={slide({ direction: "left", distance: 40 })} />
```

### Built-in keyframes

| Factory   | Effect                                     | Options                                                                                                               |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                                              |
| `slide()` | Fades in and moves in a direction.         | `direction` (`"up"`, `"down"`, `"left"` or `"right"`, default `"up"`), `distance` (default `16`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (default `0.95`), `opacity`, `easing`                                                                          |
| `blur()`  | Fades in and removes a blur.               | `amount` (default `8`), `opacity`, `easing`                                                                           |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                                              |

- `direction` is the direction in which the element moves. `"up"` starts below the resting position.
- A number for `distance`, `amount`, `x`, `y` or `blur` is in pixels. A number for `rotate` is in degrees. A string can be any CSS length or angle.
- `opacity` is the start opacity. It is `0` by default. Set it to `1` for movement with no fade.
- The default `easing` is `"cubic-bezier(0.22, 1, 0.36, 1)"`. An easing with values out of the 0–1 range overshoots: `scale({ from: 0.5, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" })`.
- `blur()` animates `filter`. Chromium and Safari composite it, but other engines repaint it on each frame. Use it on small and medium elements.

```jsx
import { enter } from "react-awesome-reveal/keyframes";

<Reveal keyframes={enter({ y: 40, scale: 0.9 })}>…</Reveal>       // rise and grow
<Reveal keyframes={enter({ x: "-100%", rotate: -120 })}>…</Reveal> // roll in from the left
```

### Custom keyframes with `defineKeyframes`

`defineKeyframes` builds keyframes from a function of the animation progress. You return a `keyframe(t, u)` function, where `t` is the progress from 0 to 1 and `u` is `1 - t`. The library samples the function into keyframes:

```jsx
import { defineKeyframes } from "react-awesome-reveal/keyframes";

const spin = defineKeyframes(({ turns = 1 }) => ({
  keyframe: (t, u) => ({ opacity: t, transform: `rotate(${u * turns * 360}deg)` }),
  easing: (t) => 1 - (1 - t) ** 3, // optional, any JavaScript easing function
  steps: 30, // optional, the number of samples
}));

<Reveal keyframes={spin({ turns: 2 })}>…</Reveal>;
```

At `t = 1`, return the element's resting style. In TypeScript, give the options type: `defineKeyframes<{ turns?: number }>(…)`. Your function gets the options as given, so give defaults for all of them.

Each call samples the function again. In a component that renders often, call the factory once outside the component, for example `const spinTwice = spin({ turns: 2 })`.

### Keyframes arrays

You can also pass a keyframes array directly. Make sure that the last keyframe is the element's resting style, because the animation does not stay applied after it finishes:

```jsx
<Reveal
  keyframes={[
    { opacity: 0, transform: "translate(-200px, -100px)", easing: "ease-out" },
    { opacity: 1, transform: "none" },
  ]}
>
  …
</Reveal>
```

Web Animations eases each keyframe linearly by default. Set `easing` on a keyframe to change the easing up to the next keyframe.

To write a reusable factory with options, type it with `KeyframesFactory`:

```ts
import type { KeyframesFactory } from "react-awesome-reveal/keyframes";

export const drop: KeyframesFactory<{ height?: number }> = ({ height = 40 } = {}) => [
  { opacity: 0, transform: `translateY(${-height}px)`, easing: "ease-out" },
  {},
];
```

## The `Reveal` component

`Reveal` renders one element around its children. Use `as` to choose the tag. Other props go to that element, and so does `ref`:

```jsx
const inputRef = useRef(null);

<Reveal as="section" keyframes={slide()} className="hero" id="intro">
  …
</Reveal>;
<Reveal as="input" keyframes={fade()} ref={inputRef} />;
```

## The `useReveal` hook

`useReveal` animates your own element or component, with no wrapper. Attach `ref` to the element, and merge `style` into its style to hide it until it is revealed:

```jsx
import { useReveal } from "react-awesome-reveal";
import { slide } from "react-awesome-reveal/keyframes";

function Card() {
  const { ref, style, revealed } = useReveal({ keyframes: slide() });

  return (
    <article ref={ref} style={style}>
      {revealed ? "Hello!" : null}
    </article>
  );
}
```

Use `revealed` to run code when the element is revealed, for example in a `useEffect`.

Option changes apply to the next reveal. They do not replay an animation that already played.

## Options

`Reveal` and `useReveal` accept the same options:

| Option          | Description                                                                                                               | Default  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| `keyframes`     | The animation. Required.                                                                                                  | –        |
| `duration`      | Animation duration, in milliseconds.                                                                                      | `600`    |
| `delay`         | Delay before the animation starts, in milliseconds.                                                                       | `0`      |
| `stagger`       | Animates the element children instead of the element, each one this many milliseconds after the previous one.             | –        |
| `threshold`     | Fraction of the element, between 0 and 1, that must be visible to reveal it.                                              | `0`      |
| `rootMargin`    | Grows or shrinks the viewport area that reveals the element, as a CSS margin in `px` or `%`.                              | `"0px"`  |
| `once`          | Reveals the element only the first time. When `false`, the element hides again when it leaves the viewport.               | `true`   |
| `when`          | Controls the reveal manually. When set, the viewport is not observed.                                                     | –        |
| `reducedMotion` | `"user"` skips the animation when the user prefers reduced motion. `"always"` always skips it. `"never"` always plays it. | `"user"` |

## Recipes

### Lists

```jsx
<Reveal as="ul" keyframes={slide()} stagger={80}>
  <li>I enter first...</li>
  <li>...then comes my turn...</li>
  <li>...and finally you see me!</li>
</Reveal>
```

`stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`.

### Text, one character at a time

```jsx
<p>
  <span className="visually-hidden">{text}</span>
  <Reveal as="span" keyframes={fade()} stagger={30} aria-hidden>
    {[...text].map((char, index) => (
      <span key={index} style={{ display: "inline-block", whiteSpace: "pre" }}>
        {char}
      </span>
    ))}
  </Reveal>
</p>
```

`visually-hidden` is your class that hides content visually but keeps it for screen readers. Screen readers read the full text once, and skip the animated characters.

### Wipes

`clip-path` paints on the main thread in most engines, so use it on small elements:

```jsx
<Reveal
  keyframes={[{ clipPath: "inset(0 100% 0 0)", easing: "ease-out" }, { clipPath: "inset(0)" }]}
>
  …
</Reveal>
```

## Accessibility

- When the user prefers reduced motion, the element appears with no animation. Use `reducedMotion` to change this.
- Hidden content uses `opacity: 0` only. It stays in the accessibility tree and in the browser's find-in-page.
- If JavaScript does not run, content rendered on the server stays hidden. To show it, put this CSS in a `<noscript>` element in the document head:

  ```css
  [data-reveal="hidden"] {
    opacity: 1 !important;
  }
  ```

  `Reveal` sets `data-reveal="hidden"` on hidden elements. With `useReveal`, add the attribute yourself.

- The library injects no `<style>` elements. Under a strict Content Security Policy, the inline `opacity: 0` style that the server renders needs `style-src-attr 'unsafe-inline'`.

## Browser support

Chrome 84, Firefox 75 and Safari 13.1, or later. These versions support the Web Animations API with implicit keyframes. MDN reports that the implicit keyframes of Safari 13.1 to 15 have bugs. If you support these versions, give each keyframe of your custom keyframes explicit values.

Without `IntersectionObserver`, elements are revealed immediately. Without `Element.animate`, elements appear with no animation.

## Migrating from v4

### Install

1. Remove `@emotion/react`, unless your app uses it.
2. Upgrade to React 18 or later.

### Components

v5 has no effect components. Use `Reveal` with a keyframes factory. v4 `direction` named the side where the element started, but v5 `slide` `direction` names the direction of the movement.

| v4                             | v5                                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `import Reveal from "…"`       | `import { Reveal } from "…"`                                                                         |
| `<Reveal>` with no `keyframes` | `<Reveal keyframes={slide({ direction: "right", distance: "100%" })}>`. `keyframes` is now required. |
| `<Fade>`                       | `fade()`                                                                                             |
| `<Fade direction="up">`        | `slide()`, or `slide({ distance: "100%" })` for the v4 distance                                      |
| `<Fade direction="down">`      | `slide({ direction: "down" })`                                                                       |
| `<Fade direction="left">`      | `slide({ direction: "right" })`                                                                      |
| `<Fade direction="right">`     | `slide({ direction: "left" })`                                                                       |
| `<Fade direction="left" big>`  | `slide({ direction: "right", distance: 2000 })`                                                      |
| `<Fade direction="top-left">`  | `enter({ x: "-100%", y: "-100%" })`                                                                  |
| `<Slide>`                      | `slide({ direction: "right", distance: "100%", opacity: 1 })`                                        |
| `<Slide direction="up">`       | `slide({ distance: "100%", opacity: 1 })`                                                            |
| `<Zoom>`                       | `scale({ from: 0.3 })`, a close match                                                                |
| `<Bounce>`                     | `scale({ from: 0.3, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" })`, a close match                   |
| `<Rotate>`                     | `enter({ rotate: -200 })`                                                                            |
| `<Roll>`                       | `enter({ x: "-100%", rotate: -120 })`                                                                |

These are removed:

- exit animations (`reverse`)
- `Flip`, `JackInTheBox`, `Hinge` and `AttentionSeeker`
- the directional `Bounce`, `Zoom` and `Rotate` variants

To keep one, port its keyframes from Animate.css (see [Port an Animate.css animation](#port-an-animatecss-animation)).

### Props

| v4                             | v5                                                                                                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cascade` and `damping`        | `stagger`, in milliseconds. `cascade damping={d}` becomes `stagger={duration * d}`. The v4 `damping` default was `0.5`, so `cascade` becomes `stagger={500}` with the v4 duration. |
| `fraction`                     | `threshold`                                                                                                                                                                        |
| `triggerOnce`                  | `once`. The default is now `true`. Set `once={false}` for the v4 default.                                                                                                          |
| `duration` default `1000`      | Default `600`                                                                                                                                                                      |
| `childClassName`, `childStyle` | Style the children directly.                                                                                                                                                       |
| `onVisibilityChange`           | `useReveal` and its `revealed` value                                                                                                                                               |
| Emotion `keyframes`            | `defineKeyframes` or a keyframes array (see [Keyframes](#keyframes))                                                                                                               |

### Port an Animate.css animation

Copy the keyframes from the [Animate.css source](https://github.com/animate-css/animate.css/tree/main/source) and convert them:

1. Split grouped selectors such as `from, 20%, 40%` into one keyframe for each offset.
2. Write each CSS keyframe as an object, with properties in camelCase.
3. Write `from` as `offset: 0`, `to` as `offset: 1`, and `40%` as `offset: 0.4`.
4. Write `animation-timing-function` as `easing`.
5. Add `easing: "ease"` to each other keyframe except the last one. CSS eases these segments with `ease`, but Web Animations eases them linearly.

### Behavior

- `Reveal` renders one element (`as`, `div` by default) around all its children. v4 rendered one `div` for each child.
- Children animate together. Use `stagger` to animate them one after the other.
- Lists, fragments and text have no special handling. For lists, use `as="ul"` with `stagger`. For text, see [Text, one character at a time](#text-one-character-at-a-time).
- Animations do not stay applied after they finish, so a transformed element no longer breaks `position: fixed` children or `z-index`.

## Past releases

To see the documentation for a previous version, open its tag in the GitHub repository and read the README of that version.

## License

Project source code is licensed under the MIT license. You are free to fork this repository, edit the code, share and use it both for non-commercial and commercial purposes.
