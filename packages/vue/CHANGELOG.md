# Changelog

## [1.0.0-next.5](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/vue@1.0.0-next.4...@awesome-reveal/vue@1.0.0-next.5) (2026-10-14)


### ⚠ BREAKING CHANGES

* core exports only reveal, cascade and their types. The /keyframes entry, the keyframe presets, spring, defineKeyframes and the distance, delay, stagger, easing, bounce, rootMargin, reducedMotion, when and onReveal options of core are removed with no aliases. Use from or native keyframes. The once option is removed from all packages, and every entrance plays once: to play it again in an adapter, set `when` to `false`, then to `true`. React and Vue no longer export ./reveal.css. The generated entrance needs Chrome 104, Firefox 80 or Safari 16. It adds its offset, scale, rotation and blur to the element's own transforms and filter, and fades to the element's own opacity.
* import reveal.css once to hide the elements before the reveal, because the library writes no inline style. slide() takes `from` in place of `direction`, `hiddenStyle` is now `hiddenAttributes`, the core `RevealState` type is now `RevealStore`, `when: true` renders hidden on the server, and React `getProps` no longer merges `style`.
* **core:** `RevealController.update` is now `setOptions`, `blur({ amount })` is now `blur({ from })`, and `defineKeyframes` no longer passes `u` or accepts an `easing` function. `destroy()` restores the element, and the reveal restores the inline opacity of the user.

### Features

* add entrance options, onReveal and a shipped reveal.css ([#290](https://github.com/awesome-reveal/awesome-reveal/issues/290)) ([44f3f95](https://github.com/awesome-reveal/awesome-reveal/commit/44f3f95a10bf144c6929854bdbf79b93d07cc26b))
* **core:** add createReveal, report browser errors and rename update to setOptions ([#276](https://github.com/awesome-reveal/awesome-reveal/issues/276)) ([109c576](https://github.com/awesome-reveal/awesome-reveal/commit/109c576bb9f51f93fa1f9fc67f0684318ed0ee90))
* reduce the core API to reveal and cascade ([#292](https://github.com/awesome-reveal/awesome-reveal/issues/292)) ([6a4d03f](https://github.com/awesome-reveal/awesome-reveal/commit/6a4d03f4a9061de3b5815f024abe17891ba4977c))


### Bug Fixes

* keep the priority and the latest value of the inline opacity ([#288](https://github.com/awesome-reveal/awesome-reveal/issues/288)) ([7ee195b](https://github.com/awesome-reveal/awesome-reveal/commit/7ee195b0d4ac516a25c8c6d5efef703993759ce2))
* **vue:** build Reveal on createReveal and play on the new element when as and when change together ([#279](https://github.com/awesome-reveal/awesome-reveal/issues/279)) ([847ac75](https://github.com/awesome-reveal/awesome-reveal/commit/847ac754714885c9448ca9d2251d690d50ebcdb5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.5

## [1.0.0-next.4](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/vue@1.0.0-next.3...@awesome-reveal/vue@1.0.0-next.4) (2026-10-11)


### Miscellaneous Chores

* **@awesome-reveal/vue:** Synchronize awesome-reveal versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.4

## [1.0.0-next.3](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/vue@1.0.0-next.2...@awesome-reveal/vue@1.0.0-next.3) (2026-10-11)


### Features

* **astro:** add the Astro adapter ([#269](https://github.com/awesome-reveal/awesome-reveal/issues/269)) ([2722b84](https://github.com/awesome-reveal/awesome-reveal/commit/2722b841931c2a88deed549eb471ce4a5a715066))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.3

## [1.0.0-next.2](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/vue@1.0.0-next.1...@awesome-reveal/vue@1.0.0-next.2) (2026-10-11)


### Miscellaneous Chores

* **@awesome-reveal/vue:** Synchronize awesome-reveal versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.2

## [1.0.0-next.1](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/vue@1.0.0-next.0...@awesome-reveal/vue@1.0.0-next.1) (2026-10-11)


### Features

* **vue:** add the Vue adapter ([#264](https://github.com/awesome-reveal/awesome-reveal/issues/264)) ([fc76748](https://github.com/awesome-reveal/awesome-reveal/commit/fc76748668c9c71afc13009c18d1b2fcf2ebbe66))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.1
