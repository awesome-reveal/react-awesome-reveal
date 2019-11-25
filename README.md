# React Reveal Next

[![Version](https://badgen.net/npm/v/react-reveal-next)](https://www.npmjs.com/package/react-reveal-next/v/latest)
[![Last Commit](https://badgen.net/github/last-commit/dennismorello/react-reveal-next)](https://github.com/dennismorello/react-reveal-next/commits/master)
[![Downloads](https://badgen.net/npm/dt/react-reveal-next)](https://www.npmjs.com/package/react-reveal-next/v/latest)
[![Size](https://badgen.net/bundlephobia/minzip/react-reveal-next)](https://bundlephobia.com/result?p=react-reveal-next@latest)
[![License](https://badgen.net/npm/license/react-reveal-next)](https://www.npmjs.com/package/react-reveal-next/v/latest)

[React Reveal Next](https://github.com/dennismorello/react-reveal-next) is a library for React apps written in TypeScript that adds reveal animations using the Intersection Observer API to detect when the elements appear in the viewport. Animations are provided by [Animate.css](https://github.com/daneden/animate.css) to benefit from hardware acceleration.

This project has been inspired by [React Reveal](https://github.com/rnosov/react-reveal), which is good and mature but it is no longer maintained and it uses synchronous listeners on scroll and window resize events. Instead, this library asynchronously detects when an observed element enters or exits the viewport, which leads to more fluid interactions.

## Features

- 🎁 **Modern stack** - It is built for modern React
- 🏷 **TypeScript support** - It is written in TypeScript to make it easier and faster to use the library
- 🍃 **Lightweight** - Very little footprint on your project ([~1kB gzipped](https://bundlephobia.com/result?p=react-reveal-next))
- ⚙️ **Uses native APIs** - Intersection Observer and CSS Animations are now supported by all major browsers
- 🚀 **Fast** - Buttery smooth experience thanks to the use of native asynchronous APIs and hardware acceleration
- 🌳 **Tree-shakeable** - Only the parts you use will be included in your final bundle

## Installation

To add this package as a dependency to your app, simply run

```sh
npm install react-reveal-next --save
```

or, if you are using Yarn (as I strongly suggest):

```sh
yarn add react-reveal-next
```

You must also include [Animated.css](https://daneden.github.io/animate.css/) in your HTML file:

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"
  />
</head>
```

## Quick Start

Import effects from [React Reveal Next](https://www.npmjs.com/package/react-reveal-next) to your React component, for example the `Fade` effect:

```js
import { Fade } from 'react-reveal-next';
```

Then place the following code somewhere in your `render` method:

```jsx
<Fade>
  <p>I will gently appear as I enter the viewport</p>
</Fade>
```

The effects currently supported are `Bounce`, `Fade`, `Flash`, `Flip`, `HeadShake`, `HeartBeat`, `JackInTheBox`, `Jello`, `LightSpeed`, `Pulse`, `Rotate`, `RubberBand`, `Shake`, `Slide`, `Swing`, `Tada`, `Wobble` and `Zoom`.

You can pass the following properties to the animation components to customize the behavior:

- `direction`: can be `"top"`, `"left"`, `"bottom"` or `"right"`. If no direction is passed, the animation happens in place (default to `undefined`)
- `delay`: the amount of time to wait before the animation starts. Can be a number (in milliseconds) or one of the following presets: `"1s"`, `"2s"`, `"3s"`, `"4s"`, `"5s"`. Default to `undefined`, meaning that no delay will be present
- `fraction`: number between `0` and `1` indicating how much an element should be in viewport before triggering the animation (default to `0`)
- `speed`: affects the animation duration. Can be a number (in milliseconds) or one of the following presets: `"slower"` (3s), `"slow"` (2s), `"fast"` (800ms) or `"faster"` (500ms). If not specified, the animation lasts 1s.
- `triggerOnce`: specifies if the animation should run only once or everytime an element enters/exits/re-enters the viewport (default to `false`)

## License

Project source code is licensed under the MIT license. You are free to fork this repository, edit the code, share and use it both for non-commercial and commercial purposes.
