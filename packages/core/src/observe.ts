import type { RevealOptions } from "./types.js";

// The browser validates the threshold. Without a working IntersectionObserver, the element reveals at once.
export function observe(
  element: Element,
  options: Pick<RevealOptions, "threshold" | "once">,
  onChange: (inView: boolean) => void,
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
      onChange(true);
      return disconnect;
    }
    const minimum = options.threshold ?? 0;
    observer = new IntersectionObserver(
      (entries) => {
        if (!active) return;
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const inView = entry.isIntersecting && entry.intersectionRatio >= minimum;
        if (inView && options.once !== false) disconnect();
        if (inView || options.once === false) onChange(inView);
      },
      { threshold: minimum },
    );
    observer.observe(element);
  } catch {
    disconnect();
    onChange(true);
  }
  return disconnect;
}
