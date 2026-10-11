# @awesome-reveal/core

[![Version](https://badgen.net/npm/v/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![License](https://badgen.net/npm/license/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)

The framework-independent core of [awesome-reveal](https://awesome-reveal.morello.dev). It reveals elements when they enter the viewport. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect the reveal, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

The framework adapters use this package. If your app uses one of these frameworks, install its adapter instead:

| Framework | Package                                                                        |
| --------- | ------------------------------------------------------------------------------ |
| React     | [`@awesome-reveal/react`](https://www.npmjs.com/package/@awesome-reveal/react) |
| Vue       | [`@awesome-reveal/vue`](https://www.npmjs.com/package/@awesome-reveal/vue)     |

Use this package directly with plain DOM code, or to write an adapter for another framework. This README also documents the keyframes, the options, accessibility and browser support for all the adapters.

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Entry points](#entry-points)
- [API](#api)
- [Keyframes](#keyframes)
- [Options](#options)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [License](#license)

## Installation

```sh
pnpm add @awesome-reveal/core
```

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

| Import path                      | Contents                                                    |
| -------------------------------- | ----------------------------------------------------------- |
| `@awesome-reveal/core`           | `reveal`, `observe`, `play` and `hiddenStyle`.              |
| `@awesome-reveal/core/keyframes` | The built-in keyframes, `defineKeyframes`, and their types. |

The keyframes do not touch the DOM, so you can create them on the server. Each adapter re-exports this entry point, for example as `@awesome-reveal/react/keyframes`.

## API

### `reveal(element, options?)`

Hides the element, and plays the keyframes when the element enters the viewport. It returns a controller:

- `revealed`: `true` after the reveal.
- `update(options)`: replaces the options. A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal.
- `destroy()`: stops the observation and cancels the animation.

While the element is hidden, it has an inline `opacity: 0` and `data-reveal="hidden"`. The reveal removes both.

### `observe(element, options, onChange)`

Calls `onChange(true)` when the element enters the viewport. When `once` is `false`, it also calls `onChange(false)` when the element leaves the viewport. It returns a function that stops the observation.

### `play(element, options?)`

Plays the keyframes on the element, or on its children with `stagger`. It returns a function that cancels the animation. Call it in the same frame that removes the hidden style, or the element shows at its resting style for one frame.

### `hiddenStyle`

The style that hides an element until the reveal. A server renderer applies it to the markup, so that the element does not show before the client code runs.

Use `observe`, `play` and `hiddenStyle` when your framework renders the style of the element. Use `reveal` when your code owns the element.

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
| `blur()`  | Fades in and removes a blur.               | `amount` (default `8`), `opacity`, `easing`                                                                           |
| `pop()`   | Fades in, grows past its size and settles. | `from` (default `0.8`), `opacity`, `easing`                                                                           |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                                              |

- `direction` is the direction in which the element moves. `"up"` starts below the resting position.
- A number for `distance`, `amount`, `x`, `y` or `blur` is in pixels. A number for `rotate` is in degrees. A string can be any CSS length or angle.
- `opacity` is the start opacity. It is `0` by default. Set it to `1` for movement with no fade.
- The default `easing` is `"cubic-bezier(0.22, 1, 0.36, 1)"`. An easing with values out of the 0–1 range overshoots, as `pop()` does.
- `spring()` returns an easing that follows a spring, for the `easing` option of any factory: `slide({ easing: spring({ bounce: 0.5 }) })`. `bounce` (default `0.3`, from `0` to `0.8`) sets the overshoot. It uses CSS `linear()`. Safari before 17.2 gets the default easing. If you call `spring()` on the server, that Safari shows the element with no animation.
- `blur()` animates `filter`. Chromium and Safari composite it, but other engines repaint it on each frame. Use it on small and medium elements.

```js
import { enter } from "@awesome-reveal/core/keyframes";

enter({ y: 40, scale: 0.9 }); // rise and grow
enter({ x: "-100%", rotate: -120 }); // roll in from the left
```

### Custom keyframes with `defineKeyframes`

`defineKeyframes` builds keyframes from a function of the animation progress. You return a `keyframe(t, u)` function, where `t` is the progress from 0 to 1 and `u` is `1 - t`. The library samples the function into keyframes:

```js
import { defineKeyframes } from "@awesome-reveal/core/keyframes";

const spin = defineKeyframes(({ turns = 1 }) => ({
  keyframe: (t, u) => ({ opacity: t, transform: `rotate(${u * turns * 360}deg)` }),
  easing: (t) => 1 - (1 - t) ** 3, // optional, any JavaScript easing function
  steps: 30, // optional, the number of samples
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

The adapters accept the same options.

| Option          | Description                                                                                                               | Default   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | --------- |
| `keyframes`     | The animation. The last keyframe must be the resting style of the element.                                                | `slide()` |
| `duration`      | Animation duration, in milliseconds.                                                                                      | `600`     |
| `delay`         | Delay before the animation starts, in milliseconds.                                                                       | `0`       |
| `stagger`       | Animates the element children instead of the element, each one this many milliseconds after the previous one.             | –         |
| `threshold`     | Fraction of the element, between 0 and 1, that must be visible to reveal it.                                              | `0`       |
| `rootMargin`    | Grows or shrinks the viewport area that reveals the element, as a CSS margin in `px` or `%`.                              | `"0px"`   |
| `once`          | Reveals the element only the first time. When `false`, the element hides again when it leaves the viewport.               | `true`    |
| `when`          | Controls the reveal manually. When set, the viewport is not observed.                                                     | –         |
| `reducedMotion` | `"user"` skips the animation when the user prefers reduced motion. `"always"` always skips it. `"never"` always plays it. | `"user"`  |

`observe` uses `threshold`, `rootMargin` and `once`. `play` uses `keyframes`, `duration`, `delay`, `stagger` and `reducedMotion`. `reveal` and the adapters use all options.

`stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`.

## Accessibility

- When the user prefers reduced motion, the element appears with no animation. Use `reducedMotion` to change this.
- Hidden content uses `opacity: 0` only. It stays in the accessibility tree and in the browser's find-in-page.
- If JavaScript does not run, content rendered on the server stays hidden. To show it, put this CSS in a `<noscript>` element in the document head:

  ```css
  [data-reveal="hidden"] {
    opacity: 1 !important;
  }
  ```

  `reveal` sets `data-reveal="hidden"` on hidden elements. With `observe`, `play` and `hiddenStyle`, add the attribute yourself.

- The library injects no `<style>` elements. Under a strict Content Security Policy, the inline `opacity: 0` style that the server renders needs `style-src-attr 'unsafe-inline'`.

## Browser support

Chrome 84, Firefox 75 and Safari 13.1, or later. These versions support the Web Animations API with implicit keyframes. MDN reports that the implicit keyframes of Safari 13.1 to 15 have bugs. If you support these versions, give each keyframe of your custom keyframes explicit values.

Without `IntersectionObserver`, elements are revealed immediately. Without `Element.animate`, elements appear with no animation.

## License

MIT
