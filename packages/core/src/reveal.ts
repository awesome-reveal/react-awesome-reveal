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
  const preference = motionPreference();
  const dispose = () => {
    for (const cleanup of cleanups) cleanup();
    cleanups = [];
    preference?.removeEventListener?.("change", onPreference);
  };
  const onPreference = () => {
    if (preference?.matches) dispose();
  };
  if (preference?.matches) return { dispose };
  for (const element of new Set(resolveTargets(target))) {
    const effects = motions(element, options, interval);
    const disconnect = observe(element, options, () => {
      for (const effect of effects) effect.play();
    });
    cleanups.push(() => {
      disconnect();
      for (const effect of effects) effect.dispose();
    });
  }
  preference?.addEventListener?.("change", onPreference);
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
