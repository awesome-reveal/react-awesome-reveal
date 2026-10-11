import { type ObserveOptions, observe } from "./observe.js";
import { type PlayOptions, play } from "./play.js";

export interface RevealOptions extends PlayOptions, ObserveOptions {}

export interface RevealController {
  readonly revealed: boolean;
  /**
   * Replaces the options. A change of `threshold`, `rootMargin` or `once` restarts the observer;
   * the other options apply at the next reveal.
   */
  update(options: RevealOptions): void;
  /**
   * Stops the observation and cancels the animation. The element keeps its current style,
   * and later calls to `update` do nothing.
   */
  destroy(): void;
}

/** Hides an element until it is revealed. Server renderers apply it to the markup. */
export const hiddenStyle = { opacity: "0" } as const;

/**
 * Hides the element, and reveals it with an animation when it enters the viewport.
 * While hidden, the element has the `hiddenStyle` inline style and `data-reveal="hidden"`.
 * The reveal removes both, so an inline `opacity` of your own does not persist.
 */
export function reveal(
  element: Element & ElementCSSInlineStyle,
  options: RevealOptions = {},
): RevealController {
  let current = options;
  let revealed = false;
  let destroyed = false;
  let cancel = () => {};
  let disconnect = () => {};

  function hide() {
    cancel();
    element.style.opacity = hiddenStyle.opacity;
    element.setAttribute("data-reveal", "hidden");
  }

  function show() {
    element.style.opacity = "";
    element.removeAttribute("data-reveal");
    cancel = play(element, current);
  }

  function connect() {
    disconnect();
    disconnect = () => {};
    if (revealed && current.once !== false) return;
    disconnect = observe(element, current, (inView) => {
      if (destroyed || inView === revealed) return;
      revealed = inView;
      if (inView) show();
      else hide();
    });
  }

  hide();
  connect();

  return {
    get revealed() {
      return revealed;
    },
    update(next) {
      if (destroyed) return;
      const previous = current;
      current = next;
      if (
        next.threshold !== previous.threshold ||
        next.rootMargin !== previous.rootMargin ||
        next.once !== previous.once
      )
        connect();
    },
    destroy() {
      destroyed = true;
      disconnect();
      cancel();
    },
  };
}
