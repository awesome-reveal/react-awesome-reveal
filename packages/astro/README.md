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

- 🪶 **Tiny** – No third-party dependencies. The client script is about 1.4 kB gzipped. The keyframes run on the server, so they add nothing to it.
- 🧭 **Astro-native** – It works with the `<ClientRouter />`, server islands, `transition:persist` and prerendered pages.
- 🔒 **CSP-ready** – It works with `security.csp`. The server markup has no `style` attributes. Astro does not support `security.csp` with the `<ClientRouter />`.
- ⚙️ **Native APIs** – Intersection Observer detects the reveal. Web Animations run it on the compositor where possible.
- ♿ **Accessible** – It respects `prefers-reduced-motion` by default. Hidden content stays in the accessibility tree, and shows when JavaScript is off.
- 🏷 **TypeScript** – Strict types for the props, with the attributes of the tag that you choose.

## Installation

```sh
npm install @awesome-reveal/astro
```

Use `pnpm add`, `yarn add` or `bun add` in the same way.

Astro 6 or 7 is necessary. TypeScript needs `moduleResolution` set to `bundler`, `node16` or `nodenext`, because the package uses `exports` for `/keyframes`.

## Quick start

```astro
---
import { Reveal } from "@awesome-reveal/astro";
---

<Reveal>
  <p>I gently appear as I enter the viewport</p>
</Reveal>
```

With no `keyframes`, the element fades in and moves up, as with `slide()`. To choose another animation, see [Keyframes](#keyframes).

## Entry points

| Import path                       | Contents                                                                 |
| --------------------------------- | ------------------------------------------------------------------------ |
| `@awesome-reveal/astro`           | The `Reveal` component, and the `RevealProps` and `RevealOptions` types. |
| `@awesome-reveal/astro/keyframes` | The built-in keyframes, `defineKeyframes`, and their types.              |

## Keyframes

The `keyframes` prop takes the keyframes that a factory of `@awesome-reveal/astro/keyframes` returns, or a keyframes array:

```astro
---
import { Reveal } from "@awesome-reveal/astro";
import { enter, slide } from "@awesome-reveal/astro/keyframes";
---

<Reveal keyframes={slide({ direction: "left", distance: 40 })}>…</Reveal>
<Reveal keyframes={enter({ y: 40, scale: 0.9 })}>…</Reveal>
```

The factories run on the server, when Astro renders the page. The [`@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#keyframes) documents the built-in keyframes, `spring()`, `defineKeyframes` and keyframes arrays.

## The `Reveal` component

`Reveal` renders one element around its default slot. Use `as` to choose the tag. Other attributes go to that element:

```astro
<Reveal as="section" keyframes={slide()} class="hero" id="intro">…</Reveal>
```

`Reveal` is an Astro component. In a React or Vue island, use [`@awesome-reveal/react`](https://www.npmjs.com/package/@awesome-reveal/react) or [`@awesome-reveal/vue`](https://www.npmjs.com/package/@awesome-reveal/vue).

## Options

`Reveal` takes the [options of `@awesome-reveal/core`](https://www.npmjs.com/package/@awesome-reveal/core#options) as props. Examples are `keyframes`, `duration`, `stagger`, `once` and `when`.

## How it works

`Reveal` renders your element inside an `<awesome-reveal>` custom element with `display: contents`:

```html
<awesome-reveal options='{"duration":800}'>
  <section class="hero" data-reveal="hidden">…</section>
</awesome-reveal>
```

- The custom element reveals its first element child. One script, which Astro bundles and adds once to the page, defines it.
- `Reveal` writes the options into the `options` attribute as JSON. So pass only plain values. The keyframes factories return plain values.
- Each `Reveal` has its own copy of its options in the HTML. A built-in factory, such as `slide()`, adds about 100 to 200 bytes. A `defineKeyframes` factory with the default 30 steps adds about 3 kB, and `spring()` adds about 300 bytes. Gzip makes repeated copies small. For a long list, put one `Reveal` around the list and use `stagger`, so the options appear once.
- If the `options` attribute is not valid JSON when the element connects, the browser reports the error to the console, and the element reveals with the default options. If a later change is not valid JSON, the browser reports the error, and the previous options stay. A value that is `null`, a string or a number gives the default options.
- To change the options in the browser, set the `options` attribute to new JSON. The new value replaces all the options, so merge it with the current value. A change of `when` applies at once. A change of `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next reveal.
- The element starts hidden in the server markup, with `data-reveal="hidden"` and a stylesheet rule. The rule uses `!important`, so an inline `opacity` of your own does not show the element before the script runs. The reveal restores that inline `opacity`. The element has no `style` attribute, because the `security.csp` of Astro blocks style attributes.
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
    document.querySelector("#show")?.addEventListener("click", () => {
      const host = document.querySelector("#details")?.parentElement;
      const options = JSON.parse(host?.getAttribute("options") ?? "{}");
      host?.setAttribute("options", JSON.stringify({ ...options, when: true }));
    });
  });
</script>
```

A bundled script runs once. The `<ClientRouter />` fires `astro:page-load` on the first load and after each navigation, so the listener comes back on the new page. Without the router, run the code directly.

With `when`, your code controls the reveal, and nothing observes the viewport. `threshold`, `rootMargin` and `once` have no effect.

## Accessibility

- When the user prefers reduced motion, the element appears with no animation. Use `reducedMotion` to change this.
- Hidden content uses `opacity: 0` only. It stays in the accessibility tree and in the browser's find-in-page. Links and buttons in it stay focusable and clickable.
- The stylesheet rule that hides the element applies only in `@media (scripting: enabled)`. When JavaScript is off, the content shows. You do not need the `<noscript>` CSS of the other adapters.
- Elements that are not revealed yet stay invisible on a printed page. Add the print rule of the [`@awesome-reveal/core` README](https://www.npmjs.com/package/@awesome-reveal/core#server-markup-javascript-off-and-print) to your stylesheet. The hidden rule has no specificity, so the print rule overrides it.
- `data-reveal` is reserved. The reveal sets it on hidden elements, and removes it at the reveal.
- If the script fails or a blocker stops it, the content stays hidden, because scripting is enabled. Use the [recovery recipe](https://www.npmjs.com/package/@awesome-reveal/core#recover-when-the-script-fails) of the core README. Check `customElements.get("awesome-reveal")` in its timeout, in place of the `data-reveal-ready` attribute, and add `is:inline` to its `<style>` and `<script>`, so that Astro does not scope or bundle them. With `security.csp`, allow the two inline tags with `Astro.csp.insertStyleHash()` and `Astro.csp.insertScriptHash()`.

## Browser support

Chrome 84, Firefox 75 (79 on Android) and Safari 13.1, or later. Read [Browser support](https://www.npmjs.com/package/@awesome-reveal/core#browser-support) for the fallbacks.

The `scripting` media feature needs Chrome 120, Firefox 113 or Safari 17. In older browsers, the stylesheet rule does not apply. The element then shows until the script hides it, and the reveal animation plays as usual.

## Agent skills

This package ships the `adding-reveal-animations` agent skill, which helps a coding agent add reveal animations to your project. pnpm 12.11 or later links it into your agent folders after you run `pnpm approve`.

## Support

- Report a bug in the [issue tracker](https://github.com/awesome-reveal/awesome-reveal/issues).
- Ask a question or suggest a feature in [Discussions](https://github.com/awesome-reveal/awesome-reveal/discussions).
- Read the [changelog](https://github.com/awesome-reveal/awesome-reveal/blob/next/packages/astro/CHANGELOG.md) for the changes of each release.
- If you like this library, [consider supporting its creator](https://github.com/sponsors/morellodev).

## License

MIT
