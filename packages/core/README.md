# @awesome-reveal/core

[![Version](https://badgen.net/npm/v/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)
[![License](https://badgen.net/npm/license/@awesome-reveal/core)](https://www.npmjs.com/package/@awesome-reveal/core)

The framework-independent core of [awesome-reveal](https://github.com/awesome-reveal/awesome-reveal). It reveals elements when they enter the viewport. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect the reveal, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

The framework adapters use this package. If your app uses one of these frameworks, install its adapter instead:

| Framework | Package                                                                        |
| --------- | ------------------------------------------------------------------------------ |
| React     | [`@awesome-reveal/react`](https://www.npmjs.com/package/@awesome-reveal/react) |

Use this package directly with plain DOM code, or to write an adapter for another framework.

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

The keyframes do not touch the DOM, so you can create them on the server. The [`@awesome-reveal/react` README](https://github.com/awesome-reveal/awesome-reveal/tree/next/packages/react#keyframes) documents the keyframes factories.

## API

### `reveal(element, options?)`

Hides the element, and plays the keyframes when the element enters the viewport. It returns a controller:

- `revealed`: `true` after the reveal.
- `update(options)`: replaces the options. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal.
- `destroy()`: stops the observation and cancels the animation.

While the element is hidden, it has an inline `opacity: 0` and `data-reveal="hidden"`. The reveal removes both.

### `observe(element, options, onChange)`

Calls `onChange(true)` when the element enters the viewport. When `once` is `false`, it also calls `onChange(false)` when the element leaves the viewport. It returns a function that stops the observation.

### `play(element, options?)`

Plays the keyframes on the element, or on its children with `stagger`. It returns a function that cancels the animation. Call it in the same frame that removes the hidden style, or the element shows at its resting style for one frame.

### `hiddenStyle`

The style that hides an element until the reveal. A server renderer applies it to the markup, so that the element does not show before the client code runs.

Use `observe`, `play` and `hiddenStyle` when your framework renders the style of the element. Use `reveal` when your code owns the element.

## Options

| Option          | Description                                                                                                               | Default   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | --------- |
| `keyframes`     | The animation. The last keyframe must be the resting style of the element.                                                | `slide()` |
| `duration`      | Animation duration, in milliseconds.                                                                                      | `600`     |
| `delay`         | Delay before the animation starts, in milliseconds.                                                                       | `0`       |
| `stagger`       | Animates the element children instead of the element, each one this many milliseconds after the previous one.             | –         |
| `threshold`     | Fraction of the element, between 0 and 1, that must be visible to reveal it.                                              | `0`       |
| `rootMargin`    | Grows or shrinks the viewport area that reveals the element, as a CSS margin in `px` or `%`.                              | `"0px"`   |
| `once`          | Reveals the element only the first time. When `false`, the element hides again when it leaves the viewport.               | `true`    |
| `reducedMotion` | `"user"` skips the animation when the user prefers reduced motion. `"always"` always skips it. `"never"` always plays it. | `"user"`  |

`observe` uses `threshold`, `rootMargin` and `once`. `play` uses the other options.

## Browser support

Chrome 84, Firefox 75 and Safari 13.1, or later. Without `IntersectionObserver`, elements are revealed immediately. Without `Element.animate`, elements appear with no animation.

## License

MIT
