import { defineComponent, h, mergeProps, onMounted, type PropType, ref, watch } from "vue";

import { createReveal, hiddenStyle, type RevealOptions } from "@awesome-reveal/core";

export interface RevealProps extends RevealOptions {
  /**
   * Tag of the rendered element.
   * @default "div"
   */
  as?: string;
}

/**
 * Renders one element that animates when it enters the viewport.
 * To animate an element of your own without a wrapper, use `v-reveal`.
 */
export const Reveal = /* @__PURE__ */ defineComponent(
  (props: RevealProps, { attrs, slots }) => {
    const state = createReveal(props);
    const revealed = ref(state.revealed);
    state.subscribe((value) => (revealed.value = value));
    // After the patch, so that a new element of the same tick gets the new options, and plays.
    watch(() => ({ ...props }), state.setOptions, { flush: "post" });
    // A mounted hook waits for a pending Suspense, which keeps the element outside the document.
    let element: Element | null = null;
    let mounted = false;
    const attach = (node: unknown) => {
      element = node as Element | null;
      if (mounted) state.attach(element);
    };
    onMounted(() => {
      mounted = true;
      // A pending Suspense also defers the post-flush watcher, so a change of the props is not applied yet.
      state.setOptions(props);
      state.attach(element);
    });

    return () =>
      h(
        props.as ?? "div",
        mergeProps(
          attrs,
          revealed.value
            ? { ref: attach }
            : { ref: attach, style: hiddenStyle, "data-reveal": "hidden" },
        ),
        slots.default?.(),
      );
  },
  {
    name: "Reveal",
    // Vue merges inherited attributes after the props of the root element, so a user opacity would win.
    inheritAttrs: false,
    props: {
      as: String,
      keyframes: Array as PropType<RevealOptions["keyframes"]>,
      duration: Number,
      delay: Number,
      stagger: Number,
      threshold: Number,
      rootMargin: String,
      // Vue casts an absent Boolean prop to false, which would turn off the core defaults.
      once: { type: Boolean, default: undefined },
      when: { type: Boolean, default: undefined },
      reducedMotion: String as PropType<RevealOptions["reducedMotion"]>,
    },
  },
);
