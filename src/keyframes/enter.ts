import type { KeyframesFactory, RevealKeyframe } from "./types.js";

export interface EnterOptions {
  /**
   * Opacity at the start of the animation.
   * @default 0
   */
  opacity?: number;
  /** Horizontal start offset. A number is in pixels. */
  x?: number | string;
  /** Vertical start offset. A number is in pixels. */
  y?: number | string;
  /** Scale at the start of the animation. */
  scale?: number;
  /** Rotation at the start of the animation. A number is in degrees. */
  rotate?: number | string;
  /** Blur radius at the start of the animation. A number is in pixels. */
  blur?: number | string;
  /**
   * @default "cubic-bezier(0.22, 1, 0.36, 1)"
   */
  easing?: string;
}

function withUnit(value: number | string, unit: string): string {
  return typeof value === "number" ? `${value}${unit}` : value;
}

/**
 * Starts from the given state and ends at the element's own style.
 */
export const enter: KeyframesFactory<EnterOptions> = (options = {}) => {
  const {
    opacity = 0,
    x,
    y,
    scale,
    rotate,
    blur,
    easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  } = options;

  const transforms: string[] = [];
  if (x !== undefined || y !== undefined)
    transforms.push(`translate(${withUnit(x ?? 0, "px")}, ${withUnit(y ?? 0, "px")})`);
  if (scale !== undefined) transforms.push(`scale(${scale})`);
  if (rotate !== undefined) transforms.push(`rotate(${withUnit(rotate, "deg")})`);

  const from: RevealKeyframe = { opacity, easing };
  if (transforms.length > 0) from.transform = transforms.join(" ");
  if (blur !== undefined) from.filter = `blur(${withUnit(blur, "px")})`;

  return [from, {}];
};
