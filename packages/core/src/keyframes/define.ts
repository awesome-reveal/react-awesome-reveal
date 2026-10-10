import type { KeyframesFactory, RevealKeyframe } from "./types.js";

export interface KeyframesDefinition {
  /**
   * Returns the keyframe at progress `t`, from 0 to 1, after easing.
   * At `t = 1`, return the element's resting style.
   */
  keyframe: (t: number) => RevealKeyframe;
  /**
   * Maps linear progress to eased progress, for example a spring or an elastic curve.
   * @default (t) => t
   */
  easing?: (t: number) => number;
  /**
   * Number of samples between the start and the end of the animation.
   * @default 30
   */
  steps?: number;
}

/**
 * Defines keyframes from a function of the animation progress.
 */
export function defineKeyframes<Options extends object = Record<string, never>>(
  define: (options: Partial<Options>) => KeyframesDefinition,
): KeyframesFactory<Options> {
  return (options) => {
    const { keyframe, easing = (t) => t, steps = 30 } = define(options ?? {});

    return Array.from({ length: steps + 1 }, (_, index) => keyframe(easing(index / steps)));
  };
}
