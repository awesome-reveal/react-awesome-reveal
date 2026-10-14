import { motion, motionPreference } from "./animation.js";
import { observe } from "./observe.js";
import type { RevealOptions as CoreRevealOptions } from "./types.js";

/** Configures a declarative entrance and optional manual control. */
export type RevealOptions = CoreRevealOptions & {
  /** Controls the reveal manually. `true` reveals, `false` hides, and no value or `null` lets the viewport decide. */
  when?: boolean | null;
  /** Runs once for each reveal, when the entrance starts. */
  onReveal?: (element: Element) => void;
};

/** Binds a declarative reveal to a framework rendering lifecycle. */
export interface RevealStore {
  /**
   * Tells if the element is revealed. It is `false` at creation, also with `when: true`, so that a
   * server renderer can read it.
   */
  readonly revealed: boolean;
  /**
   * Calls `listener` when `revealed` changes. The listener must hide or show the element before
   * the next frame. There is one listener: a new call replaces it.
   * @returns A function that removes the listener.
   */
  subscribe(listener: (revealed: boolean) => void): () => void;
  /**
   * Observes and animates the element. A new element keeps the state and does not play the
   * animation again. `null` stops the observation and cancels the animation.
   */
  attach(element: Element | null): void;
  /**
   * Replaces the options. A change of `when`, `threshold` or `once` applies at once.
   * The other options apply at the next reveal. A reveal plays on the attached element, so when the
   * element and `when` change together, attach the new element first.
   */
  setOptions(options: RevealOptions): void;
}

/** Gives the attributes that hide framework content before hydration. */
export const hiddenAttributes = { "data-reveal": "hidden" } as const;

const restarts = ["when", "threshold", "once"] as const;

// The animation starts before the next paint, so no flash shows when the adapter removes the SSR hiding.
function play(element: Element, options: CoreRevealOptions): () => void {
  if (motionPreference()?.matches) return () => {};
  const effect = motion(element, options);
  effect.play();
  return effect.dispose;
}

function start(element: Element) {
  element.ownerDocument.documentElement.setAttribute("data-reveal-ready", "");
}

/** Creates a reveal binding for an official framework adapter. */
export function createReveal(options: RevealOptions = {}): RevealStore {
  // A copy, so that a caller who mutates and passes the same options object again still restarts the observer.
  let current = { ...options };
  let element: Element | null = null;
  let detached: Element | null = null;
  let inView = false;
  let revealed = false;
  let played = false;
  // A replay on the same element, such as in React StrictMode, is not a new reveal.
  let notified = false;
  let listener: (revealed: boolean) => void = () => {};
  let cancel = () => {};
  let disconnect = () => {};
  const preference = motionPreference();
  function onPreference() {
    if (preference?.matches && element) {
      cancel();
      disconnect();
      set(true);
    }
  }

  function set(next: boolean) {
    if (next !== revealed) {
      revealed = next;
      played = false;
      notified = false;
      cancel();
      listener(next);
    }
    if (revealed && element && !played) {
      played = true;
      cancel = play(element, current);
      if (!notified) {
        notified = true;
        // A throwing callback must not break the render or the effect that attached the element.
        try {
          current.onReveal?.(element);
        } catch (error) {
          report(error);
        }
      }
    }
  }

  function connect() {
    disconnect();
    disconnect = () => {};
    if (preference?.matches && element) return set(true);
    if (element && typeof element.animate !== "function") return set(true);
    if (current.when != null) {
      // Nobody observes the element while `when` decides, so the last report is stale.
      inView = false;
      return set(current.when);
    }
    set(inView);
    if (element && !(inView && current.once !== false))
      disconnect = observe(element, current, (value) => set((inView = value)));
  }

  return {
    get revealed() {
      return revealed;
    },
    subscribe(next) {
      listener = next;
      return () => {
        if (listener === next) listener = () => {};
      };
    },
    attach(next) {
      if (next === element) return;
      if (next) start(next);
      cancel();
      preference?.removeEventListener?.("change", onPreference);
      if (next) preference?.addEventListener?.("change", onPreference);
      // The same element that comes back right after null plays again, because `attach(null)`
      // cancelled its animation before it could finish.
      if (next && next === detached) played = false;
      detached = next ? null : element;
      element = next;
      connect();
    },
    setOptions(next) {
      const previous = current;
      current = { ...next };
      if (restarts.some((key) => (next[key] ?? null) !== (previous[key] ?? null))) connect();
    },
  };
}

const reported = new Set<string>();

// Throws from a microtask, so the error reaches the window error event and error trackers, but not a render or an effect.
function report(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (reported.has(message)) return;
  reported.add(message);
  queueMicrotask(() => {
    throw error;
  });
}
