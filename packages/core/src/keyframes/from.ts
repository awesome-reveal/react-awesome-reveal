import type { EnterOptions } from "./enter.js";

/** The side of its resting position where the element starts. */
export type Side = "top" | "bottom" | "left" | "right";

/** The state where the element starts, as for `enter()`. */
export type StartState = Omit<EnterOptions, "easing">;

function negate(distance: number | string): number | string {
  return typeof distance === "number" ? -distance : `calc(-1 * ${distance})`;
}

/** The start offset of an element that enters from `side`. An unknown side is `"bottom"`. */
export function offsetFrom(side: Side, distance: number | string): StartState {
  const offset = side === "top" || side === "left" ? negate(distance) : distance;
  return side === "left" || side === "right" ? { x: offset } : { y: offset };
}
