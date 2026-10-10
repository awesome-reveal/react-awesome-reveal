"use client";

import { type CSSProperties, type RefCallback, useEffect, useLayoutEffect, useState } from "react";

import type { RevealKeyframe } from "./keyframes/types.js";

export interface RevealOptions {
  /**
   * Keyframes to play when the element is revealed. They must end at the element's resting
   * style, because the animation does not persist after it finishes.
   */
  keyframes: RevealKeyframe[];
  /**
   * Animation duration, in milliseconds.
   * @default 600
   */
  duration?: number;
  /**
   * Delay before the animation starts, in milliseconds.
   * @default 0
   */
  delay?: number;
  /**
   * Animates the element children instead of the element, each one this many milliseconds
   * after the previous one.
   */
  stagger?: number;
  /**
   * Fraction of the element, between 0 and 1, that must be visible to reveal it.
   * @default 0
   */
  threshold?: number;
  /**
   * Grows or shrinks the viewport area that reveals the element, as a CSS margin.
   * @default "0px"
   */
  rootMargin?: string;
  /**
   * Reveals the element only the first time it enters the viewport.
   * When `false`, the element hides again when it leaves the viewport.
   * @default true
   */
  once?: boolean;
  /**
   * Controls the reveal manually. When set, the viewport is not observed.
   */
  when?: boolean;
  /**
   * `"user"` skips the animation when the user prefers reduced motion,
   * `"always"` always skips it, and `"never"` always plays it.
   * @default "user"
   */
  reducedMotion?: "user" | "always" | "never";
}

export interface RevealState<T extends Element> {
  /** Attach to the element to reveal. */
  ref: RefCallback<T>;
  revealed: boolean;
  /** Hides the element until it is revealed. Merge it into the element style. */
  style: CSSProperties | undefined;
}

const hiddenStyle: CSSProperties = { opacity: 0 };

// React 18 warns about useLayoutEffect during server rendering.
const useIsomorphicLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

function skipsAnimation(reducedMotion: RevealOptions["reducedMotion"]): boolean {
  if (reducedMotion !== "user") return reducedMotion === "always";
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReveal<T extends Element = HTMLElement>(options: RevealOptions): RevealState<T> {
  const {
    keyframes,
    duration = 600,
    delay = 0,
    stagger,
    threshold = 0,
    rootMargin,
    once = true,
    when,
    reducedMotion = "user",
  } = options;
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  const revealed = when ?? inView;
  const settled = once && inView;

  useEffect(() => {
    if (!node || when !== undefined || settled) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Array.prototype.at is newer than the browsers this library supports.
        const entry = entries[entries.length - 1]!;
        const visible = entry.isIntersecting && entry.intersectionRatio >= threshold;
        // With `once`, the `settled` change disconnects the observer.
        if (visible || !once) setInView(visible);
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, when, settled, threshold, rootMargin, once]);

  // Starts in the commit that removes the hidden style. Option changes wait for the next reveal.
  useIsomorphicLayoutEffect(() => {
    if (!node || !revealed || skipsAnimation(reducedMotion)) return;

    const targets = stagger === undefined ? [node] : Array.from(node.children);
    const animations = targets.map((target, index) =>
      // Without Element.animate (jsdom, old engines), the element just appears.
      target.animate?.(keyframes, {
        duration,
        delay: delay + index * (stagger ?? 0),
        fill: "backwards",
      }),
    );
    return () => {
      for (const animation of animations) animation?.cancel();
    };
  }, [node, revealed]);

  return { ref: setNode, revealed, style: revealed ? undefined : hiddenStyle };
}
