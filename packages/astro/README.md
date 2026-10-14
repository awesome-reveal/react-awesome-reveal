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

`when: true` reveals the element manually, and `when: false` resets it. With `null` or `undefined`, the viewport controls the reveal. After the page loads, you can change it with the `when` property of the host element. The host has a `revealed` property. When the rendered tag reveals, it dispatches a `reveal` event that bubbles.

```ts
const host = document.querySelector("awesome-reveal");
if (host) host.when = true;
```

## Cascade

`Cascade` works like `Reveal`, but it animates each direct child element in turn when the element enters the viewport. `interval` sets the milliseconds between two children, and the default is 80. The first child starts immediately. The host element has a `cascade` attribute, and the `reveal` event comes from the rendered tag.

- It reads the children when the container reveals. A child that you add after the reveal shows with no animation.
- Only the direct element children animate. Text and children with `display: contents` show immediately.
- A framework island and the host of a nested `Reveal` have `display: contents`, so the cascade does not animate them. A nested `Reveal` plays only its own entrance. To put an island in the cascade, wrap it in an element.
- For a long list, reveal each item separately. A cascade has one observer, so the children below the viewport animate before you scroll to them.

## SSR and accessibility

The server markup has `data-reveal="hidden"`, or `data-reveal="cascade"` for a cascade. The package stylesheet hides this element, or the direct children of a cascade, until the client script runs. The stylesheet shows the content for reduced motion, for print, and when scripting is off. Reduced motion cancels the pending and the active animations. The component does not use an inline `style` attribute.

Reveals work after a ClientRouter navigation, in server islands and with `transition:persist`. A prerendered page does not animate until the browser activates it. If the client script fails while JavaScript is on, the content can stay hidden. See [Recover when the script fails](#recover-when-the-script-fails).

### Recover when the script fails

The stylesheet does not show the content when a script fails or a blocker stops it, because the browser still runs scripts. To show the content in this case, put this script in the document head:

```html
<script>
  setTimeout(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-reveal-ready")) html.setAttribute("data-reveal-failed", "");
  }, 5000);
</script>
```

The package sets `data-reveal-ready` on `<html>` when it attaches the first element. If the attribute is not there after the timeout, the script sets `data-reveal-failed`, and the stylesheet shows the hidden elements.

- Use a timeout that is longer than the load time of your script on a slow network.
- The script does not cover code that loads later and fails, such as a dynamic `import()`.
- With a strict Content Security Policy, give the `<script>` a `nonce`, or allow its hash.

### Limits

- The `scripting: none` rule needs Chrome 120, Firefox 113 or Safari 17. In older browsers, the content stays hidden when JavaScript is off.
- The stylesheet does not reach a shadow root, so it does not hide an element in a shadow root before the reveal.
- Do not give a hidden element an inline `opacity` with `!important`. It wins over the stylesheet, so the element shows before the reveal.
- Hidden content stays focusable. A focused control can stay hidden when `when` is `false` or `threshold` is high. Do not hide the only way to a control.

## Agent skills and license

The package includes the `adding-reveal-animations` agent skill. The license is MIT.
