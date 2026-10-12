# @awesome-reveal/react

[![Version](https://badgen.net/npm/v/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react)
[![Downloads](https://badgen.net/npm/dt/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react)
[![License](https://badgen.net/npm/license/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react)

> [!TIP]
> If you like this library, please [consider supporting its creator](https://github.com/sponsors/morellodev).

[awesome-reveal](https://awesome-reveal.morello.dev) adds reveal-on-scroll animations to React apps. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

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

- 🪶 **Tiny** – No third-party dependencies. `Reveal` with one keyframes factory adds about 2 kB gzipped to your bundle.
- 🌳 **Tree-shakeable** – Each keyframes factory is a small function. Your bundle includes only the factories that you import.
- 🧩 **Composable** – Use the `Reveal` component, or the `useReveal` hook on your own elements and components.
- ⚙️ **Native APIs** – Intersection Observer detects the reveal. Web Animations run it on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree.
- 💻 **SSR and React Server Components** – Content renders hidden on the server. Keyframes can be created in Server Components.
- 🏷 **TypeScript** – Strict types for options, elements and keyframes.

## Installation

```sh
pnpm add @awesome-reveal/react
```

React 18 or later is necessary.

## Quick start

```jsx
import { Reveal } from "@awesome-reveal/react";

<Reveal>
  <p>I gently appear as I enter the viewport</p>
</Reveal>;
```

With no `keyframes`, the element fades in and moves up, as with `slide()`. To choose another animation, see [Keyframes](#keyframes).

## Entry points

| Import path                       | Contents                                                    |
| --------------------------------- | ----------------------------------------------------------- |
| `@awesome-reveal/react`           | The `Reveal` component and the `useReveal` hook.            |
| `@awesome-reveal/react/keyframes` | The built-in keyframes, `defineKeyframes`, and their types. |

`@awesome-reveal/react/keyframes` does not import React. You can call it in Server Components, or use it with `element.animate()` directly.

## Keyframes

The `keyframes` option takes the keyframes that a factory of `@awesome-reveal/react/keyframes` returns, or a keyframes array:

```jsx
import { enter, slide } from "@awesome-reveal/react/keyframes";

<Reveal keyframes={slide({ direction: "left", distance: 40 })}>…</Reveal>
<Reveal keyframes={enter({ y: 40, scale: 0.9 })}>…</Reveal>
```

The [`@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#keyframes) documents the built-in keyframes, `spring()`, `defineKeyframes` and keyframes arrays.

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

`useReveal` animates your own element or component, with no wrapper. Spread `getProps(yourProps)` on the element. It merges your `ref` and `style` with the reveal, sets `data-reveal` and hides the element until it is revealed:

```jsx
import { useReveal } from "@awesome-reveal/react";
import { slide } from "@awesome-reveal/react/keyframes";

function Card() {
  const { getProps, revealed } = useReveal({ keyframes: slide() });

  return <article {...getProps({ className: "card" })}>{revealed ? "Hello!" : null}</article>;
}
```

While the element is hidden, `opacity: 0` comes after your `style`. After the reveal, your opacity comes back. Write your own `style` and `ref` inside `getProps`. A `style` that you write after the spread replaces the hidden style. To use `getProps` on a component, forward its `ref` to an element (React 18 needs `forwardRef`). With React 18 types, type the props as `ComponentPropsWithoutRef`, because `ComponentProps` allows string refs.

Use `revealed` to run code when the element is revealed, for example in a `useEffect`. The animation starts in the same task as the reveal, before React renders the change of `revealed`. With `stagger`, render the children of the element all the time. Children that you render only when `revealed` is true do not animate.

Option changes apply to the next reveal. They do not replay an animation that already played.

## Options

`Reveal` and `useReveal` accept the [options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#options), such as `keyframes`, `duration`, `stagger`, `once` and `when`.

## Recipes

### Lists

```jsx
<Reveal as="ul" keyframes={slide()} stagger={80}>
  <li>I enter first...</li>
  <li>...then comes my turn...</li>
  <li>...and finally you see me!</li>
</Reveal>
```

`stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. With an inline `as` tag, `Reveal` itself also needs `display: inline-block`, or it only fades.

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

The [Accessibility section of the `@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#accessibility) describes reduced motion, content without JavaScript and Content Security Policy. For the `<noscript>` CSS, Hidden elements have `data-reveal="hidden"`, from `Reveal` and from `getProps`.

## Browser support

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later. Read [Browser support](https://www.npmjs.com/package/@awesome-reveal/core#browser-support) for the fallbacks.

## Migrating from v4

### Install

1. Replace `react-awesome-reveal` with `@awesome-reveal/react`. You can also upgrade `react-awesome-reveal` to 5, which re-exports this package.
2. Remove `@emotion/react`, unless your app uses it.
3. Upgrade to React 18 or later.

### Components

This package has no effect components. Use `Reveal` with a keyframes factory. v4 `direction` named the side where the element started, but `slide` `direction` names the direction of the movement.

| v4                             | @awesome-reveal/react                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `import Reveal from "…"`       | `import { Reveal } from "…"`                                                                          |
| `<Reveal>` with no `keyframes` | `<Reveal keyframes={slide({ direction: "right", distance: "100%" })}>`. The default is now `slide()`. |
| `<Fade>`                       | `fade()`                                                                                              |
| `<Fade direction="up">`        | `slide()`, or `slide({ distance: "100%" })` for the v4 distance                                       |
| `<Fade direction="down">`      | `slide({ direction: "down" })`                                                                        |
| `<Fade direction="left">`      | `slide({ direction: "right" })`                                                                       |
| `<Fade direction="right">`     | `slide({ direction: "left" })`                                                                        |
| `<Fade direction="left" big>`  | `slide({ direction: "right", distance: 2000 })`                                                       |
| `<Fade direction="top-left">`  | `enter({ x: "-100%", y: "-100%" })`                                                                   |
| `<Slide>`                      | `slide({ direction: "right", distance: "100%", opacity: 1 })`                                         |
| `<Slide direction="up">`       | `slide({ distance: "100%", opacity: 1 })`                                                             |
| `<Zoom>`                       | `scale({ from: 0.3 })`, a close match                                                                 |
| `<Bounce>`                     | `pop({ from: 0.3 })`, or `scale({ from: 0.3, easing: spring({ bounce: 0.5 }) })` for more bounces     |
| `<JackInTheBox>`               | `pop({ from: 0.1 })`, with no rotation                                                                |
| `<Rotate>`                     | `enter({ rotate: -200 })`                                                                             |
| `<Roll>`                       | `enter({ x: "-100%", rotate: -120 })`                                                                 |

These are removed:

- exit animations (`reverse`)
- `Flip`, `Hinge` and `AttentionSeeker`
- the directional `Bounce`, `Zoom` and `Rotate` variants

To keep one, port its keyframes from Animate.css (see [Port an Animate.css animation](#port-an-animatecss-animation)).

### Props

| v4                             | @awesome-reveal/react                                                                                                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cascade` and `damping`        | `stagger`, in milliseconds. `cascade damping={d}` becomes `stagger={duration * d}`. The v4 `damping` default was `0.5`, so `cascade` becomes `stagger={500}` with the v4 duration. |
| `fraction`                     | `threshold`                                                                                                                                                                        |
| `triggerOnce`                  | `once`. The default is now `true`. Set `once={false}` for the v4 default.                                                                                                          |
| `duration` default `1000`      | Default `600`                                                                                                                                                                      |
| `childClassName`, `childStyle` | Style the children directly.                                                                                                                                                       |
| `onVisibilityChange`           | `useReveal` and its `revealed` value                                                                                                                                               |
| Emotion `keyframes`            | `defineKeyframes` or a keyframes array (see [Keyframes](https://www.npmjs.com/package/@awesome-reveal/core#keyframes))                                                             |

### Port an Animate.css animation

Copy the keyframes from the [Animate.css source](https://github.com/animate-css/animate.css/tree/main/source) and convert them:

1. Split grouped selectors such as `from, 20%, 40%` into one keyframe for each offset.
2. Write each CSS keyframe as an object, with properties in camelCase.
3. Write `from` as `offset: 0`, `to` as `offset: 1`, and `40%` as `offset: 0.4`.
4. Write `animation-timing-function` as `easing`.
5. Add `easing: "ease"` to each other keyframe except the last one. CSS eases these segments with `ease`, but Web Animations eases them linearly.

### Behavior

- A `<Reveal>` with no `keyframes` now plays `slide()`: it moves up 24px. v4 slid in from the left by 100%. The type check does not find these elements, so search the code for `<Reveal` with no `keyframes`.
- `Reveal` renders one element (`as`, `div` by default) around all its children. v4 rendered one `div` for each child.
- Children animate together. Use `stagger` to animate them one after the other.
- Lists, fragments and text have no special handling. For lists, use `as="ul"` with `stagger`. For text, see [Text, one character at a time](#text-one-character-at-a-time).
- Animations do not stay applied after they finish, so a transformed element no longer breaks `position: fixed` children or `z-index`.

## Past releases

The v4 documentation is in the [README of `react-awesome-reveal@4.3.1`](https://github.com/awesome-reveal/awesome-reveal/blob/react-awesome-reveal%404.3.1/README.md).

## License

MIT
