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

// React detaches and attaches the same element again in one commit when a ref callback changes, as
// an inline callback does on each render. A detach that waits one microtask does not restart the reveal.
function createAttach<T extends Element>(state: ReturnType<typeof createReveal>) {
  let element: T | null = null;
  let leaving = false;
  function flush() {
    if (!leaving) return;
    leaving = false;
    element = null;
    state.attach(null);
  }
  function attach(node: T | null) {
    if (node) {
      if (!leaving || node !== element) state.attach(node);
      element = node;
      leaving = false;
    } else if (element && !leaving) {
      leaving = true;
      queueMicrotask(flush);
    }
  }
  return { attach, flush };
}

export function useReveal<T extends Element = HTMLElement>(
  options: RevealOptions = {},
): RevealState<T> {
  const [{ state, attach, flush }] = useState(() => {
    const state = createReveal(options);
    return { state, ...createAttach<T>(state) };
  });
  // Keeps the merged callback of each user ref stable, so that React does not detach the element.
  const [refs] = useState(() => new WeakMap<object, RefCallback<T>>());
  // A store update renders in a microtask, before the frame of the animation start.
  const getRevealed = () => state.revealed;
  const revealed = useSyncExternalStore(state.subscribe, getRevealed, getRevealed);
  useIsomorphicLayoutEffect(() => {
    // A ref that detached without attaching again in this commit leaves the element for good.
    flush();
    state.setOptions(options);
  });

  function getProps<P extends object = object>(
    props?: P & { ref?: Ref<T>; style?: CSSProperties },
  ) {
    const { ref: user, style, ...rest } = props ?? {};
    let ref = attach;
    if (user) {
      ref = refs.get(user) ?? mergeRefs(attach, user);
      refs.set(user, ref);
    }
    return {
      ...rest,
      ref,
      style: revealed ? style : { ...style, ...hiddenStyle },
      "data-reveal": revealed ? undefined : "hidden",
    } as Omit<P, "ref" | "style"> & RevealTargetProps<T>;
  }

  return { revealed, getProps };
}
