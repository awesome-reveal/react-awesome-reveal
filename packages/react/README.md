# @awesome-reveal/react

`@awesome-reveal/react` adds reveal-on-scroll animations to React 18 and 19. The package loads its stylesheet automatically. Only an Astro island and the Next.js Pages Router with webpack need a [setup step](#stylesheet).

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

## Stylesheet

The modules of the package import its stylesheet. On the server, the `node` import condition resolves this import to an empty module, and the browser build resolves it to the CSS. A client bundler, such as Vite or the Next.js App Router, adds the CSS to the page, so you do not import it. Two setups need a step:

- **Astro island.** Astro collects the CSS of a page from the server build, so it does not get the stylesheet. Import the stylesheet in the page or in the layout that renders the island:

  ```astro
  ---
  import "@awesome-reveal/react/reveal.css";
  ---
  ```

- **Next.js Pages Router with webpack.** Next.js does not let a package in `node_modules` import global CSS, and the build fails. Add the package to `transpilePackages`, so that Next.js bundles it:

  ```js
  // next.config.mjs
  export default { transpilePackages: ["@awesome-reveal/react"] };
  ```

  The App Router and Turbopack need no step.

## Component and hook

`Reveal` renders one element around its children. `as` sets the tag, and the component passes the other attributes and `ref` to the element. It accepts the [core reveal options](https://www.npmjs.com/package/@awesome-reveal/core), and also `when` and `onReveal`.

`delay` sets the time between the reveal and the entrance, in milliseconds. The default is 0. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly.

To animate your own element without a wrapper, use `useReveal`:

```tsx
import { useReveal } from "@awesome-reveal/react";

export function Card() {
  const { getProps, revealed } = useReveal<HTMLElement>({ from: "left", threshold: 0.3 });
  return <article {...getProps({ className: "card" })}>{revealed ? "Hello" : "Waiting"}</article>;
}
```

Spread `getProps()` on one element. Give your own `ref` to `getProps()`, so that the hook can merge it with its ref. The hook does not change your styles. For a custom component, pass the ref and the `data-awesome-reveal` prop to a DOM element. The package reserves `data-awesome-reveal` and `data-awesome-reveal-attached`.

`when: true` reveals the element manually, and `when: false` resets the entrance without an exit animation. To let the viewport control the reveal, omit `when` or set it to `null`. When the viewport controls the reveal, the entrance plays one time, and the observation stops at the reveal. A change of `when` from `false` to `true` plays the entrance again. `when: false` during the `delay` also resets the entrance, and the entrance does not play.

`when` controls the entrance. It does not show or hide content. With `when: false`, the element is transparent. Screen readers still read it, and the keyboard can focus its controls. To hide content, use the `hidden` attribute, or do not render it. `inert` does not hide the element. It only blocks focus, clicks and assistive technology. The example below adds `hidden`.

`onReveal` gets the element one time for each reveal, also in React StrictMode. A change to `when` or `threshold` applies immediately. A change to the other options applies at the next reveal.

```tsx
import { useState } from "react";
import { Reveal } from "@awesome-reveal/react";

export function Details() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-expanded={open} onClick={() => setOpen(!open)}>
        Toggle
      </button>
      <Reveal when={open} hidden={!open} from={{ opacity: 0 }}>
        Details
      </Reveal>
    </>
  );
}
```

## Cascade

`Cascade` works like `Reveal`, but it animates each direct child element in sequence when the element enters the viewport. `interval` sets the time between the entrances of two children, in milliseconds, and the default is 80. `delay` moves the start of the whole sequence: the first child starts after `delay`, and `interval` spaces the other children. `useCascade` does the same for your own element. The cascade observes the container, and `onReveal` gets the container.

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
- Do not put a reveal directly inside a cascade. The two entrances combine on the same element.
- For a long or a virtualized list, reveal each item separately. A cascade has one observer, so the children below the viewport animate before you scroll to them.
- A component that returns a fragment gives one child for each element of the fragment.

## SSR and accessibility

The server markup has `data-awesome-reveal="hidden"`, or `data-awesome-reveal="cascade"` for a cascade. The package stylesheet hides this element, or the direct children of a cascade, until it reveals. The stylesheet shows the content in these cases:

- The user prefers reduced motion.
- The user prints the page.
- JavaScript is off.

Reduced motion always has priority over the entrance and over `when: false`.

`Reveal` and `Cascade` are Client Component boundaries, so a Next.js Server Component can render them with serializable options. Native keyframes are serializable too. The hook and the callbacks need a Client Component.

The stylesheet hides the server markup for at most 5 seconds before the script attaches the element. At the attach, the package adds `data-awesome-reveal-attached` to the element, and the element stays hidden until it reveals. So if the script fails, the content shows after 5 seconds. If the attach happens after the 5 seconds, the element shows, then hides again until it reveals. This happens with slow hydration, and often with lazy hydration, such as an Astro `client:visible` island, when the user scrolls to the content after 5 seconds. Hydrate reveal content eagerly.

### Limits

- The stylesheet does not reach a shadow root, so it does not hide an element in a shadow root before the reveal.
- Do not give a hidden element an inline `opacity` with `!important`. It has priority over the stylesheet, so the element shows before the reveal.
- The stylesheet hides with the `awesome-reveal-hold` CSS animation, which replaces your own `animation` on a hidden element or cascade child until it reveals. If no script reveals the element, such as when the script fails or JavaScript is off, your animation does not run. Put your own animation on an inner element.
- An `animation` of your own with `!important` can have priority over the hold. Then the element shows until the script attaches it. The hold fires `animationstart` and `animationend` events, and shows in `getAnimations()`.
- Focus in a waiting element shows it at once, with no entrance, but not with `when: false`. Focus during a running entrance or its delay does not shorten it, so keep `delay` and `interval` short.
- In browsers without the `scripting` media feature, such as Safari 16, content shows after 5 seconds when JavaScript is off.

## Migrating from v4

1. Upgrade `react-awesome-reveal` to version 5, or install this package.
2. If no other code uses Emotion, remove it.
3. Import `Reveal` as a named export. v4 also had a default export.
4. Replace each effect component with `Reveal`:
   - For a fade, use `from={{ opacity: 0 }}`.
   - For directional motion, set `from` to the side where the element starts. The v4 `up` becomes `from="bottom"`, and `down` becomes `from="top"`.
   - For a more complex effect, use native keyframes.
5. Replace `fraction` with `threshold`.
6. Remove `triggerOnce`. In v4 the entrance played each time by default, but now it plays one time. To play it again, set `when` to `false`, then to `true`.
7. Replace `cascade` with the `Cascade` component. Set `interval` to the v4 `duration * damping`, in milliseconds.
8. Write the text children yourself. The library does not split text.

The default duration is 600 ms, and v4 used 1000 ms. The default side is `bottom`. A v4 `<Reveal>` with no `keyframes` entered from the left. To keep that motion, give it `from={{ opacity: 0, x: "-100%" }}`. `Reveal` renders one element around all its children, and v4 wrapped each element child in a `div`. The `migrating-from-v4` skill lists all the changes.

## Agent skills and license

The package includes the `adding-reveal-animations` and `migrating-from-v4` agent skills. The license is MIT.
