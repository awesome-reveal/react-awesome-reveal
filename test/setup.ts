import "@testing-library/jest-dom/vitest";
// Registers the IntersectionObserver mock in beforeEach/afterEach hooks.
import "react-intersection-observer/test-utils";

// React reports invalid props, missing keys and act() problems only through the console.
beforeEach(() => {
  vi.spyOn(console, "error");
  vi.spyOn(console, "warn");
});

afterEach(() => {
  expect(console.error).not.toHaveBeenCalled();
  expect(console.warn).not.toHaveBeenCalled();
  vi.restoreAllMocks();
});
