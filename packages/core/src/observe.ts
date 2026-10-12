import { report } from "./report.js";

export interface ObserveOptions {
  /**
   * Fraction of the element, between 0 and 1, that must be visible to reveal it.
   * @default 0
   */
  threshold?: number;
  /**
   * Grows or shrinks the viewport area that reveals the element, as a CSS margin in `px` or `%`.
   * @default "0px"
   */
  rootMargin?: string;
  /**
   * Reveals the element only the first time it enters the viewport.
   * When `false`, the element hides again when it leaves the viewport.
   * @default true
   */
  once?: boolean;
}

/**
 * Calls `onChange` when the element enters the viewport and, without `once`, when it leaves it.
 * Without `IntersectionObserver`, or when the browser rejects the options, it calls
 * `onChange(true)` at once. The browser error is reported, but not thrown.
 * @returns A function that stops the observation.
 */
export function observe(
  element: Element,
  options: ObserveOptions,
  onChange: (inView: boolean) => void,
): () => void {
  const { threshold, rootMargin, once } = options;
  const minimum = threshold ?? 0;
  if (typeof IntersectionObserver === "undefined") {
    onChange(true);
    return () => {};
  }

  let observer: IntersectionObserver;
  try {
    observer = new IntersectionObserver(
      (entries) => {
        // Array.prototype.at is newer than the browsers this library supports.
        const entry = entries[entries.length - 1]!;
        const inView = entry.isIntersecting && entry.intersectionRatio >= minimum;
        if (inView && once !== false) observer.disconnect();
        if (inView || once === false) onChange(inView);
      },
      { threshold: minimum, rootMargin: rootMargin ?? undefined },
    );
    observer.observe(element);
  } catch (error) {
    report(error);
    onChange(true);
    return () => {};
  }
  return () => {
    observer.disconnect();
    // disconnect() does not drop the entries that are already queued, so the callback can still run.
    onChange = () => {};
  };
}
