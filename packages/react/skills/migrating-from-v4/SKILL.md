---
name: migrating-from-v4
description: Migrates a React application from react-awesome-reveal v4 to the v5 API of @awesome-reveal/react, with native keyframes. Use when a project uses the v4 effect components or Emotion keyframes of react-awesome-reveal.
---

# Migrate to v5

Install `@awesome-reveal/react`, or upgrade `react-awesome-reveal` to version 5. If no other code uses Emotion, remove it. The project must use React 18 or 19.

Replace each effect component with `Reveal`, and set `from` to a side or a complete start state. For a complex effect, change the CSS animation into native keyframe objects, with an `offset` and an `easing` for each segment. The last keyframe must agree with the resting style of the element.

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

The default entrance starts transparent and 24px below the resting position. It takes 600 ms and plays one time. A custom start state does not get these defaults. The package loads its CSS automatically. `Reveal` renders one element around its children, and `as` sets its tag.

For a long list, use one reveal for each item. Replace the v4 `cascade` prop with the `Cascade` component, which animates its direct element children in sequence. Set `interval` to the v4 `duration * damping`, in milliseconds. `Cascade` does not split text. If you need text spans, write them yourself. Do not make screen readers read the same text two times.

Use `threshold` for the visible fraction and `when` for manual control. Remove `triggerOnce`. In v4 the entrance played each time by default, but now it plays one time. To play it again, set `when` to `false`, then to `true`. Use `useReveal` for an element that you render. After the migration, check the refs, hydration, reduced motion and the teardown.
