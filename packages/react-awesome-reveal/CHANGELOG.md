# react-awesome-reveal

## [5.0.0-next.2](https://github.com/awesome-reveal/awesome-reveal/compare/react-awesome-reveal@5.0.0-next.1...react-awesome-reveal@5.0.0-next.2) (2026-10-11)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/react bumped to 1.0.0-next.2

## [5.0.0-next.1](https://github.com/awesome-reveal/awesome-reveal/compare/react-awesome-reveal@5.0.0-next.0...react-awesome-reveal@5.0.0-next.1) (2026-10-11)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/react bumped to 1.0.0-next.1

## [5.0.0-next.0](https://github.com/awesome-reveal/awesome-reveal/compare/react-awesome-reveal@4.3.1...react-awesome-reveal@5.0.0-next.0) (2026-10-11)


### ⚠ BREAKING CHANGES

* **react-awesome-reveal:** react-awesome-reveal 5 re-exports @awesome-reveal/react. It has no effect components and does not use Emotion. Read "Migrating from v4" in the README of @awesome-reveal/react.

### Features

* **react-awesome-reveal:** re-export @awesome-reveal/react ([d39d407](https://github.com/awesome-reveal/awesome-reveal/commit/d39d40720fc444f9bbc610a50f6d6f330a248fff))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/react bumped to 1.0.0-next.0

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
