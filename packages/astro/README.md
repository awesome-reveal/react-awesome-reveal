# @awesome-reveal/astro

`@awesome-reveal/astro` adds reveal-on-scroll animations to Astro 6 and 7. It loads its stylesheet and a small client script automatically.

```sh
npm install @awesome-reveal/astro
```

```astro
---
import { Cascade, Reveal } from "@awesome-reveal/astro";
---
<Reveal from="left"><p>Hello</p></Reveal>
<Reveal from={{ opacity: 0 }} duration={500}>Pure fade</Reveal>
<Reveal keyframes={[{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "scale(1)" }]}>Native keyframes</Reveal>
<Cascade as="ul" interval={120}><li>Fast</li><li>Small</li></Cascade>
```

## Component

`Reveal` renders the tag that `as` sets (the default is `div`) inside an `awesome-reveal` host element with `display: contents`. The component passes the attributes and the children to this tag. It accepts the serializable [core reveal options](https://www.npmjs.com/package/@awesome-reveal/core) and `when`. You do not need a hydration directive or a stylesheet import.

`as` accepts a `RevealTag`: an HTML tag or `svg`. TypeScript rejects document tags (`html`, `head`, `body`), table parts (`caption`, `col`, `colgroup`, `thead`, `tbody`, `tfoot`, `tr`, `td`, `th`) and SVG-only tags, because the HTML parser does not keep them inside the host. Reveal the whole `table` instead, or reveal content inside a table cell.

Do not put `Reveal` or `Cascade` directly in a `<table>`, a table section, a row or a `<select>`. The HTML parser moves the host before the table, or drops it. In a `<p>`, also inline in MDX text, use an inline tag such as `as="span"`. The parser moves a block tag, such as the default `div`, out of the host. The host then reports an error in the browser console, and the tag shows without an entrance after a few seconds.

```astro
<Reveal as="table">
  <tbody>
    <tr><td>The whole table reveals together.</td></tr>
  </tbody>
</Reveal>
```

`delay` sets the time between the reveal and the entrance, in milliseconds. The default is 0. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly.

`when: true` reveals the element manually, and `when: false` resets the entrance, also during the `delay`. With `null` or `undefined`, the viewport controls the reveal. After the page loads, you can change it with the `when` property of the host element. The host has a `revealed` property. When the rendered tag reveals, it dispatches a `reveal` event that bubbles. In the example below, the type import adds the `awesome-reveal` element to the DOM types.

`when` controls the entrance. It does not show or hide content. With `when: false`, the element is transparent. Screen readers still read it, and the keyboard can focus its controls. To hide content, use the `hidden` attribute on the rendered tag, or do not render it. `inert` does not hide the element. It only blocks focus, clicks and assistive technology.

```ts
import type {} from "@awesome-reveal/astro";

const host = document.querySelector("awesome-reveal");
if (host) host.when = true;
```

The `reveal` event fires one time for each reveal, when the reveal starts, not when the entrance ends. It also fires when no entrance plays, for example with reduced motion or focus. After `when: false`, the next reveal fires it again. With reduced motion, `when: false` does not reset the reveal, so the event does not fire again.

To wait for the end of the entrance, use the `finished` promises of the animations of the event `target`. The promise waits for each animation of the element and of its descendants, also your own animations, so use it on an element that has no other animations. It resolves at once when no entrance plays. It rejects when the entrance stops early, for example after `when: false`. Catch the rejection, or the browser reports an unhandled rejection.

```ts
document.addEventListener("reveal", (event) => {
  const element = event.target as Element;
  Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished))
    .then(() => element.classList.add("entered"))
    .catch(() => {});
});
```

## Cascade

`Cascade` works like `Reveal`, but it animates each direct child element in sequence when the element enters the viewport. `interval` sets the time between the entrances of two children, in milliseconds, and the default is 80. `delay` moves the start of the whole sequence: the first child starts after `delay`, and `interval` spaces the other children. The host element has a `cascade` attribute, and the `reveal` event comes from the rendered tag.

- It reads the children when the container reveals. A child that you add after the reveal shows with no animation.
- Only the direct element children animate. Text and children with `display: contents` show immediately.
- A framework island and the host of a nested `Reveal` have `display: contents`, so the cascade does not animate them. A nested `Reveal` plays only its own entrance. To put an island in the cascade, wrap it in an element.
- A cascade schedules all children when its container enters the viewport, so the last children of a long list start late or out of view. For a long list, or a grid that is taller than the viewport, use `Reveal` on each item.

## SSR and accessibility

The server markup has `data-awesome-reveal="hidden"`, or `data-awesome-reveal="cascade"` for a cascade. The package stylesheet hides this element, or the direct children of a cascade, until it reveals. The stylesheet shows the content in these cases:

- The user prefers reduced motion.
- The user prints the page.
- JavaScript is off.

Reduced motion cancels the pending and the active animations. The component does not use an inline `style` attribute.

Reveals work in these cases:

- after a ClientRouter navigation
- in server islands
- with `transition:persist`

A prerendered page does not animate until the browser activates it.

The stylesheet hides the server markup for at most 5 seconds before the client script attaches the element. At the attach, the package adds `data-awesome-reveal-attached` to the element, and the element stays hidden until it reveals. So if the client script fails, the content shows after 5 seconds. If the attach happens after the 5 seconds, the element shows, then hides again until it reveals. This can happen when the client script loads slowly, for example on a slow network.

### Content Security Policy

The package writes no `style` attribute, no inline script and no CSS at runtime. The entrance uses `element.animate()`, which CSP does not restrict. But Astro can put the package stylesheet, and your small scripts, inline in the HTML. Use one of these setups:

- Set `security.csp: true`. Astro then adds a `<meta>` policy with hashes for the inline styles and scripts that it emits. Astro adds the policy only to the build, so use `astro build` and `astro preview` to check it. Astro does not support this option with the `<ClientRouter />`.
- Send your own policy, such as `style-src 'self'; script-src 'self'`, and set `build.inlineStylesheets: 'never'`. With the default `'auto'`, Astro puts stylesheets smaller than `vite.build.assetsInlineLimit` (4 kB by default) in a `<style>` element. If the package stylesheet is inline, the policy blocks it. Then the content does not hide before the reveal, and the host element is not `display: contents`. Also make sure that the built HTML has no inline `<script>` that your policy blocks.

### Limits

- The stylesheet does not reach a shadow root, so it does not hide an element in a shadow root before the reveal.
- Do not give a hidden element an inline `opacity` with `!important`. It has priority over the stylesheet, so the element shows before the reveal.
- The stylesheet hides with the `awesome-reveal-hold` CSS animation, which replaces your own `animation` on a hidden element or cascade child until it reveals. If no script reveals the element, such as when the script fails or JavaScript is off, your animation does not run. Put your own animation on an inner element.
- An `animation` of your own with `!important` can have priority over the hold. Then the element shows until the script attaches it. The hold fires `animationstart` and `animationend` events, and shows in `getAnimations()`.
- Focus in a waiting element shows it at once, with no entrance, but not with `when: false`. Focus during a running entrance or its delay does not shorten it, so keep `delay` and `interval` short.
- In browsers without the `scripting` media feature, such as Safari 16, content shows after 5 seconds when JavaScript is off.

## Agent skills and license

The package includes the `adding-reveal-animations` agent skill. The license is MIT.
