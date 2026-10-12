# @awesome-reveal/core

[![npm version](https://badgen.net/npm/v/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![npm downloads](https://badgen.net/npm/dt/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![Types](https://badgen.net/npm/types/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![License](https://badgen.net/npm/license/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)

The framework-independent core of [awesome-reveal](https://awesome-reveal.morello.dev). It reveals elements when they enter the viewport. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect the reveal, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

The framework adapters use this package. If your app uses one of these frameworks, install its adapter instead:

| Framework | Package                                                                        |
| --------- | ------------------------------------------------------------------------------ |
| Astro     | [`@awesome-reveal/astro`](https://www.npmjs.com/package/@awesome-reveal/astro) |
| React     | [`@awesome-reveal/react`](https://www.npmjs.com/package/@awesome-reveal/react) |
| Vue       | [`@awesome-reveal/vue`](https://www.npmjs.com/package/@awesome-reveal/vue)     |

Use this package directly with plain DOM code, or to write an adapter for another framework. This README also documents the keyframes, the options, accessibility and browser support for all the adapters.

<p align="center"><img src="https://raw.githubusercontent.com/awesome-reveal/awesome-reveal/next/.github/assets/demo.gif" alt="Elements fade, slide, scale and blur in as the page scrolls" width="640"></p>

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Entry points](#entry-points)
- [API](#api)
- [Keyframes](#keyframes)
- [Options](#options)
- [Recipes](#recipes)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Agent skills](#agent-skills)
- [Support](#support)
- [License](#license)

## Features

- 🪶 **Tiny** – No third-party dependencies. Your bundle includes only the keyframes factories that you import.
- 🌳 **Tree-shakeable** – The package is ESM-only, with `"sideEffects": false` and one file for each module.
- ⚙️ **Native APIs** – Intersection Observer detects the reveal. Web Animations run it on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree.
- 🧱 **Framework-independent** – Use it with plain DOM code, or build an adapter on `createReveal`.
- 🏷 **TypeScript** – Strict types for the options, the controller and the keyframes.

## Installation

```sh
npm install @awesome-reveal/core
```

Use `pnpm add`, `yarn add` or `bun add` in the same way. The package is ESM-only. Load it with a bundler, such as Vite, or in a `<script type="module">`. TypeScript needs `moduleResolution` set to `bundler`, `node16` or `nodenext`, because the package uses `exports` for `/keyframes`.

## Quick start

```js
import { reveal } from "@awesome-reveal/core";
import { slide } from "@awesome-reveal/core/keyframes";

const controller = reveal(document.querySelector(".hero"), {
  keyframes: slide({ direction: "left" }),
  duration: 800,
});

// Later, for example when the element leaves the page:
controller.destroy();
```

## Entry points

| Import path                      | Contents                                                       |
| -------------------------------- | -------------------------------------------------------------- |
| `@awesome-reveal/core`           | `reveal`, `createReveal`, `observe`, `play` and `hiddenStyle`. |
| `@awesome-reveal/core/keyframes` | The built-in keyframes, `defineKeyframes`, and their types.    |

The keyframes do not touch the DOM, so you can create them on the server. Each adapter re-exports this entry point, for example as `@awesome-reveal/react/keyframes`.

## API

### `reveal(element, options?)`

Hides the element, and plays the keyframes when the element enters the viewport. It returns a controller:

- `revealed`: `true` while the element is revealed.
- `setOptions(options)`: replaces the options. A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal. After code writes the inline `opacity` of a hidden element, the element shows until the reveal. Call it to hide the element again.
- `destroy()`: stops the observation, cancels the animation and restores the element.

While the element is hidden, it has an inline `opacity: 0` and `data-reveal="hidden"`. The reveal removes both, and restores the inline `opacity` that the element had, with its priority. An inline `opacity` of `0` counts as no opacity. If the browser rejects an option, the element shows at once and stays shown, also when you correct the option later. The library reports the error once from a microtask, so it reaches `window.onerror` and does not throw in your code.

### `createReveal(options?)`

The state that `reveal` uses, for adapters and for code that sets the style itself. It does not change the DOM. It observes the element, plays the animation and tells you when to hide or show the element:

- `revealed`: `true` while the element is revealed. Before `attach`, it is `true` only when `when` is `true`.
- `subscribe(listener)`: calls `listener(revealed)` when `revealed` changes. Hide or show the element in it. There is one listener, and a new call replaces it. It returns a function that removes the listener.
- `attach(element)`: observes and animates the element. A new element keeps the state and does not play the animation again. `attach(null)` stops the observation and cancels the animation.
- `setOptions(options)`: replaces the options, as for `reveal`.

### `observe(element, options, onChange)`

Calls `onChange(true)` when the element enters the viewport. When `once` is `false`, it also calls `onChange(false)` when the element leaves the viewport. It returns a function that stops the observation.

### `play(element, options?)`

Plays the keyframes on the element, or on its children with `stagger`. It returns a function that cancels the animation. Call it in the same frame that removes the hidden style, or the element shows at its resting style for one frame.

### `hiddenStyle`

The style that hides an element until the reveal. A server renderer applies it to the markup, with `data-reveal="hidden"`, so that the element does not show before the client code runs.

Use `createReveal` when your framework renders the style of the element. Use `reveal` when your code owns the element.

## Keyframes

Each keyframes factory is a function. It takes its options, which you can leave out, and returns new [Web Animations keyframes](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats). The animation ends at the element's own style.

```js
import { slide } from "@awesome-reveal/core/keyframes";

reveal(element, { keyframes: slide() });
reveal(element, { keyframes: slide({ direction: "left", distance: 40 }) });
```

### Built-in keyframes

| Factory   | Effect                                     | Options                                                                                                               |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                                              |
| `slide()` | Fades in and moves in a direction.         | `direction` (`"up"`, `"down"`, `"left"` or `"right"`, default `"up"`), `distance` (default `24`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (default `0.95`), `opacity`, `easing`                                                                          |
| `blur()`  | Fades in and removes a blur.               | `from` (default `8`), `opacity`, `easing`                                                                             |
| `pop()`   | Fades in, grows past its size and settles. | `from` (default `0.8`), `opacity`, `easing`                                                                           |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                                              |

- `direction` is the direction in which the element moves. `"up"` starts below the resting position.
- A number for `distance`, `from` of `blur()`, `x`, `y` or `blur` is in pixels. A number for `rotate` is in degrees. A string can be any CSS length or angle.
- `opacity` is the start opacity. It is `0` by default. Set it to `1` for movement with no fade.
- The default `easing` is `"cubic-bezier(0.22, 1, 0.36, 1)"`. An easing with values out of the 0–1 range overshoots, as `pop()` does.
- `spring()` returns an easing that follows a spring, for the `easing` option of any factory: `slide({ easing: spring({ bounce: 0.5 }) })`. `bounce` (default `0.3`, from `0` to `0.8`) sets the overshoot. It uses CSS `linear()`. Chrome before 113, Firefox before 112 and Safari before 17.2 get the default easing. If you call `spring()` on the server, these browsers show the element with no animation.
- `blur()` animates `filter`. Chromium and Safari composite it, but other engines repaint it on each frame. Use it on small and medium elements.

```js
import { enter } from "@awesome-reveal/core/keyframes";

enter({ y: 40, scale: 0.9 }); // rise and grow
enter({ x: "-100%", rotate: -120 }); // roll in from the left
```

### Custom keyframes with `defineKeyframes`

`defineKeyframes` builds keyframes from a function of the animation progress. You return a `keyframe(t)` function, where `t` is the progress from 0 to 1. The library samples the function into keyframes:

```js
import { defineKeyframes } from "@awesome-reveal/core/keyframes";

const spin = defineKeyframes(({ turns = 1 }) => ({
  keyframe: (t) => ({ opacity: t, transform: `rotate(${(1 - t) * turns * 360}deg)` }),
  steps: 30, // optional, the number of samples, from 1 to 1000
}));

reveal(element, { keyframes: spin({ turns: 2 }) });
```

At `t = 1`, return the element's resting style. In TypeScript, give the options type: `defineKeyframes<{ turns?: number }>(…)`. Your function gets the options as given, so give defaults for all of them.

Each call samples the function again. Where your code runs often, such as a component render, call the factory once outside it, for example `const spinTwice = spin({ turns: 2 })`.

### Keyframes arrays

You can also pass a keyframes array directly. Make sure that the last keyframe is the element's resting style, because the animation does not stay applied after it finishes:

```js
reveal(element, {
  keyframes: [
    { opacity: 0, transform: "translate(-200px, -100px)", easing: "ease-out" },
    { opacity: 1, transform: "none" },
  ],
});
```

Web Animations eases each keyframe linearly by default. Set `easing` on a keyframe to change the easing up to the next keyframe.

To write a reusable factory with options, type it with `KeyframesFactory`:

```ts
import type { KeyframesFactory } from "@awesome-reveal/core/keyframes";

export const drop: KeyframesFactory<{ height?: number }> = ({ height = 40 } = {}) => [
  { opacity: 0, transform: `translateY(${-height}px)`, easing: "ease-out" },
  {},
];
```

## Options

The adapters accept the same options. `observe` uses `threshold`, `rootMargin` and `once`. `play` uses `keyframes`, `duration`, `delay`, `stagger` and `reducedMotion`. `reveal` and the adapters use all options.

### Animation

| Option      | Description                                                                                                   | Default   |
| ----------- | ------------------------------------------------------------------------------------------------------------- | --------- |
| `keyframes` | The animation. The last keyframe must be the resting style of the element.                                    | `slide()` |
| `duration`  | Animation duration, in milliseconds.                                                                          | `600`     |
| `delay`     | Delay before the animation starts, in milliseconds.                                                           | `0`       |
| `stagger`   | Animates the element children instead of the element, each one this many milliseconds after the previous one. | –         |

- `stagger` changes the target of the animation to the element children. `stagger: 0` animates all the children together.
- `stagger` animates only child elements. It does not animate text nodes, so put text in an element.
- The library reads the children when the element is revealed. A child that you add before the reveal animates, and a child that you add later does not.
- Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. An inline element that you reveal also needs `display: inline-block`, or it only fades.

### Trigger

| Option       | Description                                                                                                 | Default |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ------- |
| `threshold`  | Fraction of the element, between 0 and 1, that must be visible to reveal it.                                | `0`     |
| `rootMargin` | Grows or shrinks the viewport area that reveals the element, as a CSS margin in `px` or `%`.                | `"0px"` |
| `once`       | Reveals the element only the first time. When `false`, the element hides again when it leaves the viewport. | `true`  |
| `when`       | Controls the reveal as a level. When it is `true` or `false`, the viewport is not observed.                 | –       |

- `when` is a level, not an event. The element is revealed while `when` is `true`, and hidden while it is `false`. `undefined` and `null` mean that the viewport decides.
- With `when: true` at the start, the entrance plays once. `when` ignores `threshold`, `rootMargin` and `once`.
- A server renders an element with `when: true` shown, because nothing hides it. After hydration, the entrance starts at its first keyframe, so the element can flash. To avoid the flash, start with `when: false` and set it to `true` after the first render.
- `threshold: 1` never reveals an element that is taller than the observed area, because the whole element is never inside it. The observed area is the viewport plus `rootMargin`. Use a lower value.
- A negative `rootMargin`, such as `"-100px"` or `"0px 0px -10% 0px"`, shrinks the area that reveals the element. An element at the end of the page, which cannot scroll into that area, never reveals. Add space below the last element, or do not use a negative margin there.

### Reduced motion

| Option          | Description                                                                                                               | Default  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| `reducedMotion` | `"user"` skips the animation when the user prefers reduced motion. `"always"` always skips it. `"never"` always plays it. | `"user"` |

## Recipes

### Reveal inside the viewport

A negative `rootMargin` reveals the element only after it is 100px inside the viewport. With the default `once`, it stays revealed:

```js
reveal(element, { rootMargin: "-100px" });
```

Read the warning about negative margins in [Trigger](#trigger).

## Accessibility

- When the user prefers reduced motion, the element appears with no animation. Use `reducedMotion` to change this.
- Hidden content uses `opacity: 0` only. It stays in the accessibility tree and in the browser's find-in-page. Links and buttons in it stay focusable and clickable.
- When a keyboard user tabs to a hidden link or button, the browser scrolls it into view, and the reveal starts.
- `data-reveal` is reserved. The reveal sets `data-reveal="hidden"` on hidden elements, and removes it at the reveal. Do not use this attribute for your own data.

### Server markup, JavaScript off and print

Code that renders `hiddenStyle` in the server markup, as the React and Vue adapters do, hides the content with an inline `opacity: 0`. The library injects no `<style>` element, so a strict Content Security Policy needs only `style-src-attr 'unsafe-inline'`. The cost is that the content stays hidden when JavaScript does not run. Elements that are not revealed yet stay invisible on a printed page. Put this in the document head to show them:

```html
<noscript
  ><style>
    [data-reveal="hidden"] {
      opacity: 1 !important;
    }
  </style></noscript
>
<style>
  @media print {
    [data-reveal="hidden"] {
      opacity: 1 !important;
    }
  }
</style>
```

With a strict Content Security Policy, give each `<style>` a `nonce`, or put the print rule in your stylesheet.

- `reveal` on markup with no hidden state hides the element only when the script runs, so it needs no `<noscript>` rule. It needs the print rule.
- A stylesheet rule that applies only when scripting is enabled, as the Astro adapter uses, shows the content without JavaScript. It needs the print rule only.

## Browser support

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later. These versions support the Web Animations API with implicit keyframes. MDN reports bugs in the implicit keyframes of Safari from 13.1, with no fixed version. To support Safari, give each keyframe of your custom keyframes explicit values.

Without `IntersectionObserver`, elements are revealed immediately. Without `Element.animate`, elements appear with no animation.

## Agent skills

This package ships the `adding-reveal-animations` agent skill, which helps a coding agent add reveal animations to your project. pnpm 12.11 or later links it into your agent folders after you run `pnpm approve`.

## Support

- Report a bug in the [issue tracker](https://github.com/awesome-reveal/awesome-reveal/issues).
- Ask a question or suggest a feature in [Discussions](https://github.com/awesome-reveal/awesome-reveal/discussions).
- Read the [changelog](https://github.com/awesome-reveal/awesome-reveal/blob/next/packages/core/CHANGELOG.md) for the changes of each release.
- If you like this library, [consider supporting its creator](https://github.com/sponsors/morellodev).

## License

MIT
