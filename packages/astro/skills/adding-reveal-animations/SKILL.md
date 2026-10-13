---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations to Astro pages and components with @awesome-reveal/astro, including staggered children and custom keyframes. Use when the user wants elements to animate as they enter the viewport, or when you edit code that imports @awesome-reveal/astro.
---

# Reveal on scroll with @awesome-reveal/astro

`@awesome-reveal/astro` hides an element until it enters the viewport, then animates it with the Web Animations API. It needs Astro 6 or 7.

## The `Reveal` component

`Reveal` renders one element and animates it. Use `as` to choose the tag (default `div`). It passes the other attributes and the default slot to that element. Call the keyframes factories in the frontmatter or in the template:

```astro
---
import { Reveal } from "@awesome-reveal/astro";
import { fade, slide } from "@awesome-reveal/astro/keyframes";
---

<Reveal as="section" keyframes={slide()} class="hero">…</Reveal>

<Reveal as="article" keyframes={fade()} threshold={0.3}>…</Reveal>
```

`Reveal` is an Astro component, so it works in `.astro` and `.mdx` files. In a React or Vue island, use `@awesome-reveal/react` or `@awesome-reveal/vue`.

## Keyframes

`keyframes` is optional. Without it, the element fades in and moves up, as with `slide()`. Each factory takes optional options and returns Web Animations keyframes that end at the element's own style.

| Factory   | Effect                                     | Options                                                                                             |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `fade()`  | Fades in.                                  | `easing`                                                                                            |
| `slide()` | Fades in and moves in a direction.         | `direction` (`"up"` default, `"down"`, `"left"`, `"right"`), `distance` (`24`), `opacity`, `easing` |
| `scale()` | Fades in and grows.                        | `from` (`0.95`), `opacity`, `easing`                                                                |
| `blur()`  | Fades in and removes a blur.               | `from` (`8`), `opacity`, `easing`                                                                   |
| `pop()`   | Fades in, grows past its size and settles. | `from` (`0.8`), `opacity`, `easing`                                                                 |
| `enter()` | Starts from any combination of the others. | `x`, `y`, `scale`, `rotate`, `blur`, `opacity`, `easing`                                            |

- `direction` is the direction of the movement. `"up"` starts below the resting position.
- A number for a length is in pixels, and a number for `rotate` is in degrees. A string can be any CSS length or angle.
- `opacity` is the start opacity (default `0`). Set it to `1` for movement with no fade.
- `spring()` returns an easing that follows a spring, for the `easing` option of any factory: `slide({ easing: spring({ bounce: 0.5 }) })`. `bounce` (default `0.3`, from `0` to `0.8`) sets the overshoot. It uses CSS `linear()`. Chrome before 113, Firefox before 112 and Safari before 17.2 show the element with no animation, because the factories run on the server.

For a custom animation, use `defineKeyframes` or a keyframes array:

```ts
import { defineKeyframes, type KeyframesFactory } from "@awesome-reveal/astro/keyframes";

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

`Reveal` takes the options as props.

| Option          | Description                                                                                                    | Default   |
| --------------- | -------------------------------------------------------------------------------------------------------------- | --------- |
| `keyframes`     | The animation.                                                                                                 | `slide()` |
| `duration`      | Duration in milliseconds.                                                                                      | `600`     |
| `delay`         | Delay in milliseconds.                                                                                         | `0`       |
| `stagger`       | Animates the element children, each one this many milliseconds after the last one. `0` animates them together. | –         |
| `threshold`     | Fraction of the element (0 to 1) that must be visible.                                                         | `0`       |
| `rootMargin`    | Grows or shrinks the viewport area, as a CSS margin in `px` or `%`.                                            | `"0px"`   |
| `once`          | When `false`, the element hides again when it leaves the viewport.                                             | `true`    |
| `when`          | Controls the reveal as a level: `true` reveals, `false` hides, `undefined` or `null` lets the viewport decide. | –         |
| `reducedMotion` | `"user"` follows `prefers-reduced-motion`. `"always"` skips, `"never"` plays.                                  | `"user"`  |

## How it works

`Reveal` renders an `<awesome-reveal>` custom element with `display: contents` around your element. A script that Astro bundles defines the custom element. The custom element reveals its first element child, with the options that `Reveal` writes into its `options` attribute as JSON.

- The options go through JSON, so pass only plain values. The keyframes factories return plain values.
- Each `Reveal` writes its own copy of the options. A `defineKeyframes` factory adds about 3 kB of HTML to each instance, a built-in factory, such as `slide()`, about 100 to 200 bytes, and `spring()` about 300 bytes. For a long list, use one `Reveal` with `stagger`.
- An `options` attribute with invalid JSON is reported to the console. When the element connects, it reveals with the default options. After that, the previous options stay.
- To change the options in the browser, for example `when`, set the `options` attribute of the `<awesome-reveal>` element to new JSON. The new value replaces all the options, so parse the current value and merge your change into it. A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal.
- It works with the `<ClientRouter />`, with server islands and with `transition:persist`. A persisted element does not play again after a navigation. `transition:persist` works on `Reveal` and on an ancestor.
- It works with `security.csp`. The server markup hides the element with `data-reveal="hidden"` and a stylesheet rule, not a `style` attribute.
- The stylesheet rule uses `!important`, so it also hides an element that has an inline `opacity`. It applies only when scripting is enabled, so the content shows when JavaScript is off. Do not add a `<noscript>` style. Elements that are not revealed yet stay invisible on a printed page. Add `@media print { [data-reveal="hidden"] { opacity: 1 !important; } }` to your stylesheet. The hidden rule has no specificity, so this rule overrides it.
- If the script fails or a blocker stops it, the content stays hidden, because scripting is enabled. To show it after a timeout, put this in the document head. The script checks that the `<awesome-reveal>` element is defined. `is:inline` keeps Astro from scoping the style and bundling the script. Use a timeout that is longer than the load time of the script on a slow network. With `security.csp`, allow the two inline tags, for example with `Astro.csp.insertStyleHash()` and `Astro.csp.insertScriptHash()`:

  ```astro
  <style is:inline>
    html[data-reveal-failed] [data-reveal="hidden"] {
      opacity: 1 !important;
    }
  </style>
  <script is:inline>
    setTimeout(() => {
      if (!customElements.get("awesome-reveal")) document.documentElement.setAttribute("data-reveal-failed", "");
    }, 5000);
  </script>
  ```

## Rules

- Do not put `Reveal` directly in a `<table>`, `<tbody>` or `<tr>`. The HTML parser moves the `<awesome-reveal>` element out of the table. Put `Reveal` around the whole table, or inside a cell.
- For a list, animate the list with `stagger`, not each item: `<Reveal as="ul" stagger={80}>`. A `<ul>` must contain only `<li>` elements.
- `stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. With an inline `as` tag, `Reveal` itself also needs `display: inline-block`, or it only fades. It skips text nodes, so put text in an element. It reads the children when the element is revealed.
- `when: true` at the start plays the entrance once. It ignores `threshold`, `rootMargin` and `once`. A server renders the element shown, so the entrance can flash when the script runs. To avoid the flash, start with `when` false and set it to true later.
- `threshold: 1` never reveals an element that is taller than the viewport plus its `rootMargin`. A negative `rootMargin` never reveals an element at the end of the page that cannot scroll into the shrunk area.
- `data-reveal` is reserved. Do not use it for other data.
- `stagger` cannot animate framework islands that are direct children, because `<astro-island>` has `display: contents`, so it has no box to fade or move. Put each island in an element.
- Keep `reducedMotion` at `"user"` unless the user asks for a different behavior. It respects the operating system setting of people whom motion makes ill.
- While the element is hidden, its `opacity` is `0`, also over an `opacity` of your own. The reveal restores your inline `opacity`.
