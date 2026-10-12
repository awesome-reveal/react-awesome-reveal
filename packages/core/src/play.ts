import type { RevealKeyframe } from "./keyframes/types.js";
import { report } from "./report.js";

export interface PlayOptions {
  /**
   * Keyframes to play when the element is revealed. They must end at the element's resting
   * style, because the animation does not persist after it finishes.
   * @default slide()
   */
  keyframes?: RevealKeyframe[];
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
   * `"user"` skips the animation when the user prefers reduced motion,
   * `"always"` always skips it, and `"never"` always plays it.
   * @default "user"
   */
  reducedMotion?: "user" | "always" | "never";
}

// The output of slide(), inlined so that consumers who pass their own keyframes do not bundle it.
export const defaultKeyframes: RevealKeyframe[] = [
  { opacity: 0, easing: "cubic-bezier(0.22, 1, 0.36, 1)", transform: "translate(0px, 24px)" },
  {},
];

function supportsLinear(): boolean {
  return typeof CSS !== "object" || CSS.supports("animation-timing-function", "linear(0, 1)");
}

function skipsAnimation(reducedMotion: PlayOptions["reducedMotion"]): boolean {
  if (reducedMotion !== "user") return reducedMotion === "always";
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Plays the keyframes on the element, or on its children with `stagger`.
 * Call it in the same frame that removes the hidden style, or the element flashes at its
 * resting style for one frame.
 * @returns A function that cancels the animation.
 */
export function play(element: Element, options: PlayOptions = {}): () => void {
  const { stagger } = options;
  const keyframes = options.keyframes ?? defaultKeyframes;
  const duration = options.duration ?? 600;
  const delay = options.delay ?? 0;
  if (skipsAnimation(options.reducedMotion ?? "user")) return () => {};

  const targets = stagger == null ? [element] : Array.from(element.children);
  const animations = targets.map((target, index) => {
    // Without Element.animate (jsdom, old engines), the element just appears.
    try {
      return target.animate?.(keyframes, {
        duration,
        delay: delay + index * (stagger ?? 0),
        fill: "backwards",
      });
    } catch (error) {
      // An engine without linear() throws a TypeError for a spring. The element shows at its resting style.
      if (supportsLinear()) report(error);
      return undefined;
    }
  });
  return () => {
    for (const animation of animations) animation?.cancel();
  };
}
