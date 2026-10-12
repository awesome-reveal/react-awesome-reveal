import { type ObserveOptions, observe } from "./observe.js";
import { type PlayOptions, play } from "./play.js";

export interface RevealOptions extends PlayOptions, ObserveOptions {
  /**
   * Controls the reveal manually. When set, the viewport is not observed.
   * `null` is the same as `undefined`: the viewport decides.
   */
  when?: boolean | null;
}

export interface RevealState {
  /** Before the first `attach`, it is `when === true`. A server renderer can read it. */
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
   * The other options apply at the next reveal.
   */
  setOptions(options: RevealOptions): void;
}

export interface RevealController {
  readonly revealed: boolean;
  /**
   * Replaces the options. A change of `when` applies at once. A change of `threshold`,
   * `rootMargin` or `once` restarts the observer. The other options apply at the next reveal.
   */
  setOptions(options: RevealOptions): void;
  /**
   * Stops the observation, cancels the animation and restores the element. Later calls to
   * `setOptions` do nothing to the element.
   */
  destroy(): void;
}

/** Hides an element until it is revealed. Server renderers apply it to the markup. */
export const hiddenStyle = { opacity: "0" } as const;

const restarts = ["when", "threshold", "rootMargin", "once"] as const;

/**
 * Decides when an element is revealed, and plays the animation. It does not change the DOM:
 * the adapter hides and shows the element when `subscribe` calls it.
 */
export function createReveal(options: RevealOptions = {}): RevealState {
  // A copy, so that a caller who mutates the options object still restarts the observer.
  let current = { ...options };
  let element: Element | null = null;
  let detached: Element | null = null;
  let inView = false;
  let revealed = current.when === true;
  let played = false;
  let listener: (revealed: boolean) => void = () => {};
  let cancel = () => {};
  let disconnect = () => {};

  function set(next: boolean) {
    if (next !== revealed) {
      revealed = next;
      played = false;
      cancel();
      listener(next);
    }
    // A revealed state plays once, also when `when` is true from the start.
    if (revealed && element && !played) {
      played = true;
      cancel = play(element, current);
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

/**
 * Hides the element, and reveals it with an animation when it enters the viewport.
 * While hidden, the element has the `hiddenStyle` inline style and `data-reveal="hidden"`.
 * The reveal restores the inline `opacity` that the element had.
 */
export function reveal(
  element: Element & ElementCSSInlineStyle,
  options?: RevealOptions,
): RevealController {
  const hidden = element.getAttribute("data-reveal") === "hidden";
  // A hidden opacity of 0 from the server markup is not the resting opacity.
  const resting =
    hidden && element.style.opacity === hiddenStyle.opacity ? "" : element.style.opacity;
  const state = createReveal(options);

  function apply(revealed: boolean) {
    element.style.opacity = revealed ? resting : hiddenStyle.opacity;
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
