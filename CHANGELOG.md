# react-awesome-reveal

## [5.0.0-next.0](https://github.com/awesome-reveal/react-awesome-reveal/compare/react-awesome-reveal@4.3.1...react-awesome-reveal@5.0.0-next.0) (2026-10-10)


### ⚠ BREAKING CHANGES

* Emotion and react-intersection-observer are removed, and React 18 or later is required.
    - The effect components (Fade, Slide, Zoom, Bounce, Flip, Rotate, Roll, Hinge, JackInTheBox, AttentionSeeker) and the default export are removed. Use `Reveal` or `useReveal` with keyframes from `react-awesome-reveal/keyframes`.
    - `keyframes` is required and takes keyframe arrays, not Emotion keyframes.
    - `Reveal` renders one element (`as`) around its children. `cascade` and `damping` become `stagger`, `fraction` becomes `threshold`, and `triggerOnce` becomes `once`, which defaults to `true`. `childClassName`, `childStyle` and `onVisibilityChange` are removed.
    - The default duration is 600 ms, and animations no longer stay applied after they finish.
* the package now declares engines.node >=20.19.0, the first Node 20 release that can require() an ES module.
* the react peer dependency is now >=17.0.0, and onVisibilityChange no longer fires with false on mount for elements that start off-screen.
* publish as ESM only

### Features

* animate with the web animations api instead of emotion ([b5954b2](https://github.com/awesome-reveal/react-awesome-reveal/commit/b5954b2c571b1eceed6de11e3cf1277c356d5a96))
* publish as ESM only ([05a8d3f](https://github.com/awesome-reveal/react-awesome-reveal/commit/05a8d3fa1a0a94334fedcdc00d8900a06f9e47fc))
* require node 20.19 or later ([368bd6b](https://github.com/awesome-reveal/react-awesome-reveal/commit/368bd6b680ac69b58035ca04abb39eb30d1ae026))
* support react 19 ([beb6f60](https://github.com/awesome-reveal/react-awesome-reveal/commit/beb6f60a90383d84ebe7c85041777d92cac354f1))


### Bug Fixes

* add file extensions to relative imports for node16 type resolution ([82ad899](https://github.com/awesome-reveal/react-awesome-reveal/commit/82ad899a6c8a67a236a3f7153074e6b992edc3c0))
* detect fragment children on React 17-18 and update react dependencies ([db4785e](https://github.com/awesome-reveal/react-awesome-reveal/commit/db4785e16d2fbeb50521ec41e080af491a48a437))

## 4.3.1

### Patch Changes

- 2de3acc: Fix "use client" directive preservation to final build

## 4.3.0

### Minor Changes

- a9a7a7d: Add RSC frameworks support

## 4.2.14

### Patch Changes

- dfa6ad0: Update repository refs

## 4.2.13

### Patch Changes

- 47924cb: Update dependencies

## 4.2.12

### Patch Changes

- 49c6106: Update dependencies

## 4.2.11

### Patch Changes

- d592d40: Update dependencies

## 4.2.10

### Patch Changes

- 010696e: Disable sourcemaps generation

## 4.2.9

### Patch Changes

- b807214: Update dependencies

## 4.2.8

### Patch Changes

- 97f7d1e: Update react-intersection-observer

## 4.2.7

### Patch Changes

- aa47f95: fix: upgrade react-intersection-observer

## 4.2.6

### Patch Changes

- 8e30cd1: Update dependencies

## 4.2.5

### Patch Changes

- Use Vite for building package

## 4.2.4

### Patch Changes

- cfb05d8: Fix Slide and Zoom flicker when the element is just entering the view and certain conditions are met. Slide flickers when direction is up. Zoom flickers when it is styled.

## 4.2.3

### Patch Changes

- 33aad77: Removed hidden styles when animated components are not in the viewport

## 4.2.2

### Patch Changes

- Fix previous release

## 4.2.1

### Patch Changes

- Prevent flashing on first render

## 4.2.0

### Minor Changes

- Disable animations if user has a reduced motion setting applied system-wide
- Removed `css` prop from the Reveal component

### Patch Changes

- Refactored code to be more functional
- Emotion's `css` prop is not used anymore by the animated components – they now all use inline styling. This should improve runtime perfs due to less Emotion work
