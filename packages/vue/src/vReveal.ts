import "#reveal-style.css";

import type { Directive } from "vue";
import {
  type CascadeOptions,
  cascadeHiddenAttributes,
  createCascade,
  createReveal,
  hiddenAttributes,
  type RevealOptions,
  type RevealStore,
} from "@awesome-reveal/core/adapter";

const stores = new WeakMap<HTMLElement, RevealStore<CascadeOptions>>();

function defineDirective<Options extends CascadeOptions>(
  create: (options?: Options) => RevealStore<Options>,
  hidden: Record<"data-awesome-reveal", string>,
): Directive<HTMLElement, Options | undefined> {
  const hide = (element: HTMLElement) =>
    element.setAttribute("data-awesome-reveal", hidden["data-awesome-reveal"]);
  return {
    deep: true,
    mounted(element, { value }) {
      const state = create(value);
      state.subscribe((visible) => {
        if (!visible) hide(element);
      });
      hide(element);
      stores.set(element, state as RevealStore<CascadeOptions>);
      state.attach(element);
    },
    updated(element, { value }) {
      stores.get(element)?.setOptions(value ?? {});
    },
    beforeUnmount(element) {
      stores.get(element)?.attach(null);
      stores.delete(element);
      element.removeAttribute("data-awesome-reveal");
    },
    getSSRProps: () => hidden,
  };
}

/** Reveals an existing element and follows reactive directive options. */
export const vReveal = /* @__PURE__ */ defineDirective<RevealOptions>(
  createReveal,
  hiddenAttributes,
);

/**
 * Reveals the direct element children of an existing element in sequence, and follows reactive
 * directive options.
 */
export const vCascade = /* @__PURE__ */ defineDirective<CascadeOptions>(
  createCascade,
  cascadeHiddenAttributes,
);
