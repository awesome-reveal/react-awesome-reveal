---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations to plain DOM code with @awesome-reveal/core, including staggered children and custom keyframes. Use when the user wants elements to animate as they enter the viewport in a project with no framework adapter, or when you edit code that imports @awesome-reveal/core.
---

# Reveal on scroll with @awesome-reveal/core

`@awesome-reveal/core` hides an element until it enters the viewport, then animates it with the Web Animations API. It uses no framework. For React or Vue, use `@awesome-reveal/react` or `@awesome-reveal/vue`, which render the hidden style on the server.

The package is ESM-only. Load it with a bundler, such as Vite, or in a `<script type="module">`. To use the bare `@awesome-reveal/core` specifiers there, add an import map.

## Reveal elements

`reveal(element, options?)` hides the element at once and plays the keyframes when the element enters the viewport. It returns a controller:

- `revealed`: `true` while the element is revealed.
- `update(options)`: replaces all the options. Pass the full options object, not only the changed ones.
- `destroy()`: stops the observation and cancels the animation. The element keeps its current style, so an element that is still hidden stays at `opacity: 0`. Later calls to `update` do nothing.

```ts
import { reveal } from "@awesome-reveal/core";
import { fade, slide } from "@awesome-reveal/core/keyframes";

const controllers = [
  ...Array.from(document.querySelectorAll<HTMLElement>(".card"), (card) =>
    reveal(card, { keyframes: slide({ direction: "left" }), threshold: 0.3 }),
  ),
  ...Array.from(document.querySelectorAll<HTMLElement>(".list"), (list) =>
    reveal(list, { keyframes: fade(), stagger: 80 }),
  ),
];

// Call it when the page removes the elements, for example on a client-side route change.
export function destroyReveals() {
  for (const controller of controllers) controller.destroy();
}
```

To control the reveal yourself, set `when`. The viewport is then not observed:

```ts
import { reveal } from "@awesome-reveal/core";

const panel = document.querySelector<HTMLElement>("#results")!;
const controller = reveal(panel, { when: false });

// Later, when the data has loaded:
controller.update({ when: true });
```

`observe`, `play` and `hiddenStyle` are the parts that `reveal` uses. They are for adapter authors and for code where something else sets the style of the element. Prefer `reveal` when your code owns the element.

## Avoid a flash on page load

`reveal` hides the element only when the script runs. Until then, the browser shows the HTML, so an element can show, disappear and then animate in. To hide it from the first paint, put the hidden state in the HTML. The reveal removes the inline `opacity` and the `data-reveal` attribute:

```html
<section class="card" style="opacity: 0" data-reveal="hidden">…</section>
```

Put the hidden state only on elements that your script reveals. An element that no `reveal` call finds stays hidden. Do not hide the content at the top of the page: it then waits for the script, which can delay the Largest Contentful Paint.

Then content stays hidden if JavaScript does not run. To show it, put this in the document head:

```html
<noscript>
  <style>
    [data-reveal="hidden"] {
      opacity: 1 !important;
    }
  </style>
</noscript>
```

Under a strict Content Security Policy, the inline `opacity: 0` style needs `style-src-attr 'unsafe-inline'`. To avoid it, put only `data-reveal="hidden"` in the HTML, and add `[data-reveal="hidden"] { opacity: 0; }` to your stylesheet. `reveal` sets its own styles through `element.style`, which the policy does not block.

## Keyframes

`keyframes` is optional. Without it, the element fades in and moves up, as with `slide()`. Each factory takes optional options and returns Web Animations keyframes that end at the element's own style.

| Factory   | Effect                                     | Options                                                                                             |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                            |
| `slide()` | Fades in and moves in a direction.         | `direction` (`"up"` default, `"down"`, `"left"`, `"right"`), `distance` (`24`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (`0.95`), `opacity`, `easing`                                                                |
| `blur()`  | Fades in and removes a blur.               | `amount` (`8`), `opacity`, `easing`                                                                 |
| `pop()`   | Fades in, grows past its size and settles. | `from` (`0.8`), `opacity`, `easing`                                                                 |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                            |

- `direction` is the direction of the movement. `"up"` starts below the resting position.
- A number for a length is in pixels, and a number for `rotate` is in degrees. A string can be any CSS length or angle.
- `opacity` is the start opacity (default `0`). Set it to `1` for movement with no fade.
- `spring()` returns an easing that follows a spring, for the `easing` option of any factory: `slide({ easing: spring({ bounce: 0.5 }) })`. `bounce` (default `0.3`, from `0` to `0.8`) sets the overshoot. It uses CSS `linear()`. Safari before 17.2 gets the default easing.

For a custom animation, use `defineKeyframes` or a keyframes array:

```ts
import { defineKeyframes, type KeyframesFactory } from "@awesome-reveal/core/keyframes";

// keyframe(t, u) gets the progress t from 0 to 1, and u = 1 - t. At t = 1, return the resting style.
const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
  keyframe: (t, u) => ({ opacity: t, transform: `rotate(${u * turns * 360}deg)` }),
}));

// The last keyframe must be the resting style: the animation does not stay applied.
const drop: KeyframesFactory<{ height?: number }> = ({ height = 40 } = {}) => [
  { opacity: 0, transform: `translateY(${-height}px)`, easing: "ease-out" },
  {},
];
```

## Options

| Option          | Description                                                                        | Default   |
| --------------- | ---------------------------------------------------------------------------------- | --------- |
| `keyframes`     | The animation.                                                                     | `slide()` |
| `duration`      | Duration in milliseconds.                                                          | `600`     |
| `delay`         | Delay in milliseconds.                                                             | `0`       |
| `stagger`       | Animates the element children, each one this many milliseconds after the last one. | –         |
| `threshold`     | Fraction of the element (0 to 1) that must be visible.                             | `0`       |
| `rootMargin`    | Grows or shrinks the viewport area, as a CSS margin in `px` or `%`.                | `"0px"`   |
| `once`          | When `false`, the element hides again when it leaves the viewport.                 | `true`    |
| `when`          | Controls the reveal manually. When set, the viewport is not observed.              | –         |
| `reducedMotion` | `"user"` follows `prefers-reduced-motion`. `"always"` skips, `"never"` plays.      | `"user"`  |

## Rules

- `update` applies a change of `when` at once, and restarts the observer for a change of `threshold`, `rootMargin` or `once`. The other options apply at the next reveal. They do not replay an animation that already played.
- `stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`.
- Keep `reducedMotion` at `"user"` unless the user asks for a different behavior. It respects the operating system setting of people whom motion makes ill.
- Prefer `transform` and `opacity`. `filter` (`blur()`) and `clip-path` repaint on each frame in some engines, so use them on small elements.
- While the element is hidden, its inline `opacity` is `0`. The reveal removes the inline `opacity`, so set your own opacity in a class, not in the `style` attribute.
- Without `IntersectionObserver`, elements are revealed at once. Without `Element.animate`, elements appear with no animation.
