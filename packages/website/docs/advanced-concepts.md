# Advanced Concepts

This section lists some useful insights in order to get the best from `react-awesome-reveal`.

## Intersection Observer

[Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is the API used to determine if an element is inside the viewport or not. [Browser support](http://caniuse.com/#feat=intersectionobserver) is really good – with [Safari adding support in 12.1](https://webkit.org/blog/8718/new-webkit-features-in-safari-12-1), all major browsers now support Intersection Observers natively.

If you need to support old browsers, add the polyfill for the Intersection Observer API.

### Polyfill

You can add the [polyfill](https://www.npmjs.com/package/intersection-observer) directly or use a service like [polyfill.io](https://polyfill.io/v2/docs) to add it when needed.

```bash npm2yarn
npm install --save intersection-observer
```

Then import it in your app:

```javascript
import "intersection-observer";
```

If you are using Webpack (or similar) you could use [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) to load the polyfill only if needed. A basic implementation could look something like this:

```javascript
/**
 * Do feature detection, to figure out which polyfills needs to be imported.
 **/
async function loadPolyfills() {
  if (typeof window.IntersectionObserver === "undefined") {
    await import("intersection-observer");
  }
}
```
