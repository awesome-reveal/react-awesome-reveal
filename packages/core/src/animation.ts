import { report } from "./report.js";
import type { RevealOptions, StartState } from "./types.js";

const unit = (value: number | string, suffix: string) =>
  typeof value === "number" ? `${value}${suffix}` : value;

function entrance(options: RevealOptions): Keyframe[] {
  if (options.keyframes) return options.keyframes;
  const from = options.from ?? "bottom";
  const state: StartState =
    typeof from === "object"
      ? from
      : {
          opacity: 0,
          ...(from === "left" || from === "right"
            ? { x: from === "left" ? -24 : 24 }
            : { y: from === "top" ? -24 : 24 }),
        };
  const { opacity, x, y, scale, rotate, blur } = state;
  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
  const frames: Keyframe[] = [];
  const move: Keyframe = {};
  // "add" with neutral values ends at the element's own styles, with no implicit keyframe.
  const end: Keyframe = { offset: 1, composite: "add" };
  if (opacity !== undefined) {
    // Additive opacity cannot hide: Firefox and WebKit clamp a negative start before the addition.
    frames.push({ offset: 0, easing, opacity });
    end.opacity = 0;
  }
  if (x !== undefined || y !== undefined) {
    move.translate = `${unit(x ?? 0, "px")} ${unit(y ?? 0, "px")}`;
    end.translate = "0px 0px";
  }
  if (scale !== undefined) {
    move.scale = scale;
    end.scale = 1;
  }
  if (rotate !== undefined) {
    move.rotate = unit(rotate, "deg");
    end.rotate = "0deg";
  }
  if (blur !== undefined) {
    move.filter = `blur(${unit(blur, "px")})`;
    end.filter = "blur(0px)";
  }
  if (Object.keys(move).length) frames.push({ offset: 0, easing, composite: "add", ...move });
  return [...frames, end];
}

export const motionPreference = () =>
  typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : undefined;

// A paused native effect holds any start keyframes, so the code does not copy CSS properties to the element.
export function motion(element: Element, options: RevealOptions, delay = 0) {
  let animation: Animation | undefined;
  try {
    animation = element.animate?.(entrance(options), {
      duration: options.duration ?? 600,
      delay,
      fill: "backwards",
    });
    animation?.pause();
    if (animation) animation.currentTime = 0;
  } catch (error) {
    // The browser can reject native keyframes or timing. Then the content must not stay hidden.
    report(error);
    animation?.cancel();
    animation = undefined;
  }
  return {
    play() {
      // A waiting animation that page code finished or cancelled leaves the element at rest, so it does not play.
      if (animation?.playState === "paused") animation.play();
    },
    dispose() {
      animation?.cancel();
      animation = undefined;
    },
  };
}
