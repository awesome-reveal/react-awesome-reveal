# React Reveal Next

[React Reveal Next](https://github.com/dennismorello/react-reveal-next) is a library for React apps written in TypeScript that adds reveal animations using the Intersection Observer API to detect when the elements appear in the viewport. Animations are provided by [Animate.css](https://github.com/daneden/animate.css) to benefit from hardware acceleration.

This project has been inspired by [React Reveal](https://github.com/rnosov/react-reveal), which is good and mature but it is no longer maintained and it uses synchronous listeners on scroll and window resize events. Instead, this library asynchronously detects when an observed element enters or exits the viewport, which leads to more fluid interactions.

## Installation

To add this package as a dependency to your app, simply run

```sh
npm install react-reveal-next --save
```

or, if you are using Yarn (as I strongly suggest):

```sh
yarn add react-reveal-next
```

You must then include [Animated.css](https://daneden.github.io/animate.css/) in your HTML file:

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

The effects currently supported are `Bounce`, `Fade`, `Flash`, `Flip`, `HeadShake`, `Jello`, `LightSpeed`, `Pulse`, `Rotate`, `Shake`, `Slide`, `Swing`, `Tada`, `Wobble` and `Zoom`.

You can pass the following properties to the animation components to customize the behavior:

- `direction`: can be `"top"`, `"left"`, `"bottom"` or `"right"`. If no direction is passed, the animation happens in place (default to `undefined`)
- `delay`: the amount of time to wait in milliseconds before the animation starts (default to `0`)
- `speed`: affects the animation duration. Can be `"slower"` (3s), `"slow"` (2s), `"fast"` (800ms) or `"faster"` (500ms). If not specified, the animation lasts 1s.
- `triggerOnce`: specifies if the animation should run only once or everytime an element enters/exits/re-enters the viewport (default to `false`)

## License

Project source code is licensed under the MIT license. You are free to fork this repository, edit the code, share and use it both for non-commercial and commercial purposes.
