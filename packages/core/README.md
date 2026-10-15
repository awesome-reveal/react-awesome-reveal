# @awesome-reveal/core

`@awesome-reveal/core` gives small reveal-on-scroll functions that use IntersectionObserver and the Web Animations API. It needs no stylesheet and no setup.

```sh
npm install @awesome-reveal/core
```

```ts
import { reveal, cascade } from "@awesome-reveal/core";

const hero = reveal(".hero");
reveal(".card", { from: "left" });
cascade(".features", { from: { opacity: 0, y: 16 }, interval: 80 });

// When you remove this part of the page:
hero.dispose();
```

## Targets and handles

Both functions accept these targets:

- an element
- a CSS selector
- an iterable of elements
- an array-like collection, such as `children`

The function finds the targets one time, when you call it. Each call returns a `RevealHandle` that has only `dispose()`.

`reveal()` observes each target separately. `cascade()` observes each container separately and reveals only its direct element children. It reads the children one time, when you call it, so a child that you add later does not animate. Text nodes and deeper descendants do not animate. For a long list, use `reveal()` on the items.

The child at position `index` waits `delay + index * interval` milliseconds after the reveal. So with no `delay`, the first child starts immediately. The default interval is 80 ms. A negative interval gives negative delays, so each later child starts further into its entrance. To cascade the words or sentences of a text, wrap each one in an element before you call `cascade()`. A transform needs a transformable element, so give inline children `display: inline-block`.

`dispose()` disconnects the observers and cancels the pending, the active and the delayed animations. It removes the start state of the call, and the elements return to their own styles. You can call it more than one time.

When you call the function, core calls `element.animate(keyframes, { duration, delay, fill: "backwards" })` for each element that it animates. It pauses the animation at its start. It plays the animation when the observed element enters the viewport. If your code finishes or cancels it before the element enters the viewport, the element shows at rest and the entrance does not play.

A paused animation does not finish. If your code waits for all of `document.getAnimations()` to finish, skip the paused animations, for example with `animation.playState !== "paused"`.

## Entrance

The default entrance starts at opacity 0 and 24 px below the resting position, and moves up in 600 ms. You cannot change its easing. For a different easing, use native keyframes.

| `from`               | Start offset |
| -------------------- | ------------ |
| `"top"`              | y: -24 px    |
| `"right"`            | x: 24 px     |
| `"bottom"` (default) | y: 24 px     |
| `"left"`             | x: -24 px    |

An object gives the complete start state. It does not get the default fade or direction:

```ts
import { reveal } from "@awesome-reveal/core";

reveal(".caption", { from: { opacity: 0 } }); // Pure fade
reveal(".logo", { from: { scale: 0.9 } }); // Scale only
reveal(".card", { from: { opacity: 0, x: "-100%", rotate: "-5deg", blur: "0.5rem" } });
```

`StartState` has the properties `opacity`, `x`, `y`, `scale`, `rotate` and `blur`. A number for `x`, `y` or `blur` is in pixels, and a number for `rotate` is in degrees. A string can contain a CSS value with its unit.

The entrance adds its offset, scale, rotation and blur to the element's own `transform`, `translate`, `scale`, `rotate` and `filter`, with `composite: "add"`. It fades to the element's own opacity. So your styles stay in effect during the entrance, for example the `translate(-50%, -50%)` of a centred dialog. Do not reveal one element in two calls. The offsets add up.

Chromium runs an additive animation on the main thread. For an entrance that the browser can run on the compositor, use native keyframes.

## Native keyframes

For a custom animation, give a native `Keyframe[]` in `keyframes`. TypeScript does not let you use `from` and `keyframes` together. If JavaScript code gives both, core uses `keyframes` and ignores `from`.

```ts
import { reveal } from "@awesome-reveal/core";

reveal(".logo", {
  keyframes: [
    { opacity: 0, transform: "scale(.8)", easing: "cubic-bezier(.34,1.56,.64,1)" },
    { opacity: 1, transform: "scale(1)" },
  ],
});
```

You can use the native keyframe properties `easing`, `offset` and `composite`. The browser validates the values. The animation does not keep its last keyframe after it ends, so end your keyframes at the resting style of the element. To end at the element's own value, end with a neutral additive keyframe, for example `{ opacity: 0, composite: "add" }`. Like the generated entrance, an additive keyframe runs on the main thread in Chromium.

## Options

| Option                      | Default    | Meaning                                                         |
| --------------------------- | ---------- | --------------------------------------------------------------- |
| `from`                      | `"bottom"` | A side, or a complete `StartState`                              |
| `keyframes`                 | —          | Native `Keyframe[]`, instead of `from`                          |
| `duration`                  | 600        | The duration of the entrance, in milliseconds                   |
| `delay`                     | 0          | The time between the reveal and the entrance, in milliseconds   |
| `threshold`                 | 0          | The visible fraction that reveals the element, from 0 to 1      |
| `interval` (`cascade` only) | 80         | The time between the entrances of two children, in milliseconds |

The entrance plays one time. The observation stops at the reveal. There is no exit animation.

During the `delay`, the element stays in its start state. Use it to start separate elements at different times, for example a header and its content. Keep `delay` below about 300 ms. A long delay makes content appear late when the user scrolls quickly.

```ts
import { reveal } from "@awesome-reveal/core";

reveal(".hero h1", { from: "left" });
reveal(".hero p", { from: { opacity: 0 }, delay: 200 });
```

An element reveals when `threshold` of it is visible. If the viewport is too small to show `threshold` of the element, the element reveals when it enters the viewport. In a scroll container that is too small, it reveals when it leaves the visible area. Keep the default 0 for tall elements and long cascades.

`reveal()` observes the element while it waits. A start state with `opacity: 0`, such as each side, waits at the resting position and moves only when the entrance plays. Other start states and native keyframes wait at their first keyframe, so their offset, scale and rotation change the box that the observer sees. If an ancestor with `overflow` clips that box fully, the element does not reveal. `cascade()` observes the container, which does not move.

## Errors

The browser validates the options. If it rejects an easing or a duration, the element shows with no animation. If it rejects the threshold, the entrance plays immediately. `reveal` and `cascade` do not throw for an invalid option, but an invalid CSS selector throws the `SyntaxError` of `querySelectorAll`. The browser ignores an invalid CSS value in a keyframe, and reports nothing.

Core throws the browser's error from a microtask, so the console and your error tracker get it. Core throws each error message only one time on a page. WebKit gives the same message to different easing and duration errors. Fix the first error. Then reload the page to see the next error.

## Accessibility and SSR

Reduced motion is automatic. With `prefers-reduced-motion: reduce`, all the content shows immediately, with no animation and no delay. This includes each cascade child. If the preference changes to reduced motion, core cancels the pending and the active animations, and the call does not animate again.

The content that waits for its entrance also shows in print. After the print, it waits for its entrance again. Core uses the `beforeprint` and `afterprint` events. So it does not cover print styles that the browser applies without a print, such as a print emulation in developer tools.

Core creates the paused native animations when you call it. The browser can paint the content before your script runs, because core does not hide server-rendered content. The framework packages hide it with their own stylesheet, which they load automatically. To render reveals declaratively, use the React, Vue or Astro package. Each one has a `Reveal` and a `Cascade` component.

Core writes no `style` attribute, no inline script and no CSS. It uses `element.animate()`, which Content Security Policy does not restrict. So a policy that blocks inline styles and scripts, such as `style-src 'self'; script-src 'self'`, works with core.

Focus in a waiting element shows it at once, with no entrance, so a keyboard user does not focus invisible content. Focus in a waiting cascade container shows all its children. Focus during a running entrance or its delay does not shorten it, so keep `delay` and `interval` short. Hidden content stays in the accessibility tree. Keep important controls usable. Do not make large parts of a page depend on decorative motion.

## Exports and browser support

The root entry exports only `reveal`, `cascade` and their types: `Side`, `StartState`, `RevealOptions`, `CascadeOptions`, `RevealTarget` and `RevealHandle`. `@awesome-reveal/core/adapter` is the contract that the official framework packages use. It is not an API for imperative animations.

Core needs Chrome 104, Firefox 80 or Safari 16, or later. These versions support individual transform properties and additive keyframes. If IntersectionObserver or `Element.animate` is not available, the content reveals immediately and does not stay hidden. Give explicit values to the first keyframe of your native keyframes. An open WebKit bug ([212409](https://bugs.webkit.org/show_bug.cgi?id=212409)) can take an implicit start value from an earlier animation of the element. You can import the module where there is no DOM, for example on a server.

## Agent skills

The package includes the `adding-reveal-animations` agent skill. pnpm can link the skill into your project after you approve it. The skill documents the API on this page.

## License

MIT
