import type { Directive } from "vue";

import {
  hiddenAttributes,
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
    controllers.get(element)!.setOptions(value ?? {});
  },
  beforeUnmount(element) {
    controllers.get(element)?.destroy();
    controllers.delete(element);
  },
  // Also with `when: true`: the entrance plays after hydration.
  getSSRProps: () => hiddenAttributes,
};
