---
layout: ../../layouts/DocLayout.astro
title: Custom Animations
order: 4
---

# Custom Animations

If the default effects do not suite your needs, you can define custom animations for your components :tada:

To do so, import the `Reveal` component and pass it a `keyframes` prop:

```tsx
import { keyframes } from "@emotion/react";
import { Reveal } from "react-awesome-reveal";

const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(-200px, -100px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

function CustomAnimation({ children }) {
  return <Reveal keyframes={customAnimation}>{children}</Reveal>;
}
```
