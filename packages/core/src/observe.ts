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
    observer = new IntersectionObserver(
      (entries) => {
        if (!active) return;
        const entry = entries[entries.length - 1];
        if (!entry?.isIntersecting || entry.intersectionRatio < minimum) return;
        disconnect();
        onEnter();
      },
      { threshold: minimum },
    );
    observer.observe(element);
  } catch {
    disconnect();
    onEnter();
  }
  return disconnect;
}
