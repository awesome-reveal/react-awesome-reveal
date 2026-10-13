---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations to plain DOM code with @awesome-reveal/core, including staggered children and custom keyframes. Use when the user wants elements to animate as they enter the viewport in a project with no framework adapter, or when you edit code that imports @awesome-reveal/core.
---

# Reveal on scroll with @awesome-reveal/core

`@awesome-reveal/core` hides an element until it enters the viewport, then animates it with the Web Animations API. It uses no framework. For React, Vue or Astro, use `@awesome-reveal/react`, `@awesome-reveal/vue` or `@awesome-reveal/astro`, which render the hidden state on the server.

The package is ESM-only. Load it with a bundler, such as Vite, or in a `<script type="module">`. To use the bare `@awesome-reveal/core` specifiers there, add an import map.

## Reveal elements

Import `reveal.css` once, in the entry module. It hides the elements until the reveal. Without it, the elements show before the reveal, and the library reports an error.

`reveal(target, options?)` hides the elements at once and plays the entrance when each element enters the viewport. `target` is an element, a CSS selector or a list of elements. A selector finds the elements once, when you call `reveal`. With one element, it returns a controller:

- `revealed`: `true` while the element is revealed.
- `setOptions(options)`: replaces all the options. Pass the full options object, not only the changed ones.
- `destroy()`: stops the observation, cancels the animation and shows the element. Later calls to `setOptions` do nothing.

With a selector or a list, it returns a group with `setOptions` and `destroy` for all the elements.

```ts
import "@awesome-reveal/core/reveal.css";
import { reveal } from "@awesome-reveal/core";

const cards = reveal(".card", { from: "left", threshold: 0.3 });
const lists = reveal(".list", { from: { scale: 0.95 }, stagger: 80 });

// Call it when the page removes the elements, for example on a client-side route change.
export function destroyReveals() {
  cards.destroy();
  lists.destroy();
}
```

To control the reveal yourself, set `when`. The viewport is then not observed:

```ts
import { reveal } from "@awesome-reveal/core";

const panel = document.querySelector<HTMLElement>("#results")!;
const controller = reveal(panel, { when: false });

// Later, when the data has loaded:
controller.setOptions({ when: true });
```

To run code at each reveal, pass `onReveal`. It gets the element, in the task that starts the animation.

Prefer `reveal` when your code owns the element. When other code renders the attributes of the element, use `createReveal`, which https://www.npmjs.com/package/@awesome-reveal/core#createrevealoptions describes. It plays the animation and leaves the hidden attribute to your listener.

## Avoid a flash on page load

`reveal` hides the element only when the script runs. Until then, the browser shows the HTML, so an element can show, disappear and then animate in. To hide it from the first paint, put the hidden attribute in the HTML. The reveal removes it:

```html
<section class="card" data-reveal="hidden">…</section>
```

Put the attribute only on elements that your script reveals. An element that no `reveal` call finds stays hidden. Do not hide the content at the top of the page: it then waits for the script, which can delay the Largest Contentful Paint.

`reveal.css` shows the hidden elements when JavaScript is off, in Chrome 120, Firefox 113 and Safari 17 or later, and in print. If the script fails or a blocker stops it, the content stays hidden. To show it after a timeout, put this in the document head. The library sets `data-reveal-ready` on `<html>` when it attaches the first element. When the attribute is not there in time, the script sets `data-reveal-failed`, and `reveal.css` shows the hidden elements. Use a timeout that is longer than the load time of the script on a slow network. Under a strict Content Security Policy, give the `<script>` a `nonce`:

```html
<script>
  setTimeout(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-reveal-ready")) html.setAttribute("data-reveal-failed", "");
  }, 5000);
</script>
```

## Entrance

Without options, the element fades in and moves up 24px. These options change the entrance:

| Option     | Description                                                                                                     | Default                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `from`     | Where the element starts: `"top"`, `"bottom"`, `"left"` or `"right"` of its resting position, or a start state. | `"bottom"`                         |
| `distance` | Distance from the side of `from`.                                                                               | `24`                               |
| `easing`   | A CSS easing, or `"spring"`.                                                                                    | `"cubic-bezier(0.22, 1, 0.36, 1)"` |
| `bounce`   | Overshoot of the spring, from `0` to `0.8`. When `easing` is not set, it selects the spring.                    | `0.3`                              |

- A start state is an object with `x`, `y`, `scale`, `rotate`, `blur` and `opacity`, such as `{ scale: 0.9, blur: 8 }`. `distance` applies only to a side.
- The element fades in from `opacity: 0`. Add `opacity: 1` to a start state for movement with no fade.
- A number for a length is in pixels, and a number for `rotate` is in degrees. A string can be any CSS length or angle.
- `"spring"` uses CSS `linear()`. Chrome before 113, Firefox before 112 and Safari before 17.2 get the default easing.

## Keyframes

For an animation that the entrance options cannot give, set `keyframes`. It replaces the entrance options. Each factory takes optional options and returns Web Animations keyframes that end at the element's own style. Import the factories from `@awesome-reveal/core` or `@awesome-reveal/core/keyframes`.

| Factory   | Effect                                     | Options                                                                                           |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                          |
| `slide()` | Fades in and moves in from a side.         | `from` (`"bottom"` default, `"top"`, `"left"`, `"right"`), `distance` (`24`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (`0.95`), `opacity`, `easing`                                                              |
| `blur()`  | Fades in and removes a blur.               | `from` (`8`), `opacity`, `easing`                                                                 |
| `pop()`   | Fades in, grows past its size and settles. | `from` (`0.8`), `opacity`, `easing`                                                               |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                          |

- `opacity` is the start opacity (default `0`).
- `spring()` returns an easing that follows a spring, for the `easing` option of a factory: `slide({ easing: spring({ bounce: 0.5 }) })`. Prefer the `easing: "spring"` option when the factory runs on the server, because `spring()` can check the browser support only in the browser.

For a custom animation, use `defineKeyframes` or a keyframes array:

```ts
import { defineKeyframes, type KeyframesFactory } from "@awesome-reveal/core/keyframes";

// keyframe(t) gets the progress t from 0 to 1. At t = 1, return the resting style.
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

| Option          | Description                                                                                                    | Default  |
| --------------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| `keyframes`     | The animation. It replaces the entrance options.                                                               | –        |
| `duration`      | Duration in milliseconds.                                                                                      | `600`    |
| `delay`         | Delay in milliseconds.                                                                                         | `0`      |
| `stagger`       | Animates the element children, each one this many milliseconds after the last one. `0` animates them together. | –        |
| `threshold`     | Fraction of the element (0 to 1) that must be visible.                                                         | `0`      |
| `rootMargin`    | Grows or shrinks the viewport area, as a CSS margin in `px` or `%`.                                            | `"0px"`  |
| `once`          | When `false`, the element hides again when it leaves the viewport.                                             | `true`   |
| `when`          | Controls the reveal as a level: `true` reveals, `false` hides, `undefined` or `null` lets the viewport decide. | –        |
| `onReveal`      | Called with the element each time it is revealed.                                                              | –        |
| `reducedMotion` | `"user"` follows `prefers-reduced-motion`. `"always"` skips, `"never"` plays.                                  | `"user"` |

## Rules

- `setOptions` applies a change of `when` at once, and restarts the observer for a change of `threshold`, `rootMargin` or `once`. The other options apply at the next reveal. They do not replay an animation that already played.
- `stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. An inline element that you reveal also needs `display: inline-block`, or it only fades. It skips text nodes, so put text in an element. It reads the children when the element is revealed.
- `when: true` at the start plays the entrance once. It ignores `threshold`, `rootMargin` and `once`.
- `threshold: 1` never reveals an element that is taller than the viewport plus its `rootMargin`. A negative `rootMargin` never reveals an element at the end of the page that cannot scroll into the shrunk area.
- The library has no focus reveal. Chromium and Firefox scroll a focused hidden link into view, and the observer then reveals it. With `when: false`, a high `threshold` or a negative `rootMargin`, focused content can stay hidden. Do not hide the only way to a control with these options.
- `data-reveal` is reserved. Do not use it for other data.
- Keep `reducedMotion` at `"user"` unless the user asks for a different behavior. It respects the operating system setting of people whom motion makes ill.
- Do not give a hidden element an inline `opacity` with `!important`. It wins over `reveal.css`, so the element shows before the reveal. The library writes no inline style, so a strict Content Security Policy needs no `'unsafe-inline'` for it.
- Without `IntersectionObserver`, elements are revealed at once. Without `Element.animate`, elements appear with no animation.
- `null` is the same as leaving a `reveal` option out. This does not apply to the options of the keyframes factories.
- When the browser rejects an option, such as a `threshold` above `1`, a `rootMargin` with no unit or a keyframe value, the element shows and stays shown, also when you correct the option later. The error is reported once from a microtask. It reaches `window.onerror`. It does not throw in your code.
