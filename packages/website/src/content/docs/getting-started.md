---
title: Getting Started
sortOrder: 1
---

## About

**React Awesome Reveal** is a library for React apps that provides a set of curated animated primitives.
They can be used to add revealing animations to your components when they enter the browser viewport as the user scrolls the page.

This project was initially born as a modern (and [more performant](/docs/performances)) replacement for [react-reveal](https://github.com/rnosov/react-reveal), which has been discontinued.

## Installation

Inside your React project directory, run the following:

```shell
yarn add react-awesome-reveal @emotion/react
```

Or, if you are using `npm`:

```shell
npm install react-awesome-reveal @emotion/react
```

Or, if you are a `pnpm` user (:raised_hands: if this is your case):

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
