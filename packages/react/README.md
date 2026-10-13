# @awesome-reveal/react

[![npm version](https://badgen.net/npm/v/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react)
[![npm downloads](https://badgen.net/npm/dt/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react)
[![Types](https://badgen.net/npm/types/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react)
[![License](https://badgen.net/npm/license/@awesome-reveal/react)](https://www.npmjs.com/package/@awesome-reveal/react)

[awesome-reveal](https://awesome-reveal.dev) adds reveal-on-scroll animations to React apps. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

<p align="center"><img src="https://raw.githubusercontent.com/awesome-reveal/awesome-reveal/next/.github/assets/demo.gif" alt="Elements fade, slide, scale and blur in as the page scrolls" width="640"></p>

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Entry points](#entry-points)
- [Entrance](#entrance)
- [Keyframes](#keyframes)
- [The `Reveal` component](#the-reveal-component)
- [The `useReveal` hook](#the-usereveal-hook)
- [Options](#options)
- [Recipes](#recipes)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Migrating from v4](#migrating-from-v4)
- [Past releases](#past-releases)
- [Agent skills](#agent-skills)
- [Support](#support)
- [License](#license)

## Features

- 🪶 **Tiny** – No third-party dependencies. `Reveal` adds about 2.4 kB gzipped to your bundle.
- 🌳 **Tree-shakeable** – Each keyframes factory is a small function. Your bundle includes only the factories that you import.
- 🔒 **CSP-ready** – A stylesheet hides the content. The library writes no inline style.
- 🧩 **Composable** – Use the `Reveal` component, or the `useReveal` hook on your own elements and components.
- ⚙️ **Native APIs** – Intersection Observer detects the reveal. Web Animations run it on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree.
- 💻 **SSR and React Server Components** – Content renders hidden on the server. Keyframes can be created in Server Components.
- 🏷 **TypeScript** – Strict types for options, elements and keyframes.

## Installation

```sh
npm install @awesome-reveal/react
```

Use `pnpm add`, `yarn add` or `bun add` in the same way.

React 18 or 19 is necessary. TypeScript needs `moduleResolution` set to `bundler`, `node16` or `nodenext`, because the package uses `exports` for its entry points.

Import `reveal.css` once, in the root of your app, such as the root layout of Next.js. It hides the elements until the reveal. Without it, the elements show before the reveal, and the library reports an error:

```js
import "@awesome-reveal/react/reveal.css";
```

## Quick start

```tsx
import { Reveal } from "@awesome-reveal/react";

<Reveal>
  <p>I gently appear as I enter the viewport</p>
</Reveal>;

<Reveal from="left">
  <p>I come from the left</p>
</Reveal>;
```

With no options, the element fades in and moves up. To change the entrance, see [Entrance](#entrance).

## Entry points

| Import path                        | Contents                                                         |
| ---------------------------------- | ---------------------------------------------------------------- |
| `@awesome-reveal/react`            | The `Reveal` component, the `useReveal` hook and the keyframes.  |
| `@awesome-reveal/react/keyframes`  | Only the built-in keyframes, `defineKeyframes`, and their types. |
| `@awesome-reveal/react/reveal.css` | The stylesheet that hides the elements until the reveal.         |

The keyframes do not touch the DOM. You can create them in Server Components, or use them with `element.animate()` directly.

`Reveal` has the `"use client"` directive, so a Server Component can render it. `useReveal` needs a Client Component. Props that cross from a Server Component must be serializable: the keyframes are, but a function, such as a callback `ref` or `onReveal`, is not. CI builds and runs a Next.js App Router app with Next 14 (React 18), 15 and 16.

In a Server Component, prefer `easing="spring"` or `bounce` to `spring()`. They resolve in the browser. `spring()` that runs on the server cannot check for `linear()` support, so a browser without it shows the element with no animation.

## Entrance

The `from`, `distance`, `easing` and `bounce` props set the entrance:

```tsx
import { Reveal } from "@awesome-reveal/react";

<Reveal from="left" distance={40}>
  …
</Reveal>;
<Reveal from={{ scale: 0.9, blur: 8 }} bounce={0.4}>
  …
</Reveal>;
```

`from` is a side (`"top"`, `"bottom"`, `"left"` or `"right"`) or a start state. The [Entrance options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#entrance) describe them.

## Keyframes

For an animation that the entrance props cannot give, set `keyframes`. It takes the keyframes that a factory returns, or a keyframes array:

```tsx
import { Reveal, enter, slide } from "@awesome-reveal/react";

<Reveal keyframes={slide({ from: "left", distance: 40 })}>…</Reveal>;
<Reveal keyframes={enter({ y: 40, rotate: -5 })}>…</Reveal>;
```

The [`@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#keyframes) documents the built-in keyframes, `spring()`, `defineKeyframes` and keyframes arrays.

## The `Reveal` component

`Reveal` renders one element around its children. Use `as` to choose the tag. Other props go to that element, and so does `ref`:

```tsx
import { useRef } from "react";
import { Reveal, fade } from "@awesome-reveal/react";

function Page() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Reveal as="section" className="hero" id="intro">
        …
      </Reveal>
      <Reveal as="input" keyframes={fade()} ref={inputRef} />
    </>
  );
}
```

## The `useReveal` hook

`useReveal` animates your own element or component, with no wrapper. Spread `getProps(yourProps)` on the element. It merges your `ref` with the reveal, and sets `data-reveal="hidden"` until the element is revealed:

```tsx
import { useReveal } from "@awesome-reveal/react";

function Card() {
  const { getProps, revealed } = useReveal({ from: { scale: 0.95 }, threshold: 0.3 });

  return (
    <article {...getProps({ className: "card" })} style={{ opacity: 0.9 }}>
      {revealed ? "Hello!" : null}
    </article>
  );
}
```

Write your `ref` inside `getProps`. Your `style` can go inside or after the spread: `reveal.css` hides the element, and your `opacity` applies after the reveal. To use `getProps` on a component, forward its `ref` to an element (React 18 needs `forwardRef`). With React 18 types, type the props as `ComponentPropsWithoutRef`, because `ComponentProps` allows string refs.

To run code at each reveal, pass `onReveal`. It gets the element, in the task that starts the animation. In development, React StrictMode mounts each component two times, but `onReveal` runs once for each reveal.

Use `revealed` to render from the state of the reveal. The animation starts in the same task as the reveal, before React renders the change of `revealed`. With `stagger`, render the children of the element all the time. Children that you render only when `revealed` is true do not animate.

A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal, and do not replay an animation that already played.

## Options

`Reveal` and `useReveal` accept the [options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#options), such as `from`, `duration`, `stagger`, `once`, `when` and `onReveal`.

With `when` set to `true`, the server renders the element hidden, and the entrance plays after hydration.

## Recipes

### Lists

```tsx
import { Reveal } from "@awesome-reveal/react";

<Reveal as="ul" stagger={80}>
  <li>I enter first...</li>
  <li>...then comes my turn...</li>
  <li>...and finally you see me!</li>
</Reveal>;
```

`stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. With an inline `as` tag, `Reveal` itself also needs `display: inline-block`, or it only fades.

### Text, one character at a time

```tsx
import { Reveal, fade } from "@awesome-reveal/react";

function Title({ text }: { text: string }) {
  return (
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
  );
}
```

`visually-hidden` is your class that hides content visually but keeps it for screen readers. Screen readers read the full text once, and skip the animated characters.

### Wipes

`clip-path` paints on the main thread in most engines, so use it on small elements:

```tsx
import { Reveal } from "@awesome-reveal/react";

<Reveal
  keyframes={[{ clipPath: "inset(0 100% 0 0)", easing: "ease-out" }, { clipPath: "inset(0)" }]}
>
  …
</Reveal>;
```

### App-wide defaults

Wrap `Reveal` in your own component. The wrapper renders a `div`. Props that you pass override the defaults:

```tsx
import { Reveal, type RevealProps } from "@awesome-reveal/react";

export function FromLeft(props: RevealProps) {
  return <Reveal from="left" distance={40} duration={800} {...props} />;
}
```

### Reveal inside the viewport

`rootMargin: "-100px"` reveals the element after it is 100px inside the viewport. Read the warning about negative margins in [Trigger](https://www.npmjs.com/package/@awesome-reveal/core#trigger).

## Accessibility

The [Accessibility section of the `@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#accessibility) describes reduced motion, focus, the stylesheet and Content Security Policy. `Reveal` and `getProps` set `data-reveal="hidden"` on hidden elements. The attribute is reserved.

The server markup hides the content until the script runs. `reveal.css` shows it when JavaScript is off and in print. If the script fails or a blocker stops it, the content stays hidden. The [recovery recipe](https://www.npmjs.com/package/@awesome-reveal/core#recover-when-the-script-fails) shows it again after a timeout. Put its script in the document head, for example in the root layout of Next.js. The library sets the `data-reveal-ready` attribute of the recipe when the first element mounts or hydrates. The attribute does not cover a part of the page that loads later and fails, such as a lazy component.

## Browser support

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later. Read [Browser support](https://www.npmjs.com/package/@awesome-reveal/core#browser-support) for the fallbacks.

## Migrating from v4

### Install

1. Replace `react-awesome-reveal` with `@awesome-reveal/react`. You can also upgrade `react-awesome-reveal` to 5, which re-exports this package.
2. Remove `@emotion/react`, unless your app uses it.
3. Upgrade to React 18 or 19.
4. Import `@awesome-reveal/react/reveal.css` once, in the root of your app. With `react-awesome-reveal` 5, import `react-awesome-reveal/reveal.css`.

### Components

This package has no effect components. Use `Reveal` with the entrance props or a keyframes factory. `from` names the side where the element starts. In v4, `left` and `right` name that side too, but `up` and `down` name the movement. So `up` becomes `from="bottom"`, and `down` becomes `from="top"`.

| v4                             | @awesome-reveal/react                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `import Reveal from "…"`       | `import { Reveal } from "@awesome-reveal/react"`                                                             |
| `<Reveal>` with no `keyframes` | `<Reveal from="left" distance="100%">`. The default now moves up 24px.                                       |
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
| `onVisibilityChange`           | `onReveal` for each reveal, or `useReveal` and its `revealed` value                                                                                                                |
| Emotion `keyframes`            | `defineKeyframes` or a keyframes array (see [Keyframes](https://www.npmjs.com/package/@awesome-reveal/core#keyframes))                                                             |

### Port an Animate.css animation

Copy the keyframes from the [Animate.css source](https://github.com/animate-css/animate.css/tree/main/source) and convert them:

1. Split grouped selectors such as `from, 20%, 40%` into one keyframe for each offset.
2. Write each CSS keyframe as an object, with properties in camelCase.
3. Write `from` as `offset: 0`, `to` as `offset: 1`, and `40%` as `offset: 0.4`.
4. Write `animation-timing-function` as `easing`.
5. Add `easing: "ease"` to each other keyframe except the last one. CSS eases these segments with `ease`, but Web Animations eases them linearly.

### Behavior

- A `<Reveal>` with no `keyframes` now moves up 24px. v4 slid in from the left by 100%. The type check does not find these elements, so search the code for `<Reveal` with no `keyframes`.
- `Reveal` renders one element (`as`, `div` by default) around all its children. v4 rendered one `div` for each child.
- Children animate together. Use `stagger` to animate them one after the other.
- Lists, fragments and text have no special handling. For lists, use `as="ul"` with `stagger`. For text, see [Text, one character at a time](#text-one-character-at-a-time).
- v4 kept the last keyframe applied after the animation. Animations now do not stay applied after they finish, so:
  - A transformed element no longer breaks `position: fixed` children or `z-index`.
  - A style such as `opacity: 1` no longer replaces your own `opacity`. Your CSS `opacity` applies after the reveal. While the element is hidden, `reveal.css` sets `opacity: 0` over your own opacity.

## Past releases

The v4 documentation is in the [README of `react-awesome-reveal@4.3.1`](https://github.com/awesome-reveal/awesome-reveal/blob/react-awesome-reveal%404.3.1/README.md).

## Agent skills

This package ships the `adding-reveal-animations` agent skill, which helps a coding agent add reveal animations to your project. pnpm 12.11 or later links it into your agent folders after you run `pnpm approve`.

## Support

- Report a bug in the [issue tracker](https://github.com/awesome-reveal/awesome-reveal/issues).
- Ask a question or suggest a feature in [Discussions](https://github.com/awesome-reveal/awesome-reveal/discussions).
- Read the [changelog](https://github.com/awesome-reveal/awesome-reveal/blob/next/packages/react/CHANGELOG.md) for the changes of each release.
- If you like this library, [consider supporting its creator](https://github.com/sponsors/morellodev).

## License

MIT
