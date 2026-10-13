"use client";

import {
  type Ref,
  type RefCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { createReveal, type RevealOptions } from "@awesome-reveal/core";

export type { RevealOptions };

export interface RevealTargetProps<T extends Element> {
  ref: RefCallback<T>;
  "data-reveal": "hidden" | undefined;
}

export interface RevealState<T extends Element> {
  revealed: boolean;
  /**
   * Adds the reveal to the props of the element: its `ref`, merged with yours, and the
   * `data-reveal` attribute that `reveal.css` hides. Spread the result on the element.
   */
  getProps<P extends object = object>(
    props?: P & { ref?: Ref<T> },
  ): Omit<P, "ref"> & RevealTargetProps<T>;
}

// React 18 warns about useLayoutEffect during server rendering.
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
// one microtask, so a callback ref that changes in one commit does not replay the animation.
function createBinding<T extends Element>(options: RevealOptions) {
  const state = createReveal(options);
  // Stops a stable user ref from being called with null and the node again on each render.
  const refs = new WeakMap<object, RefCallback<T>>();
  let element: T | null = null;
  let attached: T | null = null;
  function sync(next?: RevealOptions) {
    // Drops an old element before the options apply, so that a reveal does not play on it.
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

export function useReveal<T extends Element = HTMLElement>(
  options: RevealOptions = {},
): RevealState<T> {
  const [{ state, refs, ref, sync, getRevealed }] = useState(() => createBinding<T>(options));
  // A store update renders in a microtask, before the frame of the animation start.
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
      "data-reveal": revealed ? undefined : "hidden",
    } as Omit<P, "ref"> & RevealTargetProps<T>;
  }

  return { revealed, getProps };
}
