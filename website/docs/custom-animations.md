# Custom Animations

Starting from version 3.2.0, you can define custom animations! Simply import the `Reveal` component (which is the default export of the library – give it the name you want) and pass it a `keyframes` prop:

```jsx
import React from "react";
import Reveal from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

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

function MyAnimatedComponent({ children }) {
  return (
    <Reveal keyframes={customAnimation}>
      {children}
    </Reveal>;
  );
}
```

If no `keyframes` prop is passed, the default rendered animation is a fading entrance from the left (equivalent to `<Fade direction="left">...</Fade>`).

## Other Props

You can also pass these props to `Reveal`:

- `cascade`
- `damping`
- `delay`
- `duration`
- `fraction`
- `triggerOnce`
- `className` and `childClassName`
- `style` and `childStyle`
- `onVisibilityChange`
