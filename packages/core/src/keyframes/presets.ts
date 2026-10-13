import { enter, type EnterOptions } from "./enter.js";
import { offsetFrom, type Side } from "./from.js";
import type { KeyframesFactory } from "./types.js";

export type FadeOptions = Pick<EnterOptions, "easing">;

export const fade: KeyframesFactory<FadeOptions> = ({ easing } = {}) => enter({ easing });

export interface SlideOptions extends Pick<EnterOptions, "opacity" | "easing"> {
  /**
   * Side of its resting position where the element starts.
   * @default "bottom"
   */
  from?: Side;
  /**
   * Distance that the element moves. A number is in pixels.
   * @default 24
   */
  distance?: number | string;
}

export const slide: KeyframesFactory<SlideOptions> = (options = {}) => {
  const { from = "bottom", distance = 24, opacity, easing } = options;
  return enter({ ...offsetFrom(from, distance), opacity, easing });
};

export interface ScaleOptions extends Pick<EnterOptions, "opacity" | "easing"> {
  /**
   * Scale at the start of the animation.
   * @default 0.95
   */
  from?: number;
}

export const scale: KeyframesFactory<ScaleOptions> = ({ from = 0.95, opacity, easing } = {}) =>
  enter({ scale: from, opacity, easing });

export interface BlurOptions extends Pick<EnterOptions, "opacity" | "easing"> {
  /**
   * Blur radius at the start of the animation. A number is in pixels.
   * @default 8
   */
  from?: number | string;
}

/**
 * Chromium and Safari composite `filter`; other engines repaint it on every frame,
 * so prefer it for small and medium elements.
 */
export const blur: KeyframesFactory<BlurOptions> = ({ from = 8, opacity, easing } = {}) =>
  enter({ blur: from, opacity, easing });

export interface PopOptions extends Pick<EnterOptions, "opacity" | "easing"> {
  /**
   * Scale at the start of the animation.
   * @default 0.8
   */
  from?: number;
}

/**
 * With the default easing, grows past its resting size, then settles back.
 */
export const pop: KeyframesFactory<PopOptions> = ({
  from = 0.8,
  opacity,
  easing = "cubic-bezier(0.34, 1.56, 0.64, 1)",
} = {}) => enter({ scale: from, opacity, easing });
