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
  const start: Keyframe = { easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
  if (opacity !== undefined) start.opacity = opacity;
  const transforms: string[] = [];
  if (x !== undefined || y !== undefined)
    transforms.push(`translate(${unit(x ?? 0, "px")}, ${unit(y ?? 0, "px")})`);
  if (scale !== undefined) transforms.push(`scale(${scale})`);
  if (rotate !== undefined) transforms.push(`rotate(${unit(rotate, "deg")})`);
  if (transforms.length) start.transform = transforms.join(" ");
  if (blur !== undefined) start.filter = `blur(${unit(blur, "px")})`;
  return [start, {}];
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
  } catch {
    // The browser can reject native keyframes or timing. Then the content must not stay hidden.
    animation?.cancel();
    animation = undefined;
  }
  return {
    play() {
      if (animation) {
        animation.currentTime = 0;
        animation.play();
      }
    },
    reset() {
      if (animation) {
        animation.pause();
        animation.currentTime = 0;
      }
    },
    dispose() {
      animation?.cancel();
      animation = undefined;
    },
  };
}
