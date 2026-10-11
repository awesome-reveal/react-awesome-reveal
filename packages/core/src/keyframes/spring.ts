export interface SpringOptions {
  /**
   * How far the motion overshoots its end, from 0 (no overshoot) to 0.8.
   * @default 0.3
   */
  bounce?: number;
}

// The oscillation decays to 1/1000 of its amplitude at the end of the animation.
const decay = Math.log(1000);
const stops = 40;

function position(t: number, damping: number): number {
  const frequency = decay / damping;
  if (damping === 1) return 1 - (1 + frequency * t) * Math.exp(-frequency * t);
  const damped = frequency * Math.sqrt(1 - damping * damping);
  return (
    1 - Math.exp(-decay * t) * (Math.cos(damped * t) + (decay / damped) * Math.sin(damped * t))
  );
}

/**
 * Returns a CSS `linear()` easing that follows a spring, for the `easing` option of a preset.
 * Browsers without `linear()` (Safari before 17.2) get the default ease-out curve. On the server,
 * `spring` cannot check and returns `linear()`, so these browsers show the element with no animation.
 */
export function spring({ bounce = 0.3 }: SpringOptions = {}): string {
  if (typeof CSS === "object" && !CSS.supports("animation-timing-function", "linear(0, 1)"))
    return "cubic-bezier(0.22, 1, 0.36, 1)";

  // Above 0.8, the oscillations are too fast for the stops to follow. NaN falls back to 0.
  const damping = 1 - (bounce > 0 ? Math.min(bounce, 0.8) : 0);
  const values = Array.from({ length: stops + 1 }, (_, index) =>
    index === stops ? 1 : Math.round(position(index / stops, damping) * 1000) / 1000,
  );
  return `linear(${values.join(", ")})`;
}
