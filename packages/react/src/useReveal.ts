"use client";

import {
  type CSSProperties,
  type Ref,
  type RefCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { createReveal, hiddenStyle, type RevealOptions } from "@awesome-reveal/core";

export type { RevealOptions };

export interface RevealTargetProps<T extends Element> {
  ref: RefCallback<T>;
  style: CSSProperties | undefined;
  "data-reveal": "hidden" | undefined;
}

export interface RevealState<T extends Element> {
  revealed: boolean;
  /**
   * Merges the reveal into the props of the element: its `ref`, and its `style` with the hidden
   * opacity after yours. Spread the result on the element. Write your own `style` before the
   * spread, or the hidden style is lost.
   */
  getProps<P extends object = object>(
    props?: P & { ref?: Ref<T>; style?: CSSProperties },
  ): Omit<P, "ref" | "style"> & RevealTargetProps<T>;
}

// React 18 warns about useLayoutEffect during server rendering.
const useIsomorphicLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

function mergeRefs<T>(own: RefCallback<T>, user: Ref<T>): RefCallback<T> {
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
    } else if (user) {
      // The cast also compiles against React 18 types, where RefObject.current is read-only.
      // oxlint-disable-next-line react/immutability -- a ref callback can write the user's ref object.
      (user as { current: T | null }).current = node;
    }
    return undefined;
  };
}

// The element reaches core in the layout effect, after the options of the same commit. React
// detaches and attaches the same element again in one commit when a callback ref changes, as an
// inline callback does on each render. A detach that waits one microtask does not restart the reveal.
function createBinding<T extends Element>(state: ReturnType<typeof createReveal>) {
  let element: T | null = null;
  let attached: T | null = null;
  function sync(options?: RevealOptions) {
    // Drops an old element before the options apply, so that a reveal does not play on it.
    if (element !== attached) state.attach(null);
    if (options) state.setOptions(options);
    state.attach((attached = element));
  }
  function ref(node: T | null) {
    element = node;
    if (!node) queueMicrotask(() => sync());
  }
  return { ref, sync };
}

export function useReveal<T extends Element = HTMLElement>(
  options: RevealOptions = {},
): RevealState<T> {
  const [{ state, ref, sync }] = useState(() => {
    const state = createReveal(options);
    return { state, ...createBinding<T>(state) };
  });
  // Keeps the merged callback of each user ref stable, so that React does not detach the element.
  const [refs] = useState(() => new WeakMap<object, RefCallback<T>>());
  // A store update renders in a microtask, before the frame of the animation start.
  const getRevealed = () => state.revealed;
  const revealed = useSyncExternalStore(state.subscribe, getRevealed, getRevealed);
  useIsomorphicLayoutEffect(() => sync(options));

  function getProps<P extends object = object>(
    props?: P & { ref?: Ref<T>; style?: CSSProperties },
  ) {
    const { ref: user, style, ...rest } = props ?? {};
    let target = ref;
    if (user) {
      target = refs.get(user) ?? mergeRefs(ref, user);
      refs.set(user, target);
    }
    return {
      ...rest,
      ref: target,
      style: revealed ? style : { ...style, ...hiddenStyle },
      "data-reveal": revealed ? undefined : "hidden",
    } as Omit<P, "ref" | "style"> & RevealTargetProps<T>;
  }

  return { revealed, getProps };
}
