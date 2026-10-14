import "#reveal-style";

import {
  defineComponent,
  h,
  onMounted,
  type PropType,
  type DefineComponent,
  ref,
  type SlotsType,
  watch,
} from "vue";

import { createReveal, type RevealOptions } from "@awesome-reveal/core/adapter";

type WithoutCallback<T> = T extends unknown ? Omit<T, "onReveal"> : never;

/** Configures the reveal and the element rendered around its slot. */
export type RevealProps = WithoutCallback<RevealOptions> & {
  /**
   * The tag of the rendered element.
   * @default "div"
   */
  as?: string;
};

const RuntimeReveal = /* @__PURE__ */ defineComponent(
  (
    props: Omit<RevealProps, "from" | "keyframes"> & {
      from?: RevealOptions["from"];
      keyframes?: Keyframe[];
    },
    { emit, slots },
  ) => {
    const options = (): RevealOptions =>
      ({
        ...props,
        onReveal: (element) => emit("reveal", element),
      }) as RevealOptions;
    const state = createReveal(options());
    const revealed = ref(state.revealed);
    state.subscribe((value) => (revealed.value = value));
    // The watcher runs after the patch, so a new element of the same tick plays with the new options.
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
      duration: Number,
      threshold: Number,
      // Vue casts an absent Boolean prop to false, which would make `when` control the reveal.
      when: { type: Boolean, default: undefined },
    },
    emits: { reveal: (element: Element) => element != null },
    slots: Object as SlotsType<{ default: { revealed: boolean } }>,
  },
);

/** Renders an element with a declarative entrance and reveal notifications. */
export const Reveal = RuntimeReveal as unknown as DefineComponent<
  RevealProps,
  {},
  {},
  {},
  {},
  {},
  {},
  { reveal: (element: Element) => void }
>;
