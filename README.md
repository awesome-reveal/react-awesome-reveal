# React Awesome Reveal

[![Version](https://badgen.net/npm/v/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal/v/latest)
[![Last Commit](https://badgen.net/github/last-commit/dennismorello/react-awesome-reveal)](https://github.com/dennismorello/react-awesome-reveal/commits/master)
[![Downloads](https://badgen.net/npm/dt/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal/v/latest)
[![Size](https://badgen.net/bundlephobia/minzip/react-awesome-reveal)](https://bundlephobia.com/result?p=react-awesome-reveal@latest)
[![License](https://badgen.net/npm/license/react-awesome-reveal)](https://www.npmjs.com/package/react-awesome-reveal/v/latest)

[React Awesome Reveal](https://github.com/dennismorello/react-awesome-reveal) is a library for React apps written in TypeScript that adds reveal animations using the Intersection Observer API to detect when the elements appear in the viewport. Animations are internally provided by [Emotion](https://emotion.sh) and implemented as CSS Animations to benefit from hardware acceleration.

## Table Of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported Effects](#supported-effects)
  - [Example](#example)
  - [Generic Animations](#generic-animations)
  - [Chaining Multiple Animations](#chaining-multiple-animations)
- [Past Releases](#past-releases)
- [License](#license)

## Features

- 🎁 **Modern stack** - It is built for modern React
- 🏷 **TypeScript support** - It is written in TypeScript to improve the DX
- 🍃 **Lightweight** - Very little footprint on your project and no other dependencies required
- ⚙️ **Uses native APIs** - Intersection Observer and CSS Animations are now supported by all major browsers
- 🚀 **Fast** - Buttery smooth experience thanks to the use of native asynchronous APIs and hardware acceleration
- 🌳 **Tree-shakeable** - Only the parts you use will be included in your final bundle

## Demo

You can find a demo website [here](https://react-awesome-reveal.morello.dev).

## Installation

To add this package as a dependency to your app, simply run

```sh
npm install react-awesome-reveal --save
```

or, if you are using Yarn (as I strongly suggest):

```sh
yarn add react-awesome-reveal
```

## Quick Start

Import effects from [React Awesome Reveal](https://www.npmjs.com/package/react-awesome-reveal) to your React component, for example the `Fade` effect:

```js
import { Fade } from "react-awesome-reveal";
```

Then simply wrap the components you want to animate:

```jsx
<Fade>
  <p>I will gently appear as I enter the viewport</p>
</Fade>
```

## Supported Effects

The effects currently supported are `AttentionSeekers`, `Bounce`, `Fade`, `Flip`, `Hinge`, `JackInTheBox`, `Roll`, `Rotate`, `Slide` and `Zoom`. Refer to the [Animate.css](https://animate.style) documentation for a comprehensive list.

You can pass the following properties to the animation components to customize the behavior:

| Prop          | Description                                                                                                                                                                                                                                                                                                                          | Values                                                                                       | Default                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `cascade`     | If set, each child of a reveal animation automatically get assigned a delay that takes into account their predecessor (child `i` enters the viewport after `i * delay * damping` milliseconds) – useful for animating list items.                                                                                                    | `true` or `false`                                                                            | `false`                                                               |
| `damping`     | Factor that affects the delay that each animated component in a cascade animation will be assigned. If `damping = 1` then the delay will be equal to the animation duration; if `damping < 1` then the delay will be lower than the animation duration; if `damping > 1` then the delay will be greater than the animation duration. | `number` value                                                                               | `0.5` (meaning that the delay will be half of the animation duration) |
| `direction`   | Origin of the animation (where applicable).                                                                                                                                                                                                                                                                                          | Usually `"down"`, `"left"`, `"right"` or `"up"`, with some exceptions documented in the code | `undefined`                                                           |
| `delay`       | Time to wait before the animation starts (in milliseconds).                                                                                                                                                                                                                                                                          | `number` value                                                                               | `0`                                                                   |
| `duration`    | The animation duration (milliseconds).                                                                                                                                                                                                                                                                                               | `number` value                                                                               | `1000`                                                                |
| `fraction`    | How much an element should be in viewport before the animation is triggered.                                                                                                                                                                                                                                                         | `number` between `0` and `1`                                                                 | `0`                                                                   |
| `triggerOnce` | Specifies if the animation should run only once or everytime an element enters/exits/re-enters the viewport.                                                                                                                                                                                                                         | `true` or `false`                                                                            | `false`                                                               |

### Example

To trigger the animation only the first time an element enters the viewport:

```jsx
<Slide triggerOnce>
  <p>I will animate only the first time you see me</p>
</Slide>
```

### Chaining Multiple Animations

To chain together multiple animations, set the `cascade` prop to `true`:

```jsx
<Fade cascade>
  <p>I enter first...</p>
  <p>...then comes my turn...</p>
  <p>...and finally you see me!</p>
</Fade>
```

This is _almost_ equivalent to

```jsx
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

with the exception that, since each `Fade` component creates an isolated visibility context, in the second snippet every `p` will be shown only if they are inside the viewport (after the specified delay).

## Past Releases

To see the documentation for previous versions, navigate through past tags in the GitHub's project repository and read the README for that specific version.

## License

Project source code is licensed under the MIT license. You are free to fork this repository, edit the code, share and use it both for non-commercial and commercial purposes.
