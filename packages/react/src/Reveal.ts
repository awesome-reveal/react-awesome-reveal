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

// React 18 only passes a ref to function components wrapped in forwardRef.
const RevealWithRef = /* @__PURE__ */ forwardRef(function Reveal(
  props: Omit<RevealProps, "as" | "ref"> & { as?: RevealElement },
  ref: ForwardedRef<Element>,
) {
  const {
    as,
    keyframes,
    from,
    distance,
    easing,
    bounce,
    duration,
    delay,
    stagger,
    threshold,
    rootMargin,
    once,
    when,
    reducedMotion,
    onReveal,
    ...rest
  } = props;
  const { getProps } = useReveal<Element>(props);

  // oxlint-disable-next-line react/refs -- getProps passes the ref on to the element and does not read it.
  return createElement(as ?? "div", getProps({ ...rest, ref }));
});

/**
 * Renders one element that animates when it enters the viewport.
 * To animate your own element or component without a wrapper, use `useReveal`.
 */
export const Reveal = RevealWithRef as <T extends RevealElement = "div">(
  props: RevealProps<T>,
) => ReactElement;
