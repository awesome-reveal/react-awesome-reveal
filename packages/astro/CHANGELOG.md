# Changelog

## [1.0.0-next.6](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/astro@1.0.0-next.5...@awesome-reveal/astro@1.0.0-next.6) (2026-10-14)


### Miscellaneous Chores

* **@awesome-reveal/astro:** Synchronize awesome-reveal versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.6

## [1.0.0-next.5](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/astro@1.0.0-next.4...@awesome-reveal/astro@1.0.0-next.5) (2026-10-14)


### ⚠ BREAKING CHANGES

* core exports only reveal, cascade and their types. The /keyframes entry, the keyframe presets, spring, defineKeyframes and the distance, delay, stagger, easing, bounce, rootMargin, reducedMotion, when and onReveal options of core are removed with no aliases. Use from or native keyframes. The once option is removed from all packages, and every entrance plays once: to play it again in an adapter, set `when` to `false`, then to `true`. React and Vue no longer export ./reveal.css. The generated entrance needs Chrome 104, Firefox 80 or Safari 16. It adds its offset, scale, rotation and blur to the element's own transforms and filter, and fades to the element's own opacity.
* import reveal.css once to hide the elements before the reveal, because the library writes no inline style. slide() takes `from` in place of `direction`, `hiddenStyle` is now `hiddenAttributes`, the core `RevealState` type is now `RevealStore`, `when: true` renders hidden on the server, and React `getProps` no longer merges `style`.
* **core:** `RevealController.update` is now `setOptions`, `blur({ amount })` is now `blur({ from })`, and `defineKeyframes` no longer passes `u` or accepts an `easing` function. `destroy()` restores the element, and the reveal restores the inline opacity of the user.

### Features

* add entrance options, onReveal and a shipped reveal.css ([#290](https://github.com/awesome-reveal/awesome-reveal/issues/290)) ([44f3f95](https://github.com/awesome-reveal/awesome-reveal/commit/44f3f95a10bf144c6929854bdbf79b93d07cc26b))
* **core:** add createReveal, report browser errors and rename update to setOptions ([#276](https://github.com/awesome-reveal/awesome-reveal/issues/276)) ([109c576](https://github.com/awesome-reveal/awesome-reveal/commit/109c576bb9f51f93fa1f9fc67f0684318ed0ee90))
* reduce the core API to reveal and cascade ([#292](https://github.com/awesome-reveal/awesome-reveal/issues/292)) ([6a4d03f](https://github.com/awesome-reveal/awesome-reveal/commit/6a4d03f4a9061de3b5815f024abe17891ba4977c))


### Bug Fixes

* **astro:** give the hidden rule no specificity so a print rule can override it ([#281](https://github.com/awesome-reveal/awesome-reveal/issues/281)) ([fa2942e](https://github.com/awesome-reveal/awesome-reveal/commit/fa2942e58e232c8d777c29243dab7f6f75ac065d))
* **astro:** hide the element over an inline opacity and report an invalid options attribute ([#280](https://github.com/awesome-reveal/awesome-reveal/issues/280)) ([0fae3fc](https://github.com/awesome-reveal/awesome-reveal/commit/0fae3fc721351b70ee036db300e056176ba6a705))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.5

## [1.0.0-next.4](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/astro@1.0.0-next.3...@awesome-reveal/astro@1.0.0-next.4) (2026-10-11)


### Bug Fixes

* **astro:** keep the class prop with the where and class scoped style strategies ([#272](https://github.com/awesome-reveal/awesome-reveal/issues/272)) ([e86b62d](https://github.com/awesome-reveal/awesome-reveal/commit/e86b62d115d9f1c45669c9fd56e3bbfb4173bb23))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.4

## [1.0.0-next.3](https://github.com/awesome-reveal/awesome-reveal/compare/@awesome-reveal/astro@1.0.0-next.2...@awesome-reveal/astro@1.0.0-next.3) (2026-10-11)


### Features

* **astro:** add the Astro adapter ([#269](https://github.com/awesome-reveal/awesome-reveal/issues/269)) ([2722b84](https://github.com/awesome-reveal/awesome-reveal/commit/2722b841931c2a88deed549eb471ce4a5a715066))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @awesome-reveal/core bumped to 1.0.0-next.3
