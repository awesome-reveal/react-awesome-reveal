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

`delay` sets the time between the reveal and the entrance, in milliseconds. The default is 0. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly.

`when: true` reveals the element manually, and `when: false` resets it, also during the `delay`. With `null` or `undefined`, the viewport controls the reveal. After the page loads, you can change it with the `when` property of the host element. The host has a `revealed` property. When the rendered tag reveals, it dispatches a `reveal` event that bubbles.

```ts
const host = document.querySelector("awesome-reveal");
if (host) host.when = true;
```

## Cascade

`Cascade` works like `Reveal`, but it animates each direct child element in sequence when the element enters the viewport. `interval` sets the time between the entrances of two children, in milliseconds, and the default is 80. `delay` moves the start of the whole sequence: the first child starts after `delay`, and `interval` spaces the other children. The host element has a `cascade` attribute, and the `reveal` event comes from the rendered tag.

- It reads the children when the container reveals. A child that you add after the reveal shows with no animation.
- Only the direct element children animate. Text and children with `display: contents` show immediately.
- A framework island and the host of a nested `Reveal` have `display: contents`, so the cascade does not animate them. A nested `Reveal` plays only its own entrance. To put an island in the cascade, wrap it in an element.
- For a long list, reveal each item separately. A cascade has one observer, so the children below the viewport animate before you scroll to them.

## SSR and accessibility

The server markup has `data-awesome-reveal="hidden"`, or `data-awesome-reveal="cascade"` for a cascade. The package stylesheet hides this element, or the direct children of a cascade, until the client script runs. The stylesheet shows the content in these cases:

- The user prefers reduced motion.
- The user prints the page.
- JavaScript is off.

Reduced motion cancels the pending and the active animations. The component does not use an inline `style` attribute.

Reveals work in these cases:

- after a ClientRouter navigation
- in server islands
- with `transition:persist`

A prerendered page does not animate until the browser activates it.

The stylesheet hides the server markup for at most 5 seconds before the client script attaches the element. When it attaches the element, it adds `data-awesome-reveal-ready`, and the element stays hidden until it reveals. So if the client script fails, the content shows after 5 seconds. If the attach happens after the 5 seconds, the element shows, then hides again and plays its entrance. This can happen when the client script loads slowly, for example on a slow network.

### Limits

- The stylesheet does not reach a shadow root, so it does not hide an element in a shadow root before the reveal.
- Do not give a hidden element an inline `opacity` with `!important`. It has priority over the stylesheet, so the element shows before the reveal.
- The stylesheet hides with the `awesome-reveal-hold` CSS animation, which replaces your own `animation` on a hidden element until it reveals. An `animation` with `!important` of your own stops the hold. The hold fires `animationstart` and `animationend` events, and shows in `getAnimations()`.
- Focus in a hidden element reveals it, but not with `when: false`. Do not hide the only way to a control with `when: false`.

## Agent skills and license

The package includes the `adding-reveal-animations` agent skill. The license is MIT.
