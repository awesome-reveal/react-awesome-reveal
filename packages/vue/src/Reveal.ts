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

import {
  type CascadeOptions,
  cascadeHiddenAttributes,
  createCascade,
  createReveal,
  hiddenAttributes,
  type RevealOptions,
  type RevealStore,
} from "@awesome-reveal/core/adapter";

type WithoutCallback<T> = T extends unknown ? Omit<T, "onReveal"> : never;

/** Configures the reveal and the element rendered around its slot. */
export type RevealProps = WithoutCallback<RevealOptions> & {
  /**
   * The tag of the rendered element.
   * @default "div"
   */
  as?: string;
};

/** Configures the cascade and the element rendered around its slot. */
export type CascadeProps = RevealProps & Pick<CascadeOptions, "interval">;

type RuntimeProps = Omit<CascadeProps, "from" | "keyframes"> & {
  from?: RevealOptions["from"];
  keyframes?: Keyframe[];
};

type Component<Props> = DefineComponent<
  Props,
  {},
  {},
  {},
  {},
  {},
  {},
  { reveal: (element: Element) => void }
>;

function defineReveal(
  name: string,
  create: (options: CascadeOptions) => RevealStore<CascadeOptions>,
  hidden: Record<"data-reveal", string>,
  extraProps: { interval?: NumberConstructor } = {},
) {
  return defineComponent(
    (props: RuntimeProps, { emit, slots }) => {
      const options = (): CascadeOptions =>
        ({
          ...props,
          onReveal: (element) => emit("reveal", element),
        }) as CascadeOptions;
      const state = create(options());
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
          revealed.value ? { ref: attach } : { ref: attach, ...hidden },
          slots.default?.({ revealed: revealed.value }),
        );
    },
    {
      name,
      props: {
        as: String,
        keyframes: Array as PropType<RevealOptions["keyframes"]>,
        from: [String, Object] as PropType<RevealOptions["from"]>,
        duration: Number,
        threshold: Number,
        // Vue casts an absent Boolean prop to false, which would make `when` control the reveal.
        when: { type: Boolean, default: undefined },
        ...extraProps,
      },
      emits: { reveal: (element: Element) => element != null },
      slots: Object as SlotsType<{ default: { revealed: boolean } }>,
    },
  );
}

/** Renders an element with a declarative entrance and reveal notifications. */
export const Reveal = /* @__PURE__ */ defineReveal(
  "Reveal",
  createReveal,
  hiddenAttributes,
) as unknown as Component<RevealProps>;

/**
 * Renders an element and reveals its direct element children in sequence, `interval` milliseconds
 * apart, when it enters the viewport.
 */
export const Cascade = /* @__PURE__ */ defineReveal(
  "Cascade",
  createCascade,
  cascadeHiddenAttributes,
  {
    interval: Number,
  },
) as unknown as Component<CascadeProps>;
