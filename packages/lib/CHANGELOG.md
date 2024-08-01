# react-awesome-reveal

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
