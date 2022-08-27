---
layout: ../../layouts/DocLayout.astro
title: Getting Started
order: 1
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

Import any of the animated components :sparkles: and wrap your elements:

```jsx
import { Fade } from "react-awesome-reveal";

function App() {
  return (
    <Fade>
      <p>I am an animated text</p>
    </Fade>
  );
}
```
