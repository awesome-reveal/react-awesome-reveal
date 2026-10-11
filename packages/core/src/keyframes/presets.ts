import { enter, type EnterOptions } from "./enter.js";
import type { KeyframesFactory } from "./types.js";

export type FadeOptions = Pick<EnterOptions, "easing">;

export const fade: KeyframesFactory<FadeOptions> = ({ easing } = {}) => enter({ easing });

export interface SlideOptions extends Pick<EnterOptions, "opacity" | "easing"> {
  /**
   * Direction in which the element moves.
   * @default "up"
   */
  direction?: "up" | "down" | "left" | "right";
  /**
   * Distance that the element moves. A number is in pixels.
   * @default 24
   */
  distance?: number | string;
}

function negate(distance: number | string): number | string {
  return typeof distance === "number" ? -distance : `calc(-1 * ${distance})`;
}

export const slide: KeyframesFactory<SlideOptions> = (options = {}) => {
  const { direction = "up", distance = 24, opacity, easing } = options;
  // Moving up or left starts at a positive offset.
  const offset = direction === "up" || direction === "left" ? distance : negate(distance);

  return direction === "up" || direction === "down"
    ? enter({ y: offset, opacity, easing })
    : enter({ x: offset, opacity, easing });
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
  amount?: number | string;
}

/**
 * Chromium and Safari composite `filter`; other engines repaint it on every frame,
 * so prefer it for small and medium elements.
 */
export const blur: KeyframesFactory<BlurOptions> = ({ amount = 8, opacity, easing } = {}) =>
  enter({ blur: amount, opacity, easing });
