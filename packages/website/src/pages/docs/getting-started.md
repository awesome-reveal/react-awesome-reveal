---
layout: ../../layouts/DocLayout.astro
title: Getting Started
sidenavOrder: 1
---

# Getting Started

## Installation

Inside your React project directory, run the following:

```shell
yarn add react-awesome-reveal @emotion/react
```

Or with `npm`:

```shell
npm install react-awesome-reveal @emotion/react
```

Or with `pnpm` (:raised_hands: if this is your case):

```shell
pnpm add react-awesome-reveal @emotion/react
```

## Quick Start

Just import the `<Fade />` component and wrap your elements:

```jsx
import { Fade } from "react-awesome-reveal";

function MyComponent() {
  return (
    <Fade>
      <p>I am an animated text</p>
    </Fade>
  );
}
```
