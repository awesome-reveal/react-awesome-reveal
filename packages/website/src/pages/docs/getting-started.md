---
layout: ../../layouts/DocLayout.astro
title: Getting Started
order: 1
---

# Getting Started

## About

**React Awesome Reveal** is a library for React apps that provides a bunch of animated primitives. You can use them to implement both [revealing effects](/docs/revealing-effects) and [attention seekers](/docs/attention-seekers) animations.

It was initially born as a modern (and more performant) replacement for [react-reveal](https://github.com/rnosov/react-reveal), which has been discontinued.

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

## Design Principles

This library has been developed with the following design principles:

- **simplicity** – it should be easy and intuitive to adopt
- **lightness** – it should not bloat your app
- **performance** – animations should run as smooth as possible
- **modernicity** – it should use state-of-the-art (while well supported) technologies
