# @awesome-reveal/astro

[![npm version](https://badgen.net/npm/v/@awesome-reveal/astro)](https://www.npmjs.com/package/@awesome-reveal/astro)
[![npm downloads](https://badgen.net/npm/dt/@awesome-reveal/astro)](https://www.npmjs.com/package/@awesome-reveal/astro)
[![Types](https://badgen.net/npm/types/@awesome-reveal/astro)](https://www.npmjs.com/package/@awesome-reveal/astro)
[![License](https://badgen.net/npm/license/@awesome-reveal/astro)](https://www.npmjs.com/package/@awesome-reveal/astro)

[awesome-reveal](https://awesome-reveal.morello.dev) adds reveal-on-scroll animations to Astro sites. It uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to animate it.

<p align="center"><img src="https://raw.githubusercontent.com/awesome-reveal/awesome-reveal/next/.github/assets/demo.gif" alt="Elements fade, slide, scale and blur in as the page scrolls" width="640"></p>

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Entry points](#entry-points)
- [Entrance](#entrance)
- [Keyframes](#keyframes)
- [The `Reveal` component](#the-reveal-component)
- [Options](#options)
- [How it works](#how-it-works)
- [Recipes](#recipes)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Agent skills](#agent-skills)
- [Support](#support)
- [License](#license)

## Features

- 🪶 **Tiny** – No third-party dependencies. The client script is about 2.1 kB gzipped. The keyframes run on the server, so they add nothing to it.
- 🧭 **Astro-native** – It works with the `<ClientRouter />`, server islands, `transition:persist` and prerendered pages.
- 🔒 **CSP-ready** – It works with `security.csp`. The server markup has no `style` attributes. Astro does not support `security.csp` with the `<ClientRouter />`.
- ⚙️ **Native APIs** – Intersection Observer detects the reveal. Web Animations run it on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree, and shows when JavaScript is off in current browsers.
- 🏷 **TypeScript** – Strict types for the props, with the attributes of the tag that you choose.

## Installation

```sh
npm install @awesome-reveal/astro
```

Use `pnpm add`, `yarn add` or `bun add` in the same way.

Astro 6 or 7 is necessary. TypeScript needs `moduleResolution` set to `bundler`, `node16` or `nodenext`, because the package uses `exports` for its entry points.

## Quick start

```astro
---
import { Reveal } from "@awesome-reveal/astro";
---

<Reveal>
  <p>I gently appear as I enter the viewport</p>
</Reveal>

<Reveal from="left">
  <p>I come from the left</p>
</Reveal>
```

With no options, the element fades in and moves up. To change the entrance, see [Entrance](#entrance). `Reveal` adds the stylesheet that hides the elements, so you do not import a CSS file.

## Entry points

| Import path                       | Contents                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `@awesome-reveal/astro`           | The `Reveal` component, the keyframes, and the `RevealProps` and `RevealOptions` types. |
| `@awesome-reveal/astro/keyframes` | Only the built-in keyframes, `defineKeyframes`, and their types.                        |

## Entrance

The `from`, `distance`, `easing` and `bounce` props set the entrance:

```astro
---
import { Reveal } from "@awesome-reveal/astro";
---

<Reveal from="left" distance={40}>…</Reveal>
<Reveal from={{ scale: 0.9, blur: 8 }} bounce={0.4}>…</Reveal>
```

`from` is a side (`"top"`, `"bottom"`, `"left"` or `"right"`) or a start state. The [Entrance options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#entrance) describe them. `easing="spring"` and `bounce` resolve in the browser.

## Keyframes

For an animation that the entrance props cannot give, set `keyframes`. It takes the keyframes that a factory returns, or a keyframes array:

```astro
---
import { Reveal, enter, slide } from "@awesome-reveal/astro";
---

<Reveal keyframes={slide({ from: "left", distance: 40 })}>…</Reveal>
<Reveal keyframes={enter({ y: 40, rotate: -5 })}>…</Reveal>
```

The factories run on the server, when Astro renders the page. So prefer `easing="spring"` to `spring()`, which can check the browser support only in the browser. The [`@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#keyframes) documents the built-in keyframes, `spring()`, `defineKeyframes` and keyframes arrays.

## The `Reveal` component

`Reveal` renders one element around its default slot. Use `as` to choose the tag. Other attributes go to that element:

```astro
<Reveal as="section" from="left" class="hero" id="intro">…</Reveal>
```

`Reveal` is an Astro component. In a React or Vue island, use [`@awesome-reveal/react`](https://www.npmjs.com/package/@awesome-reveal/react) or [`@awesome-reveal/vue`](https://www.npmjs.com/package/@awesome-reveal/vue).

## Options

`Reveal` takes the [options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#options) as props, except `onReveal`. Examples are `from`, `duration`, `stagger`, `once` and `when`. To run code at each reveal, listen to the `reveal` event (see [Reveal from a script](#reveal-from-a-script)).

With `when` set to `true`, the server renders the element hidden, and the entrance plays when the script starts.

## How it works

`Reveal` renders your element inside an `<awesome-reveal>` custom element with `display: contents`:

```html
<awesome-reveal options='{"duration":800}' when="false">
  <section class="hero" data-reveal="hidden">…</section>
</awesome-reveal>
```

- The custom element reveals its first element child. One script, which Astro bundles and adds once to the page, defines it.
- `Reveal` writes `when` into the `when` attribute, and the other options into the `options` attribute as JSON. So pass only plain values. The keyframes factories return plain values.
- Each `Reveal` has its own copy of its options in the HTML. The entrance props add a few bytes. A built-in factory, such as `slide()`, adds about 100 to 200 bytes. A `defineKeyframes` factory with the default 30 steps adds about 3 kB, and `spring()` adds about 300 bytes. Gzip makes repeated copies small. For a long list, put one `Reveal` around the list and use `stagger`, so the options appear once.
- If the `options` attribute is not valid JSON when the element connects, the browser reports the error to the console, and the element reveals with the default options. If a later change is not valid JSON, the browser reports the error, and the previous options stay. A value that is `null`, a string or a number gives the default options.
- To change the other options in the browser, set the `options` attribute to new JSON. The new value replaces all the options, so merge it with the current value. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal.
- The element starts hidden in the server markup, with `data-reveal="hidden"`. The `reveal.css` of `@awesome-reveal/core`, which `Reveal` imports, hides it with `opacity: 0 !important`. Your inline `opacity` applies after the reveal. The element has no `style` attribute, because the `security.csp` of Astro blocks style attributes.
- It works with the `<ClientRouter />` and with server islands, because the custom element starts when it enters the page. A `transition:persist` element keeps its state, and does not play again after a navigation. You can put `transition:persist` on `Reveal` or on an ancestor.
- On a page that the browser prerenders, the animation waits until the user opens the page.

Do not put `Reveal` directly in a `<table>`, `<tbody>` or `<tr>`. The HTML parser moves the `<awesome-reveal>` element out of the table. Put `Reveal` around the table, or inside a cell.

## Recipes

### Lists

```astro
<Reveal as="ul" keyframes={slide()} stagger={80}>
  {items.map((item) => <li>{item.name}</li>)}
</Reveal>
```

`stagger` animates element children only. Transforms do not apply to non-replaced inline elements, such as `span` or `a`, so give these children `display: inline-block`. With an inline `as` tag, `Reveal` itself also needs `display: inline-block`, or it only fades. `stagger` cannot animate framework islands that are direct children, because `<astro-island>` has `display: contents`, so it has no box to fade or move. Put each island in an element.

### Reveal from a script

```astro
<button id="show">Show</button>
<Reveal id="details" when={false}>…</Reveal>

<script>
  document.addEventListener("astro:page-load", () => {
    const host = document.querySelector("#details")?.closest("awesome-reveal");
    host?.addEventListener("reveal", (event) => console.log("revealed", event.target));
    document.querySelector("#show")?.addEventListener("click", () => {
      if (host) host.when = true;
    });
  });
</script>
```

The `<awesome-reveal>` element has these members:

- `when`: `true` reveals, `false` hides, and `null` gives the control to the viewport. It is the same as the `when` attribute.
- `revealed`: `true` while the element is revealed.

The element that you render dispatches a `reveal` event, which bubbles, each time it is revealed.

A bundled script runs once. The `<ClientRouter />` fires `astro:page-load` on the first load and after each navigation, so the listener comes back on the new page. Without the router, run the code directly.

With `when`, your code controls the reveal, and nothing observes the viewport. `threshold`, `rootMargin` and `once` have no effect.

## Accessibility

- When the user prefers reduced motion, the element appears with no animation. Use `reducedMotion` to change this.
- Hidden content uses `opacity: 0` only. It stays in the accessibility tree and in the browser's find-in-page. Links and buttons in it stay focusable and clickable.
- `data-reveal` is reserved. The reveal sets it on hidden elements, and removes it at the reveal.
- The stylesheet shows the hidden elements when JavaScript is off, in Chrome 120, Firefox 113 and Safari 17 or later, and in print. You do not need a `<noscript>` or a print style.
- If the script fails or a blocker stops it, the content stays hidden. To show it after a timeout, put this script in the document head. When the `<awesome-reveal>` element is not defined in time, the script sets `data-reveal-failed` on `<html>`, and the stylesheet shows the hidden elements. `is:inline` keeps Astro from bundling the script. Use a timeout that is longer than the load time of the script on a slow network. With `security.csp`, allow the inline script with `Astro.csp.insertScriptHash()`.

```astro
<script is:inline>
  setTimeout(() => {
    if (!customElements.get("awesome-reveal")) document.documentElement.setAttribute("data-reveal-failed", "");
  }, 5000);
</script>
```

The script checks the custom element, not the `data-reveal-ready` attribute of the [core recipe](https://www.npmjs.com/package/@awesome-reveal/core#recover-when-the-script-fails). On a prerendered page, the custom element waits until the user opens the page, so the attribute can come late.

## Browser support

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later. Read [Browser support](https://www.npmjs.com/package/@awesome-reveal/core#browser-support) for the fallbacks.

The `scripting` media feature needs Chrome 120, Firefox 113 or Safari 17. In older browsers, the content stays hidden when JavaScript is off.

## Agent skills

This package ships the `adding-reveal-animations` agent skill, which helps a coding agent add reveal animations to your project. pnpm 12.11 or later links it into your agent folders after you run `pnpm approve`.

## Support

- Report a bug in the [issue tracker](https://github.com/awesome-reveal/awesome-reveal/issues).
- Ask a question or suggest a feature in [Discussions](https://github.com/awesome-reveal/awesome-reveal/discussions).
- Read the [changelog](https://github.com/awesome-reveal/awesome-reveal/blob/next/packages/astro/CHANGELOG.md) for the changes of each release.
- If you like this library, [consider supporting its creator](https://github.com/sponsors/morellodev).

## License

MIT
