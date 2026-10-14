"use client";

import {
  type Ref,
  type RefCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";

import "#reveal-style";

import {
  type CascadeOptions,
  createReveal,
  hiddenAttributes,
  type RevealOptions,
  type RevealStore,
} from "@awesome-reveal/core/adapter";

export type { RevealOptions };

/** Binds an element ref and its initial visibility to a reveal. */
export interface RevealTargetProps<T extends Element, Hidden extends string = "hidden"> {
  ref: RefCallback<T>;
  "data-reveal": Hidden | undefined;
}

/** Provides reveal state and props for an existing element. */
export interface RevealState<T extends Element, Hidden extends string = "hidden"> {
  revealed: boolean;
  /**
   * Adds the reveal to the props of the element: its `ref`, merged with yours, and the
   * `data-reveal` attribute that the package stylesheet hides. Spread the result on the element.
   */
  getProps<P extends object = object>(
    props?: P & { ref?: Ref<T> },
  ): Omit<P, "ref"> & RevealTargetProps<T, Hidden>;
}

// React 18 warns about useLayoutEffect on the server.
const useIsomorphicLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

function mergeRefs<T>(own: RefCallback<T>, user: NonNullable<Ref<T>>): RefCallback<T> {
  return (node) => {
    own(node);
    if (typeof user === "function") {
      const cleanup: unknown = user(node);
      // React 18 logs an error when a callback ref returns a function.
      if (typeof cleanup === "function")
        return () => {
          own(null);
          cleanup();
        };
    } else {
      // The cast also compiles against React 18 types, where RefObject.current is read-only.
      // oxlint-disable-next-line react/immutability -- a ref callback can write the user's ref object.
      (user as { current: T | null }).current = node;
    }
    return undefined;
  };
}

// Core gets the element in the layout effect, after the options of the same commit. A detach waits
// one microtask, so a callback ref that changes in one commit does not replay the entrance.
function createBinding<T extends Element, Options extends CascadeOptions>(
  state: RevealStore<Options>,
) {
  // The map keeps one merged ref for each user ref, so React does not call a stable user ref again on each render.
  const refs = new WeakMap<object, RefCallback<T>>();
  let element: T | null = null;
  let attached: T | null = null;
  function sync(next?: Options) {
    // Detaches an old element before the options apply, so that the entrance does not play on it.
    if (element !== attached) state.attach(null);
    if (next) state.setOptions(next);
    state.attach((attached = element));
  }
  function ref(node: T | null) {
    element = node;
    if (!node) queueMicrotask(sync);
  }
  // A new function on each render makes React run an effect on each commit.
  const getRevealed = () => state.revealed;
  return { state, refs, ref, sync, getRevealed };
}

export function useBinding<
  T extends Element,
  Options extends CascadeOptions,
  Hidden extends string,
>(
  create: (options: Options) => RevealStore<Options>,
  options: Options,
  hidden: Hidden,
): RevealState<T, Hidden> {
  const [{ state, refs, ref, sync, getRevealed }] = useState(() =>
    createBinding<T, Options>(create(options)),
  );
  // A store update renders in a microtask, before the frame in which the entrance starts.
  const revealed = useSyncExternalStore(state.subscribe, getRevealed, getRevealed);
  useIsomorphicLayoutEffect(() => sync(options));

  function getProps<P extends object = object>(props?: P & { ref?: Ref<T> }) {
    const user = props?.ref;
    let target = ref;
    if (user) {
      target = refs.get(user) ?? mergeRefs(ref, user);
      refs.set(user, target);
    }
    return {
      ...props,
      ref: target,
      "data-reveal": revealed ? undefined : hidden,
    } as Omit<P, "ref"> & RevealTargetProps<T, Hidden>;
  }

  return { revealed, getProps };
}

/** Reveals an existing element through props that you spread on it. */
export function useReveal<T extends Element = HTMLElement>(
  options: RevealOptions = {},
): RevealState<T> {
  return useBinding<T, RevealOptions, "hidden">(
    createReveal,
    options,
    hiddenAttributes["data-reveal"],
  );
}
