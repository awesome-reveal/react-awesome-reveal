# react-awesome-reveal

## 5.0.0-next.0

### Major Changes

- [`05a8d3f`](https://github.com/awesome-reveal/react-awesome-reveal/commit/05a8d3fa1a0a94334fedcdc00d8900a06f9e47fc) Thanks [@morellodev](https://github.com/morellodev)! - Publish the package as ESM only.

  - **Breaking:** the CommonJS build (`dist/index.cjs`) is removed. The `main` and `module` fields and the `require` export condition are removed.

- [`db4785e`](https://github.com/awesome-reveal/react-awesome-reveal/commit/db4785e16d2fbeb50521ec41e080af491a48a437) Thanks [@morellodev](https://github.com/morellodev)! - Support React 19 and update `react-intersection-observer` to v11.

  - **Breaking:** the `react` peer dependency is now `>=17.0.0`. `react-intersection-observer` already required React 17 or later.
  - **Breaking:** `onVisibilityChange` no longer fires with `false` on mount for elements that start off-screen. It first fires when the element becomes visible. Later enter and leave changes fire as before.
  - Fragment and text children with `triggerOnce` and a non-zero `fraction` now animate. Before, they could stay hidden.
  - Fragment children are detected on React 17 and 18 again. The `react-is` dependency is removed.

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
