---
layout: ../../layouts/DocLayout.astro
title: Revealing Effects
order: 2
---

# Revealing Effects

**React Awesome Reveal** exports a number of ready-to-use animated primitives to automagically :sparkles: animate your components.

By default, all animations are triggered when the content they wrap enters the viewport.

## Available Effects

The default set of effects is inspired by [Animate.css](https://animate.style):

- `Bounce`
- `Fade`
- `Flip`
- `Hinge`
- `JackInTheBox`
- `Roll`
- `Rotate`
- `Slide`
- `Zoom`

Each of them is a named export, so to import the `Slide` component you simply write:

```ts
import { Slide } from "react-awesome-reveal";
```

## Staggered Animations

To chain together multiple animations, set the `cascade` prop to `true`:

```tsx
<Fade cascade>
  <p>I enter first...</p>
  <p>...then comes my turn...</p>
  <p>...and finally you see me!</p>
</Fade>
```

This is _almost_ equivalent to

```tsx
<Fade>
  <p>I enter first...</p>
</Fade>
<Fade delay={1000}>
  <p>...then comes my turn...</p>
</Fade>
<Fade delay={2000}>
  <p>...and finally you see me!</p>
</Fade>
```

with the exception that, since each `Fade` component creates an isolated visibility context, in the second snippet every `p` will be shown only if it is inside the viewport (after the specified delay).
