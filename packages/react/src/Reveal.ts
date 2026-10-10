"use client";

import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  createElement,
  type ForwardedRef,
  forwardRef,
  type JSX,
  type ReactElement,
  type Ref,
  type RefCallback,
  useCallback,
} from "react";

import { type RevealOptions, useReveal } from "./useReveal.js";

type RevealElement = keyof JSX.IntrinsicElements;

export type RevealProps<T extends RevealElement = "div"> = RevealOptions & {
  /**
   * Tag of the rendered element.
   * @default "div"
   */
  as?: T;
  ref?: Ref<ComponentRef<T>>;
} & Omit<ComponentPropsWithoutRef<T>, keyof RevealOptions | "as">;

function useMergedRef<T>(own: RefCallback<T>, user: Ref<T> | undefined): RefCallback<T> {
  return useCallback(
    (node: T | null) => {
      own(node);
      if (typeof user === "function") {
        const cleanup: unknown = user(node);
        // React 18 logs an error for any other return value.
        if (typeof cleanup === "function")
          return () => {
            own(null);
            cleanup();
          };
      } else if (user) {
        // The cast also compiles against React 18 types, where RefObject.current is read-only.
        (user as { current: T | null }).current = node;
      }
      return undefined;
    },
    [own, user],
  );
}

// React 18 only passes a ref to function components wrapped in forwardRef.
const RevealWithRef = /* @__PURE__ */ forwardRef(function Reveal(
  props: Omit<RevealProps, "as" | "ref"> & { as?: RevealElement },
  ref: ForwardedRef<Element>,
) {
  const {
    as,
    keyframes,
    duration,
    delay,
    stagger,
    threshold,
    rootMargin,
    once,
    when,
    reducedMotion,
    style,
    ...rest
  } = props;
  const reveal = useReveal<Element>(props);
  const mergedRef = useMergedRef(reveal.ref, ref);

  return createElement(as ?? "div", {
    ...rest,
    ref: mergedRef,
    style: reveal.style ? { ...style, ...reveal.style } : style,
    "data-reveal": reveal.revealed ? undefined : "hidden",
  });
});

/**
 * Renders one element that animates when it enters the viewport.
 * To animate your own element or component without a wrapper, use `useReveal`.
 */
export const Reveal = RevealWithRef as <T extends RevealElement = "div">(
  props: RevealProps<T>,
) => ReactElement;
