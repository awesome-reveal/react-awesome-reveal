import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { observe } from "../../src/observe";
import {
  captureReports,
  mountBelowTheFold,
  scrollIntoView,
  scrollToTop,
  settle,
  showTopHalf,
} from "./helpers";

let element: HTMLElement;
let stop: (() => void) | undefined;

beforeEach(() => {
  element = mountBelowTheFold();
});

afterEach(() => {
  stop?.();
  stop = undefined;
  vi.unstubAllGlobals();
});

describe("observe", () => {
  it("reports the element when it enters the viewport", async () => {
    const onChange = vi.fn();
    stop = observe(element, {}, onChange);
    await settle();
    expect(onChange).not.toHaveBeenCalled();

    scrollIntoView(element);
    await expect.poll(() => onChange.mock.calls).toEqual([[true]]);
  });

  it("ignores entries that the observer queued before the stop", () => {
    let notify: IntersectionObserverCallback | undefined;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          notify = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    const onChange = vi.fn();
    observe(element, {}, onChange)();

    const entry = { isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry;
    notify!([entry], {} as IntersectionObserver);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("stops after the first entry with once", async () => {
    const onChange = vi.fn();
    stop = observe(element, {}, onChange);
    scrollIntoView(element);
    await expect.poll(() => onChange.mock.calls).toEqual([[true]]);

    scrollToTop();
    await settle();
    scrollIntoView(element);
    await settle();
    expect(onChange.mock.calls).toEqual([[true]]);
  });

  it("reports each entry and exit without once", async () => {
    const onChange = vi.fn();
    stop = observe(element, { once: false }, onChange);
    await expect.poll(() => onChange.mock.calls).toEqual([[false]]);

    scrollIntoView(element);
    await expect.poll(() => onChange.mock.calls).toEqual([[false], [true]]);
    scrollToTop();
    await expect.poll(() => onChange.mock.calls).toEqual([[false], [true], [false]]);
  });

  it("waits for the threshold fraction of the element to be visible", async () => {
    const onChange = vi.fn();
    stop = observe(element, { threshold: 1 }, onChange);
    showTopHalf(element);
    await settle();
    expect(onChange).not.toHaveBeenCalled();

    scrollIntoView(element);
    await expect.poll(() => onChange.mock.calls).toEqual([[true]]);
  });

  // Browsers ignore the root margin of the implicit root in an iframe, where the tests run.
  it("passes the root margin to the observer", () => {
    const observers: IntersectionObserver[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class extends IntersectionObserver {
        constructor(...args: ConstructorParameters<typeof IntersectionObserver>) {
          super(...args);
          observers.push(this);
        }
      },
    );
    stop = observe(element, { rootMargin: "10px 20px" }, () => {});
    expect(observers.map(({ rootMargin }) => rootMargin)).toEqual(["10px 20px 10px 20px"]);
  });

  it("reports nothing after the returned function is called", async () => {
    const onChange = vi.fn();
    observe(element, {}, onChange)();
    scrollIntoView(element);
    await settle();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reports the element as in view at once without IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const onChange = vi.fn();
    stop = observe(element, {}, onChange);
    expect(onChange.mock.calls).toEqual([[true]]);
  });

  it.each([
    ["a threshold above 1", { threshold: 2 }],
    ["a threshold that is NaN", { threshold: Number.NaN }],
    ["a root margin with no unit", { rootMargin: "foo" }],
    ["a root margin in em", { rootMargin: "1em" }],
  ])(
    "reports the element as in view when the browser rejects the options: %s",
    async (_, options) => {
      captureReports();
      const onChange = vi.fn();
      expect(() => (stop = observe(element, options, onChange))).not.toThrow();
      expect(onChange.mock.calls).toEqual([[true]]);
    },
  );

  it("treats null options as unset", async () => {
    const onChange = vi.fn();
    stop = observe(element, { threshold: null, rootMargin: null, once: null } as never, onChange);
    scrollIntoView(element);
    await vi.waitFor(() => expect(onChange).toHaveBeenCalledWith(true));
  });
});
