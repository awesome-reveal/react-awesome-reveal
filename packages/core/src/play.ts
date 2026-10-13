import { enter } from "./keyframes/enter.js";
import { offsetFrom, type Side, type StartState } from "./keyframes/from.js";
import { spring } from "./keyframes/spring.js";
import type { RevealKeyframe } from "./keyframes/types.js";
import { report } from "./report.js";

export interface PlayOptions {
  /**
   * Keyframes to play when the element is revealed. They must end at the element's resting
   * style, because the animation does not persist after it finishes.
   * They replace `from`, `distance`, `easing` and `bounce`.
   */
  keyframes?: RevealKeyframe[];
  /**
   * Where the element starts: a side of its resting position, or a start state, such as
   * `{ scale: 0.9, blur: 8 }`. The element fades in from the start `opacity`, which is `0`.
   * @default "bottom"
   */
  from?: Side | StartState;
  /**
   * Distance from the side of `from`. A number is in pixels.
   * @default 24
   */
  distance?: number | string;
  /**
   * CSS easing of the entrance, or `"spring"` for a spring with `bounce`.
   * @default "cubic-bezier(0.22, 1, 0.36, 1)"
   */
  easing?: string;
  /**
   * Overshoot of the spring, from 0 to 0.8. It turns the spring on when `easing` is not set.
   * @default 0.3
   */
  bounce?: number;
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

function keyframesOf(options: PlayOptions): RevealKeyframe[] {
  const { keyframes, from, distance, easing, bounce } = options;
  if (keyframes != null) return keyframes;
  const start =
    typeof from === "object" && from ? from : offsetFrom(from ?? "bottom", distance ?? 24);
  // The spring resolves here, in the browser, which can check the support of linear().
  const springs = easing === "spring" || (easing == null && bounce != null);
  return enter({
    ...start,
    easing: springs ? spring({ bounce: bounce ?? undefined }) : (easing ?? undefined),
  });
}

function supportsLinear(): boolean {
  return typeof CSS !== "object" || CSS.supports("animation-timing-function", "linear(0, 1)");
}

function skipsAnimation(reducedMotion: PlayOptions["reducedMotion"]): boolean {
  if (reducedMotion !== "user") return reducedMotion === "always";
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Plays the keyframes on the element, or on its children with `stagger`.
 * Call it in the same frame that removes the hidden attribute, or the element flashes at its
 * resting style for one frame.
 * @returns A function that cancels the animation.
 */
export function play(element: Element, options: PlayOptions = {}): () => void {
  const { stagger } = options;
  const keyframes = keyframesOf(options);
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
