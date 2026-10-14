import { report } from "./report.js";
import type { RevealOptions } from "./types.js";

// The browser validates the threshold. Without a working IntersectionObserver, the element reveals at once.
export function observe(
  element: Element,
  options: Pick<RevealOptions, "threshold">,
  onEnter: () => void,
): () => void {
  let observer: IntersectionObserver | undefined;
  let active = true;
  const disconnect = () => {
    active = false;
    observer?.disconnect();
    observer = undefined;
  };
  try {
    if (typeof IntersectionObserver === "undefined") {
      onEnter();
      return disconnect;
    }
    const minimum = options.threshold ?? 0;
    let seen = false;
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!active || !entry) return;
        // An element that leaves before it reaches the threshold, such as one taller than the viewport, must not stay hidden.
        if (entry.isIntersecting && entry.intersectionRatio < minimum) {
          seen = true;
          return;
        }
        if (!entry.isIntersecting && !seen) return;
        disconnect();
        onEnter();
      },
      { threshold: [0, minimum] },
    );
    observer.observe(element);
  } catch (error) {
    disconnect();
    report(error);
    onEnter();
  }
  return disconnect;
}
