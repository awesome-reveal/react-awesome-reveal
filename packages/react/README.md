# @awesome-reveal/react

`@awesome-reveal/react` adds reveal-on-scroll animations to React 18 and 19. The package loads its stylesheet automatically, so you do not import CSS.

```sh
npm install @awesome-reveal/react
```

```tsx
import { Reveal } from "@awesome-reveal/react";

<Reveal from="left">
  <p>Hello</p>
</Reveal>;
<Reveal from={{ opacity: 0 }} duration={500}>
  Pure fade
</Reveal>;
<Reveal
  keyframes={[
    { opacity: 0, transform: "scale(.8)" },
    { opacity: 1, transform: "scale(1)" },
  ]}
>
  Native keyframes
</Reveal>;
```

## Component and hook

`Reveal` renders one element around its children. `as` sets the tag, and the component passes the other attributes and `ref` to the element. It accepts the [core reveal options](https://www.npmjs.com/package/@awesome-reveal/core), and also `when` and `onReveal`.

To animate your own element without a wrapper, use `useReveal`:

```tsx
import { useReveal } from "@awesome-reveal/react";

export function Card() {
  const { getProps, revealed } = useReveal<HTMLElement>({ from: "left", threshold: 0.3 });
  return <article {...getProps({ className: "card" })}>{revealed ? "Hello" : "Waiting"}</article>;
}
```

Spread `getProps()` on one element. Give your own `ref` to `getProps()`, so that the hook can merge it with its ref. The hook does not change your styles. For a custom component, forward the ref to a DOM element.

`when: true` reveals the element manually, and `when: false` resets it without an exit animation. To let the viewport control the reveal, omit `when` or set it to `null`. The entrance plays one time, and the observation stops when it starts. `onReveal` gets the element one time for each entrance, also in React StrictMode. A change to `when` or `threshold` applies immediately. A change to the animation options applies at the next entrance.

```tsx
import { useState } from "react";
import { Reveal } from "@awesome-reveal/react";

export function Details() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      <Reveal when={open} from={{ opacity: 0 }}>
        Details
      </Reveal>
    </>
  );
}
```

## Cascade

`Cascade` works like `Reveal`, but it animates each direct child element in turn when the element enters the viewport. `interval` sets the milliseconds between two children, and the default is 80. The first child starts immediately. `useCascade` does the same for your own element. The cascade observes the container, and `onReveal` gets the container.

```tsx
import { Cascade, useCascade } from "@awesome-reveal/react";

export const Features = () => (
  <Cascade as="ul" from="left" interval={120}>
    <li>Fast</li>
    <li>Small</li>
    <li>Accessible</li>
  </Cascade>
);

export function Steps() {
  const { getProps } = useCascade<HTMLOListElement>();
  return (
    <ol {...getProps()}>
      <li>Install</li>
      <li>Import</li>
    </ol>
  );
}
```

- It reads the children when the container reveals. A child that you add after the reveal shows with no animation.
- Only the direct element children animate. Text and children with `display: contents` show immediately.
- Do not put a reveal directly inside a cascade. The two entrances add up on the same element.
- For a long or a virtualized list, reveal each item separately. A cascade has one observer, so the children below the viewport animate before you scroll to them.
- A component that returns a fragment gives one child for each element of the fragment.

## SSR and accessibility

The server markup has `data-reveal="hidden"`, or `data-reveal="cascade"` for a cascade. The package stylesheet hides this element, or the direct children of a cascade, until hydration. The stylesheet shows the content for reduced motion, for print, and when scripting is off (`scripting: none`). Reduced motion always has priority over the animation and over `when: false`.

`Reveal` is a Client Component boundary, so a Next.js Server Component can render it with serializable options, also native keyframes. The hook and the callbacks need a Client Component. On the server, the `node` import condition resolves the internal stylesheet import to an empty module. The browser build resolves it to the CSS.

If hydration fails while JavaScript is on, the content can stay hidden. See [Recover when the script fails](#recover-when-the-script-fails).

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

## Migrating from v4

1. Upgrade `react-awesome-reveal` to version 5, or install this package.
2. If no other code uses Emotion, remove it.
3. Replace each effect component with `Reveal`:
   - For a fade, use `from={{ opacity: 0 }}`.
   - For directional motion, set `from` to a side.
   - For a more complex effect, use native keyframes.
4. Replace the viewport fractions with `threshold`.
5. Remove `triggerOnce`. In v4 the entrance played each time by default, but now it plays one time. To play it again, set `when` to `false`, then to `true`.
6. Replace `cascade` with the `Cascade` component, and set `interval` to the v4 `duration * damping` in milliseconds.
7. Write the text children yourself. The library does not split text.

The default duration is 600 ms, and the default direction is `bottom`.

## Agent skills and license

The package includes the `adding-reveal-animations` and `migrating-from-v4` agent skills. The license is MIT.
