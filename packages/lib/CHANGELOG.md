# react-awesome-reveal

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
