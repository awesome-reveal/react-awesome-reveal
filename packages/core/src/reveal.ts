import { type ObserveOptions, observe } from "./observe.js";
import { type PlayOptions, play } from "./play.js";
import { report } from "./report.js";

export interface RevealOptions extends PlayOptions, ObserveOptions {
  /**
   * Controls the reveal manually. When set, the viewport is not observed.
   * `null` is the same as `undefined`: the viewport decides.
   */
  when?: boolean | null;
  /** Called with the element each time it is revealed, in the task that starts the animation. */
  onReveal?: (element: Element) => void;
}

export interface RevealStore {
  /** `false` when created, also with `when: true`. A server renderer can read it. */
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
   * Replaces the options. A change of `when`, `threshold`, `rootMargin` or `once` applies at once.
   * The other options apply at the next reveal. A reveal plays on the attached element, so when the
   * element and `when` change together, attach the new element first.
   */
  setOptions(options: RevealOptions): void;
}

export interface RevealGroup {
  /**
   * Replaces the options of all the elements. A change of `when` applies at once. A change of
   * `threshold`, `rootMargin` or `once` restarts the observer. The other options apply at the next
   * reveal.
   */
  setOptions(options: RevealOptions): void;
  /** Stops the observation, cancels the animations and shows the elements. */
  destroy(): void;
}

export interface RevealController extends RevealGroup {
  readonly revealed: boolean;
}

/** Hides an element until it is revealed, with the rule of `reveal.css`. Server renderers apply it. */
export const hiddenAttributes = { "data-reveal": "hidden" } as const;

const restarts = ["when", "threshold", "rootMargin", "once"] as const;

let checked = false;

// The first element marks the page as started for the recovery CSS, and checks that reveal.css loaded.
function start(element: Element) {
  const root = element.ownerDocument.documentElement;
  if (!root.hasAttribute("data-reveal-ready")) root.setAttribute("data-reveal-ready", "");
  // The recovery script shows the hidden elements, so a late script must not report them.
  if (checked || root.hasAttribute("data-reveal-failed")) return;
  if (!element.isConnected || element.getAttribute("data-reveal") !== "hidden") return;
  checked = true;
  if (getComputedStyle(element).opacity !== "0")
    report(new Error("awesome-reveal: a hidden element is visible. Import reveal.css once."));
}

/**
 * Decides when an element is revealed, and plays the animation. It does not change the DOM:
 * the adapter hides and shows the element when `subscribe` calls it.
 */
export function createReveal(options: RevealOptions = {}): RevealStore {
  // A copy, so that a caller who mutates the options object still restarts the observer.
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

  function set(next: boolean) {
    if (next !== revealed) {
      revealed = next;
      played = false;
      notified = false;
      cancel();
      listener(next);
    }
    // A revealed state plays once, also when `when` is true from the start.
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
      // The same element that comes back right after null plays again, because its animation was
      // cancelled before it could finish.
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

function revealElement(element: Element, options?: RevealOptions): RevealController {
  const state = createReveal(options);

  function apply(revealed: boolean) {
    if (revealed) element.removeAttribute("data-reveal");
    else element.setAttribute("data-reveal", "hidden");
  }

  state.subscribe(apply);
  apply(state.revealed);
  state.attach(element);

  let destroyed = false;
  return {
    get revealed() {
      return state.revealed;
    },
    setOptions(next) {
      if (!destroyed) state.setOptions(next);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      state.attach(null);
      // Later calls to setOptions change no DOM.
      state.subscribe(() => {});
      apply(true);
    },
  };
}

/**
 * Hides the element, and reveals it with an animation when it enters the viewport.
 * While hidden, the element has `data-reveal="hidden"`, which `reveal.css` hides.
 */
export function reveal(element: Element, options?: RevealOptions): RevealController;
/**
 * Reveals each element of a selector or a list, as `reveal(element)` does. It finds the elements
 * once, when you call it.
 */
export function reveal(
  elements: string | Iterable<Element> | ArrayLike<Element>,
  options?: RevealOptions,
): RevealGroup;
export function reveal(
  target: Element | string | Iterable<Element> | ArrayLike<Element>,
  options?: RevealOptions,
): RevealGroup {
  if (typeof target !== "string" && "nodeType" in target) return revealElement(target, options);
  // A copy first: onReveal can run at once and change a live collection, such as `children`.
  const controllers = Array.from(
    typeof target === "string" ? document.querySelectorAll(target) : target,
  ).map((element) => revealElement(element, options));
  return {
    setOptions(next) {
      for (const controller of controllers) controller.setOptions(next);
    },
    destroy() {
      for (const controller of controllers) controller.destroy();
    },
  };
}
