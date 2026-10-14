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
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return disconnect;
  }
  const minimum = options.threshold ?? 0;
  let seen = false;
  try {
    observer = new IntersectionObserver(
      (entries) => {
        // A fast scroll can deliver the entry below the threshold and the exit in one report.
        for (const entry of entries) {
          if (!active) return;
          // An element that leaves before it reaches the threshold, such as one taller than the viewport, must not stay hidden.
          if (entry.isIntersecting && entry.intersectionRatio < minimum) seen = true;
          else if (entry.isIntersecting || seen) {
            disconnect();
            onEnter();
          }
        }
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
