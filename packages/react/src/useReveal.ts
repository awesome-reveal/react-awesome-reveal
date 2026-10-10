"use client";

import { type CSSProperties, type RefCallback, useEffect, useLayoutEffect, useState } from "react";

import {
  hiddenStyle,
  observe,
  play,
  type RevealOptions as CoreRevealOptions,
} from "@awesome-reveal/core";

export interface RevealOptions extends CoreRevealOptions {
  /**
   * Controls the reveal manually. When set, the viewport is not observed.
   */
  when?: boolean;
}

export interface RevealState<T extends Element> {
  /** Attach to the element to reveal. */
  ref: RefCallback<T>;
  revealed: boolean;
  /** Hides the element until it is revealed. Merge it into the element style. */
  style: CSSProperties | undefined;
}

// React 18 warns about useLayoutEffect during server rendering.
const useIsomorphicLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

export function useReveal<T extends Element = HTMLElement>(options: RevealOptions): RevealState<T> {
  const { threshold, rootMargin, once = true, when } = options;
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  const revealed = when ?? inView;
  const settled = once && inView;

  useEffect(() => {
    if (!node || when !== undefined || settled) return;
    return observe(node, options, setInView);
  }, [node, when, settled, threshold, rootMargin, once]);

  // Starts in the commit that removes the hidden style. Option changes wait for the next reveal.
  useIsomorphicLayoutEffect(() => {
    if (!node || !revealed) return;
    return play(node, options);
  }, [node, revealed]);

  return { ref: setNode, revealed, style: revealed ? undefined : hiddenStyle };
}
