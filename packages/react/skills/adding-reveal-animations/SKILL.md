---
name: adding-reveal-animations
description: Adds reveal-on-scroll animations with the Reveal and Cascade components and the useReveal and useCascade hooks of @awesome-reveal/react, and native Web Animations keyframes. Use when you animate React elements that enter the viewport.
license: MIT
compatibility: Requires @awesome-reveal/react and React 18 or 19.
---

# Add reveal animations

Use the `Reveal` component, or the `useReveal` hook for an element that you render. `Cascade` and `useCascade` reveal the children of an element in sequence. Spread all the props from `getProps()` on the element, and give your own `ref` to `getProps()`, so that the hook can merge it.

The package loads its stylesheet, which hides the content until it reveals. Do not import the stylesheet, except in these two setups:

- In an Astro island, add `import "@awesome-reveal/react/reveal.css";` to the frontmatter of the page or the layout that renders the island. Astro collects the CSS of a page from the server build, which does not import the stylesheet.
- In the Next.js Pages Router with webpack, add `"@awesome-reveal/react"` to `transpilePackages` in the Next.js config. Without it, the build fails with "Global CSS cannot be imported from within node_modules". The App Router and Turbopack need no step.

The stylesheet replaces a CSS `animation` of the hidden element or of a cascade child until the reveal, so put your own animation on an inner element. Do not set `data-awesome-reveal` yourself, because the package sets it. When you spread `getProps()` on a custom component, the component must pass `data-awesome-reveal` and the ref to its DOM element.

```tsx
import { Cascade, Reveal } from "@awesome-reveal/react";
<Reveal from="left">Hello</Reveal>;
<Cascade as="ul" interval={120}>
  <li>Fast</li>
  <li>Small</li>
</Cascade>;
```

Set `from` to `"top"`, `"right"`, `"bottom"` or `"left"` for an entrance that starts transparent and 24px away on that side. The defaults are `from: "bottom"`, `duration: 600` (milliseconds), `delay: 0` (milliseconds) and `threshold: 0`. Without `when`, the entrance plays one time.

Use `delay` to start separate elements at different times. During the delay, the element stays in its start state. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly.

An element that is too large to reach `threshold` in the viewport reveals when it enters. In a scroll container that is too small to show `threshold` of it, it reveals when it leaves the visible area. So keep `threshold` low for tall elements. Focus in a waiting element shows it at once, with no entrance, except with `when: false`.

A `from` object is the complete start state: `{ opacity: 0 }` is a pure fade, and `{ scale: 0.9 }` adds no fade and no movement. A number is in pixels for `x`, `y` and `blur`, and in degrees for `rotate`. A string can contain a CSS value with its unit. The entrance adds its offset, scale, rotation and blur to the element's own transforms and filter. It fades to the element's own opacity. So do not override these styles for the entrance.

For a custom animation, give native `Keyframe[]` in `keyframes`. Do not use `from` and `keyframes` together. Put the easing of each segment in its keyframe. End at the resting style of the element, because the animation does not keep its last keyframe. Animate `transform` and `opacity` when possible. Leave reduced motion to the package: it shows the content with no entrance when the user prefers reduced motion.

For a long list, reveal each item separately. For a short group, use `Cascade`, or `useCascade` on an element that you render. It animates the direct element children in sequence, `interval` milliseconds apart (default 80). The first child starts after `delay`, so `delay` moves the whole sequence. It takes the same options as `Reveal`, and also `interval`. Do not install `@awesome-reveal/core` for a cascade.

The cascade reads the children when the container reveals, so a child that you add later shows with no animation. To cascade words or sentences, wrap each one in an element in the markup. Give inline children `display: inline-block`, because a transform does not apply to an inline box. Do not put a `Reveal` directly inside a `Cascade`, because the two entrances combine. Do not collect deeper descendants to animate them.

Use `when` for manual control: `true` reveals the element and `false` resets the entrance. `null` or `undefined` returns the control to the viewport. `when` does not show or hide content. With `when: false`, the element is transparent, but screen readers still read it, and the keyboard can focus its controls. To hide content, add the `hidden` attribute, or do not render it. `inert` does not hide the element. It only blocks focus, clicks and assistive technology. With `when: true`, the server still renders the element hidden, and the entrance plays after hydration. `onReveal` gets the element one time for each reveal, or the container for a cascade. It runs also when no entrance plays, such as with reduced motion or focus.

The hooks need a Client Component. A Server Component can render `Reveal` and `Cascade`, but it cannot pass `onReveal` or a callback `ref`.

In the consumer project, check the build, the type check, the visibility before the reveal, reduced motion and the teardown.
