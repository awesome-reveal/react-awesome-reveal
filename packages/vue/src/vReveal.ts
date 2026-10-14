import "#reveal-style";

import type { Directive } from "vue";
import {
  createReveal,
  hiddenAttributes,
  type RevealOptions,
  type RevealStore,
} from "@awesome-reveal/core/adapter";

const stores = new WeakMap<HTMLElement, RevealStore>();

/** Reveals an existing element and follows reactive directive options. */
export const vReveal: Directive<HTMLElement, RevealOptions | undefined> = {
  deep: true,
  mounted(element, { value }) {
    const state = createReveal(value);
    state.subscribe((visible) => {
      if (visible) element.removeAttribute("data-reveal");
      else element.setAttribute("data-reveal", "hidden");
    });
    element.setAttribute("data-reveal", "hidden");
    stores.set(element, state);
    state.attach(element);
  },
  updated(element, { value }) {
    stores.get(element)?.setOptions(value ?? {});
  },
  beforeUnmount(element) {
    stores.get(element)?.attach(null);
    stores.delete(element);
    element.removeAttribute("data-reveal");
  },
  getSSRProps: () => hiddenAttributes,
};
