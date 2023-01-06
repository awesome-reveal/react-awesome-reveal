---
title: Older Browsers
sortOrder: 7
---

Older browsers _might_ be supported, depending on the React version you are using. React 18 [dropped support for Internet Explorer](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#dropping-support-for-internet-explorer), but you can keep using React 17 to overcome this.

Emotion, the companion dependency of **React Awesome Reveal**, [currently supports older browsers](https://emotion.sh/docs/introduction#browser-requirements), including Internet Explorer 11. However, this might change in future updates of the library.

In any case, the Intersection Observer API is not supported on older browsers, so you will need to _polyfill_ it.

## Polyfilling the Intersection Observer API

You can add the [polyfill for the Intersection Observer API](https://www.npmjs.com/package/intersection-observer) directly or by using a service like [polyfill.io](https://polyfill.io/v2/docs) to inject it when needed:

```shell
yarn add intersection-observer
```

Then import it in your app:

```typescript
import "intersection-observer";
```

### Dynamic Import

If you are using Vite, Webpack, Parcel or any other modern bundler, you can also use [dynamic import](https://webpack.js.org/guides/code-splitting/#dynamic-imports) to load the polyfill only if needed. A basic implementation could look something like this:

```typescript
// Do feature detection, to figure out which polyfills needs to be imported
async function loadPolyfills() {
  if (typeof window.IntersectionObserver === "undefined") {
    await import("intersection-observer");
  }
}
```
