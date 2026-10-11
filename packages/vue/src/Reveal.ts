import {
  computed,
  defineComponent,
  h,
  mergeProps,
  type PropType,
  ref,
  shallowRef,
  watch,
} from "vue";

import { hiddenStyle, observe, play, type RevealOptions } from "@awesome-reveal/core";

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
    const element = shallowRef<Element>();
    const inView = ref(false);
    const revealed = computed(() => props.when ?? inView.value);
    const settled = computed(() => props.once !== false && inView.value);

    watch(
      [
        element,
        () => props.when,
        settled,
        () => props.threshold,
        () => props.rootMargin,
        () => props.once,
      ],
      ([node, when, isSettled], _, onCleanup) => {
        if (!node || when !== undefined || isSettled) return;
        onCleanup(observe(node, props, (value) => (inView.value = value)));
      },
      // Vue sets the element ref in a post-flush job; a sync watcher observes before mount() returns.
      { flush: "sync" },
    );

    // Post-flush watchers run after the patch that removes the hidden style, in the same task.
    // Option changes wait for the next reveal.
    watch(
      [element, revealed],
      ([node, isRevealed], [previousNode, wasRevealed], onCleanup) => {
        // A new `as` tag after the reveal swaps the element, and does not replay the animation.
        if (!node || !isRevealed || (previousNode && wasRevealed)) return;
        onCleanup(play(node, props));
      },
      { flush: "post" },
    );

    return () =>
      h(
        props.as ?? "div",
        mergeProps(
          attrs,
          revealed.value
            ? { ref: element }
            : { ref: element, style: hiddenStyle, "data-reveal": "hidden" },
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
