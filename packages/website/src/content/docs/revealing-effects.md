---
title: Revealing Effects
sortOrder: 2
---

**React Awesome Reveal** exports a number of ready-to-use animated primitives to automagically :sparkles: animate your components.

By default, all animations are triggered when the content they wrap enters the viewport.

## Available Effects

The default set of effect is inspired by [Animate.css](https://animate.style):

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

## Animation Props

All animated primitives support the following props to change the animation physics.

### `direction`

Where applicable, this changes the origin of the animation. It can be `"down"`, `"left"`, `"right"` or `"up"`, with some exceptions documented in the component API (see the TSDoc comments).

### `delay`

Time to wait before the animation starts (in _milliseconds_).

Defaults to `0`.

### `duration`

The animation duration (in _milliseconds_).

Defaults to `1000` (one second).

### `fraction`

How much an element should be in the viewport before the animation is triggered.

It must be a number between `0` and `1`, with `0` meaning that the animation starts as soon as the component intersects the vieport, and `1` meaning that the animation does not start unless the component is fully contained in the viewport.

Defaults to `0`.

### `triggerOnce`

Boolean prop that determines if the animation should run only once or everytime an element enters/exits/re-enters the viewport.

Defaults to `false`.

### `cascade`

Boolean prop to stagger the animation (see [Staggered Animations](#staggered-animations)).

It works by assigning a progressive delay to each direct child wrapped by an animated primitive – this is particularly useful for animating list items.

Defaults to `false`.

### `damping`

Factor that affects the delay that each animated component in a cascade animation will be assigned.

If `damping = 1` then the delay will be equal to the animation duration; if `0 < damping < 1` then the delay will be lower than the animation duration; if `damping > 1` then the delay will be greater than the animation duration.

Defaults to `0.5` (meaning that the delay will be half of the animation duration).

### `className` and `style`

CSS class names and styles to attach to the element that React Awesome Reveal creates to wrap your own components.

### `childClassName` and `childStyle`

CSS class names and styles to attach to the elements that you pass inside any animated primitive.

### `onVisibilityChange`

```ts
(inView: boolean, entry: IntersectionObserverEntry) => void
```

Callback executed when the element enters or leaves the viewport.

If an animated primitive directly wraps multiple children, this function is called on each of them, and the `entry` argument holds the reference to the current element.

## Staggered Animations

To chain together multiple animations, set the `cascade` prop to `true`:

```tsx
<Fade cascade>
  <p>I enter first...</p>
  <p>...then comes my turn...</p>
  <p>...and finally you see me!</p>
</Fade>
```

Play with the `damping` prop to alter the delay by which each child will progressively appear:

```tsx
<Fade cascade damping={0.1}>
  <p>I enter first...</p>
  <p>...then comes my turn...</p>
  <p>...and finally you see me!</p>
</Fade>
```

### Animating Lists

A particularly :cool: use case for staggered animations is list animation.

**React Awesome Reveal** detects if you pass a `ul` or `ol` element and, if `cascade` is `true`, it automatically creates a staggered animation for each `li` element:

```tsx
<Fade cascade>
  <ul>
    <li>I enter first...</li>
    <li>...then comes my turn...</li>
    <li>...and finally you see me!</li>
  </ul>
</Fade>
```

### Animating Texts

To animate a text, simple wrap it in an animated primitive and set the `cascade` prop:

```tsx
<Fade cascade>Each character will appear one by one</Fade>
```
