import type { RevealKeyframe } from "./keyframes/types.js";

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
  const {
    keyframes = defaultKeyframes,
    duration = 600,
    delay = 0,
    stagger,
    reducedMotion = "user",
  } = options;
  if (skipsAnimation(reducedMotion)) return () => {};

  const targets = stagger === undefined ? [element] : Array.from(element.children);
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
}
