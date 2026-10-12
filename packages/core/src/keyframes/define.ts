import type { KeyframesFactory, RevealKeyframe } from "./types.js";

export interface KeyframesDefinition {
  /**
   * Returns the keyframe at progress `t`, from 0 to 1.
   * At `t = 1`, return the element's resting style.
   */
  keyframe: (t: number) => RevealKeyframe;
  /**
   * Number of samples between the start and the end of the animation. The value is rounded
   * and kept between 1 and 1000.
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
    const { keyframe, steps } = define(options ?? {});
    const count = Math.min(1000, Math.max(1, Math.round(steps ?? 30) || 1));

    return Array.from({ length: count + 1 }, (_, index) => keyframe(index / count));
  };
}
