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
- 🌳 **Tree-shakeable** – The package is ESM-only, with one file for each module. Only `reveal.css` has side effects.
- 🔒 **CSP-ready** – A stylesheet hides the content. The library writes no inline style.
- ⚙️ **Native APIs** – Intersection Observer detects the reveal. Web Animations run it on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree.
- 🧱 **Framework-independent** – Use it with plain DOM code, or build an adapter on `createReveal`.
- 🏷 **TypeScript** – Strict types for the options, the controller and the keyframes.

## Installation

```sh
npm install @awesome-reveal/core
```

Use `pnpm add`, `yarn add` or `bun add` in the same way. The package is ESM-only. Load it with a bundler, such as Vite, or in a `<script type="module">`. TypeScript needs `moduleResolution` set to `bundler`, `node16` or `nodenext`, because the package uses `exports` for its entry points.

Import `reveal.css` once, for example in your entry module. It hides the elements until the reveal. Without it, the elements show before the reveal, and the library reports an error:

```js
import "@awesome-reveal/core/reveal.css";
```

To load it without a bundler, link `node_modules/@awesome-reveal/core/dist/reveal.css` in the document head.

## Quick start

```js
import "@awesome-reveal/core/reveal.css";
import { reveal } from "@awesome-reveal/core";

const cards = reveal(".card", { from: "left", duration: 800 });

// Later, for example when the elements leave the page:
cards.destroy();
```

## Entry points

| Import path                       | Contents                                                                           |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `@awesome-reveal/core`            | `reveal`, `createReveal`, `observe`, `play`, `hiddenAttributes` and the keyframes. |
| `@awesome-reveal/core/keyframes`  | Only the built-in keyframes, `defineKeyframes`, and their types.                   |
| `@awesome-reveal/core/reveal.css` | The stylesheet that hides the elements until the reveal.                           |

The keyframes do not touch the DOM, so you can create them on the server. Each adapter re-exports them from its root entry and from `/keyframes`, for example `@awesome-reveal/react/keyframes`.

## API

### `reveal(target, options?)`

Hides the element, and plays the entrance when the element enters the viewport. `target` is an element, a CSS selector or a list of elements, such as a `NodeList`. With an element, it returns a controller:

- `revealed`: `true` while the element is revealed.
- `setOptions(options)`: replaces the options. A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal.
- `destroy()`: stops the observation, cancels the animation and shows the element.

With a selector or a list, it reveals each element as `reveal(element)` does, and returns a group with `setOptions` and `destroy` for all the elements. It finds the elements once, when you call it. Each element has its own state, so each one reveals when it enters the viewport.

While the element is hidden, it has `data-reveal="hidden"`, which `reveal.css` hides. The reveal removes the attribute. The library does not write the `style` of the element. If the browser rejects an option, the element shows at once and stays shown, also when you correct the option later. The library reports the error once from a microtask, so it reaches `window.onerror` and does not throw in your code.

### `createReveal(options?)`

The state that `reveal` uses, for adapters and for code that renders the attributes of the element itself. It does not change the DOM. It observes the element, plays the animation and tells you when to hide or show the element:

- `revealed`: `true` while the element is revealed. It is `false` when you create the state, also with `when: true`, so that a server renders the element hidden.
- `subscribe(listener)`: calls `listener(revealed)` when `revealed` changes. Hide or show the element in it. There is one listener, and a new call replaces it. It returns a function that removes the listener.
- `attach(element)`: observes and animates the element. A new element keeps the state and does not play the animation again. `attach(null)` stops the observation and cancels the animation.
- `setOptions(options)`: replaces the options, as for `reveal`.

### `observe(element, options, onChange)`

Calls `onChange(true)` when the element enters the viewport. When `once` is `false`, it also calls `onChange(false)` when the element leaves the viewport. It returns a function that stops the observation.

### `play(element, options?)`

Plays the keyframes on the element, or on its children with `stagger`. It returns a function that cancels the animation. Call it in the same frame that removes `data-reveal`, or the element shows at its resting style for one frame.

### `hiddenAttributes`

The attributes that hide an element until the reveal: `{ "data-reveal": "hidden" }`. A server renderer puts them on the markup, so that the element does not show before the client code runs. `reveal.css` must load on the page.

Use `createReveal` when your framework renders the attributes of the element. Use `reveal` when your code owns the element.

## Keyframes

Each keyframes factory is a function. It takes its options, which you can leave out, and returns new [Web Animations keyframes](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats). The animation ends at the element's own style.

```js
import { slide } from "@awesome-reveal/core/keyframes";

reveal(element, { keyframes: slide() });
reveal(element, { keyframes: slide({ from: "left", distance: 40 }) });
```

### Built-in keyframes

| Factory   | Effect                                     | Options                                                                                                                 |
| --------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                                                |
| `slide()` | Fades in and moves in from a side.         | `from` (`"top"`, `"bottom"`, `"left"` or `"right"`, default `"bottom"`), `distance` (default `24`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (default `0.95`), `opacity`, `easing`                                                                            |
| `blur()`  | Fades in and removes a blur.               | `from` (default `8`), `opacity`, `easing`                                                                               |
| `pop()`   | Fades in, grows past its size and settles. | `from` (default `0.8`), `opacity`, `easing`                                                                             |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                                                |

- The `from` of `slide()` is the side where the element starts. `"bottom"` moves the element up.
- A number for `distance`, `from` of `blur()`, `x`, `y` or `blur` is in pixels. A number for `rotate` is in degrees. A string can be any CSS length or angle.
- `opacity` is the start opacity. It is `0` by default. Set it to `1` for movement with no fade.
- The default `easing` is `"cubic-bezier(0.22, 1, 0.36, 1)"`. An easing with values out of the 0–1 range overshoots, as `pop()` does.
- `spring()` returns an easing that follows a spring, for the `easing` option of any factory: `slide({ easing: spring({ bounce: 0.5 }) })`. `bounce` (default `0.3`, from `0` to `0.8`) sets the overshoot. It uses CSS `linear()`. Chrome before 113, Firefox before 112 and Safari before 17.2 get the default easing. If you call `spring()` on the server, these browsers show the element with no animation. The `easing: "spring"` option does not have this limit, because it resolves in the browser.
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

The adapters accept the same options. `observe` uses the trigger options. `play` uses the entrance and animation options and `reducedMotion`. `reveal` and the adapters use all options.

### Entrance

| Option     | Description                                                                                                              | Default                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `from`     | Where the element starts: a side of its resting position (`"top"`, `"bottom"`, `"left"` or `"right"`), or a start state. | `"bottom"`                         |
| `distance` | The distance from the side of `from`. A number is in pixels. A string can be any CSS length.                             | `24`                               |
| `easing`   | A CSS easing, or `"spring"`.                                                                                             | `"cubic-bezier(0.22, 1, 0.36, 1)"` |
| `bounce`   | The overshoot of the spring, from `0` to `0.8`. When `easing` is not set, `bounce` selects the spring.                   | `0.3`                              |

```js
reveal(".card", { from: "left", distance: 40 });
reveal(".photo", { from: { scale: 0.9, blur: 8 }, bounce: 0.4 });
```

- The element fades in from `opacity: 0` and moves from the side of `from`. With no options, it moves up 24px, as with `slide()`.
- A start state takes the options of [`enter()`](#built-in-keyframes): `x`, `y`, `scale`, `rotate`, `blur` and `opacity`. Set `opacity: 1` for movement with no fade. `distance` applies only to a side.
- `"spring"` resolves in the browser. Chrome before 113, Firefox before 112 and Safari before 17.2 do not support CSS `linear()`, so they get the default easing.
- `keyframes` replaces the entrance options. Use it for an animation that they cannot give.

### Animation

| Option      | Description                                                                                                   | Default |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ------- |
| `keyframes` | The animation. The last keyframe must be the resting style of the element.                                    | –       |
| `duration`  | Animation duration, in milliseconds.                                                                          | `600`   |
| `delay`     | Delay before the animation starts, in milliseconds.                                                           | `0`     |
| `stagger`   | Animates the element children instead of the element, each one this many milliseconds after the previous one. | –       |

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
| `onReveal`   | Called with the element each time it is revealed, in the task that starts the animation.                    | –       |

- `when` is a level, not an event. The element is revealed while `when` is `true`, and hidden while it is `false`. `undefined` and `null` mean that the viewport decides.
- With `when: true` at the start, the entrance plays once. `when` ignores `threshold`, `rootMargin` and `once`.
- A server renders the element hidden, also with `when: true`. The entrance plays when the client code attaches the element.
- `onReveal` is not called again when a framework replays an effect on the same element, such as in React `StrictMode`.
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
- When a keyboard user tabs to a hidden link or button, Chromium and Firefox scroll it into view, and the reveal starts. The library has no focus reveal. Focused content can stay hidden when `when` is `false`, when `threshold` is high, or when a negative `rootMargin` shrinks the observed area. Do not hide the only way to a control with these options. Use `when: true` or a larger `rootMargin` for it.
- `data-reveal` is reserved. The reveal sets `data-reveal="hidden"` on hidden elements, and removes it at the reveal. Do not use this attribute for your own data.

### The stylesheet

`reveal.css` hides each element that has `data-reveal="hidden"`, with `opacity: 0 !important`. It shows the hidden elements again in these cases:

- JavaScript is off. The rule uses `@media (scripting: none)`, which needs Chrome 120, Firefox 113 or Safari 17. In older browsers, the content stays hidden when JavaScript is off.
- The page prints.
- `<html>` has `data-reveal-failed`. See [Recover when the script fails](#recover-when-the-script-fails).

A document stylesheet does not reach a shadow root. For an element in a shadow root, add `reveal.css` to the shadow root too, for example with `adoptedStyleSheets`. Its `data-reveal-failed` rule does not apply there, because a shadow root has no `<html>` element.

The library writes no inline style, so a strict Content Security Policy needs no `'unsafe-inline'`. Serve the stylesheet from a source that `style-src` allows.

Do not give a hidden element an inline `opacity` with `!important`. An inline `!important` declaration wins over the stylesheet, so the element shows before the reveal. An inline `opacity` with no `!important` is safe. It applies after the reveal.

### Recover when the script fails

The stylesheet shows the content when JavaScript is off. It does not show the content when a script fails or a blocker stops it, because the browser still runs scripts. To show the content in this case, put this script in the document head:

```html
<script>
  setTimeout(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-reveal-ready")) html.setAttribute("data-reveal-failed", "");
  }, 5000);
</script>
```

The library sets `data-reveal-ready` on `<html>` when it attaches the first element. If the attribute is not there after the timeout, the script sets `data-reveal-failed`, and `reveal.css` shows the hidden elements.

- Use a timeout that is longer than the load time of your script on a slow network. A script that loads after the timeout still reveals its elements, but the elements are already shown.
- The attribute shows that the library started on the page. The recipe does not cover code that loads later and fails, such as a dynamic `import()`.
- With a strict Content Security Policy, give the `<script>` a `nonce`, or allow its hash.

## Browser support

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later. These versions support the Web Animations API with implicit keyframes. MDN marks the implicit keyframes of Safari as a partial implementation, with no details. One open WebKit bug ([212409](https://bugs.webkit.org/show_bug.cgi?id=212409)) can take an implicit start value from an earlier animation of the element. The built-in keyframes give explicit start values. In your custom keyframes, give explicit values to the first keyframe.

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
