import { cascadeInterval, motionPreference, motions } from "./animation.js";
import { observe } from "./observe.js";
import type { CascadeOptions, RevealHandle, RevealOptions, RevealTarget } from "./types.js";

function resolveTargets(target: RevealTarget): Element[] {
  if (typeof target === "string")
    return typeof document === "undefined" ? [] : Array.from(document.querySelectorAll(target));
  return "nodeType" in target ? [target] : Array.from(target);
}

function start(target: RevealTarget, options: RevealOptions, interval?: number): RevealHandle {
  options = { ...options };
  let cleanups: (() => void)[] = [];
  let waiting: ReturnType<typeof motions> = [];
  const preference = motionPreference();
  const dispose = () => {
    for (const cleanup of cleanups) cleanup();
    cleanups = [];
    waiting = [];
    preference?.removeEventListener?.("change", onPreference);
    globalThis.removeEventListener?.("beforeprint", onPrint);
    globalThis.removeEventListener?.("afterprint", onPrint);
  };
  // No stylesheet shows the waiting entrances in print, so they move past their fill until the print ends.
  const onPrint = (event: Event) => {
    for (const effect of waiting) effect.print(event.type === "beforeprint");
  };
  const onPreference = () => {
    if (preference?.matches) dispose();
  };
  if (preference?.matches) return { dispose };
  for (const element of new Set(resolveTargets(target))) {
    const effects = motions(element, options, interval);
    waiting.push(...effects);
    const disconnect = observe(element, options, () => {
      for (const effect of effects) effect.play();
    });
    cleanups.push(() => {
      disconnect();
      for (const effect of effects) effect.dispose();
    });
  }
  preference?.addEventListener?.("change", onPreference);
  globalThis.addEventListener?.("beforeprint", onPrint);
  globalThis.addEventListener?.("afterprint", onPrint);
  return { dispose };
}

/** Animates each target element when it enters the viewport. It needs no stylesheet. */
export function reveal(target: RevealTarget, options: RevealOptions = {}): RevealHandle {
  return start(target, options);
}

/** Animates the direct element children of each container in sequence when it enters the viewport. */
export function cascade(target: RevealTarget, options: CascadeOptions = {}): RevealHandle {
  return start(target, options, cascadeInterval(options));
}
