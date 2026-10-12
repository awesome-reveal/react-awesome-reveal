import type { Directive } from "vue";

import {
  hiddenStyle,
  type RevealController,
  reveal,
  type RevealOptions,
} from "@awesome-reveal/core";

const controllers = new WeakMap<HTMLElement, RevealController>();

/**
 * Animates the element when it enters the viewport: `<div v-reveal="{ keyframes: slide() }">`.
 */
export const vReveal: Directive<HTMLElement, RevealOptions | undefined> = {
  // Runs `updated` when a reactive options object changes in place.
  deep: true,
  mounted(element, { value }) {
    controllers.set(element, reveal(element, value ?? {}));
  },
  updated(element, { value }) {
    const controller = controllers.get(element)!;
    // A patch of the style can replace the hidden opacity. setOptions hides the element again.
    controller.setOptions(value ?? {});
  },
  beforeUnmount(element) {
    controllers.get(element)?.destroy();
    controllers.delete(element);
  },
  getSSRProps({ value }) {
    if (value?.when) return {};
    // The client vnode has no hidden style, so a style binding on the element fails the
    // hydration check. The attribute allows the mismatch on this element only.
    return { style: hiddenStyle, "data-reveal": "hidden", "data-allow-mismatch": "style" };
  },
};
