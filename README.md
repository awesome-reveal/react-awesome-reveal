# React Reveal Next

[React Reveal Next](https://github.com/dennismorello/react-reveal-next) is a library for React apps written in TypeScript that adds reveal animations using the Intersection Observer API to detect when the elements to animate appear in the viewport. It then uses [react-animated-css](https://github.com/digital-flowers/react-animated-css) to execute the animations on the GPU.

This library has been inspired by [React Reveal](https://github.com/rnosov/react-reveal), which has more features but it is heavier and less performant.

## Installation

To add this package as a dependency to your app, simply run

```sh
npm install react-reveal-next --save
```

or, if you are using Yarn (as I strongly suggest):

```sh
yarn add react-reveal-next
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

The effects currently supported are `Bounce`, `Fade`, `Rotate`, `Shake`, `Slide` and `Zoom`.

You can pass the following properties to the animation components to customize the behavior:

- `direction`: can be `"top"`, `"left"`, `"bottom"` or `"right"`. If no direction is passed, the animation happens in place (default to `undefined`)
- `duration`: the animation duration expressed in milliseconds (default to `1000`)
- `delay`: amount of time in milliseconds to wait before the animation starts (default to `0`)

## License

Project source code is licensed under the MIT license. You are free to fork this repository, edit the code, share and use it both for non-commercial and commercial purposes.
