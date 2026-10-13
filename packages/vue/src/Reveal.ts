import { defineComponent, h, onMounted, type PropType, ref, type SlotsType, watch } from "vue";

import { createReveal, type RevealOptions } from "@awesome-reveal/core";

export interface RevealProps extends Omit<RevealOptions, "onReveal"> {
  /**
   * Tag of the rendered element.
   * @default "div"
   */
  as?: string;
}

/**
 * Renders one element that animates when it enters the viewport. It emits `reveal` with the
 * element each time it is revealed, and gives `revealed` to its default slot.
 * To animate an element of your own without a wrapper, use `v-reveal`.
 */
export const Reveal = /* @__PURE__ */ defineComponent(
  (props: RevealProps, { emit, slots }) => {
    const options = (): RevealOptions => ({
      ...props,
      onReveal: (element) => emit("reveal", element),
    });
    const state = createReveal(options());
    const revealed = ref(state.revealed);
    state.subscribe((value) => (revealed.value = value));
    // After the patch, so that a new element of the same tick plays with the new options.
    watch(options, state.setOptions, { flush: "post" });
    // Attaches in onMounted, which a pending Suspense defers while the element is outside the document.
    let element: Element | null = null;
    let mounted = false;
    const attach = (node: unknown) => {
      element = node as Element | null;
      if (mounted) state.attach(element);
    };
    onMounted(() => {
      mounted = true;
      // Suspense defers the watcher too.
      state.setOptions(options());
      state.attach(element);
    });

    return () =>
      h(
        props.as ?? "div",
        revealed.value ? { ref: attach } : { ref: attach, "data-reveal": "hidden" },
        slots.default?.({ revealed: revealed.value }),
      );
  },
  {
    name: "Reveal",
    props: {
      as: String,
      keyframes: Array as PropType<RevealOptions["keyframes"]>,
      from: [String, Object] as PropType<RevealOptions["from"]>,
      distance: [Number, String],
      easing: String,
      bounce: Number,
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
    emits: { reveal: (element: Element) => element != null },
    slots: Object as SlotsType<{ default: { revealed: boolean } }>,
  },
);
