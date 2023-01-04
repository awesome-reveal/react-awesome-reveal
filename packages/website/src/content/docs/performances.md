---
title: Performances
sortOrder: 5
---

This library has been designed to be _performant_ :rocket: in all possible ways. This goal has been achieved by leveraging [native browser technologies](#native-technologies-used) and by [restricting the scope](#library-scope).

## Native Technologies Used

Two native browser technologies are at the core of the **React Awesome Reveal** performances.

### Intersection Observer API

The [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is a performant, modern and well supported API to determine when DOM elements enters and exits the browser viewport. Using this API, it is possible to trigger specific actions when a certain element appears in the window, or when it leaves it.

The trick used by **React Awesome Reveal** is to add and remove CSS classes to the element(s) wrapped by the animated primitives in response to visibility change events. These classes contain rules that implement a variety of animations.

### CSS Animations

[CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations) is an extension to the CSS specification that let the value of certain CSS properties change over time.

Before its introduction, the only way to animate elements on the page was using some JavaScript code that imperatively updates the CSS properties.

Using JavaScript to implement animations is less performant than using CSS Animations for a number of reasons:

- CSS Animations do not run in the JavaScript thread, making them non-blocking for the rest of the business logic
- The browser can leverage the hardware acceleration available on the device, improving both performances and power efficiency

## Library Scope

**React Awesome Reveal** does not implement tons of features. It is focused on providing common and highly-optimized animated primitives for React applications, and it is not bloated with code that does more than that.

At the same time, it is flexible enough to let you implement custom animations by using the generic `Reveal` primitive. Refer to the [Custom Animations](/docs/custom-animations) guide to know more.
