---
name: migrating-from-v4
description: Migrates a React application from react-awesome-reveal v4 to the v5 API of @awesome-reveal/react, with native keyframes. Use when a project uses the v4 effect components or Emotion keyframes of react-awesome-reveal.
---

# Migrate to v5

Install `@awesome-reveal/react`, or upgrade `react-awesome-reveal` to version 5. If no other code uses Emotion, remove it. The project must use React 18 or 19.

Replace each effect component with `Reveal`, and set `from` to a side or a complete start state. `Reveal` is a named export: `import { Reveal } from "@awesome-reveal/react"`.

`from` names the side where the element starts. The v4 `left` and `right` directions name that side too, but `up` and `down` name the movement, so `up` becomes `from="bottom"` and `down` becomes `from="top"`. For `big` or a diagonal direction, use a `from` object with `x` and `y`. For a complex effect, change the CSS animation into native keyframe objects, with an `offset` and an `easing` for each segment. The last keyframe must agree with the resting style of the element.

```tsx
import { Reveal } from "@awesome-reveal/react";

<Reveal from={{ opacity: 0 }}>Pure fade</Reveal>;
<Reveal from="left">Directional entrance</Reveal>;
<Reveal
  keyframes={[
    { opacity: 0, transform: "scale(.8)" },
    { opacity: 1, transform: "scale(1)" },
  ]}
>
  Native animation
</Reveal>;
```

The default entrance starts transparent and 24px below the resting position. It takes 600 ms and plays one time. A `from` object replaces the start state, so it gets no default fade and no offset. The package loads its CSS automatically.

Check these behavior changes, because the type check does not find them:

- A v4 `<Reveal>` with no `keyframes` slid in from the left by 100%. Now it moves up 24px. For the v4 motion, use `from={{ opacity: 0, x: "-100%" }}`.
- The v4 duration was 1000 ms. Set `duration={1000}` to keep it. The easing is fixed. To change it, use native keyframes.
- `Reveal` renders one element around its children, and `as` sets its tag. v4 wrapped each element child in a `div`, and animated each `li` of a list child. `className` and `style` now apply to the one element. Style the children directly instead of `childClassName` and `childStyle`.
- One observer watches the whole `Reveal`, so all the children reveal together.

For a long list, use one reveal for each item. Replace the v4 `cascade` prop with the `Cascade` component, which animates its direct element children in sequence. For a v4 cascade around a list, render the list with `Cascade`, for example `<Cascade as="ul">`. Set `interval` to the v4 `duration * damping`, in milliseconds. `Cascade` does not split text. If you need text spans, write them yourself. Do not make screen readers read the same text two times.

Replace `fraction` with `threshold`, and use `when` for manual control. Replace `onVisibilityChange` with `onReveal`, which runs one time for each reveal. Keep `delay`. It is in milliseconds, and in a cascade it moves the start of the whole sequence. The exit animations (`reverse`) have no replacement. Remove `triggerOnce`. In v4 the entrance played each time by default, but now it plays one time. To play it again, set `when` to `false`, then to `true`. Use `useReveal` for an element that you render. After the migration, check the refs, hydration, reduced motion and the teardown.
