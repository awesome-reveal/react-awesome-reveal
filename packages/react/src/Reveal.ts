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

/** Configures the reveal and the element rendered around its children. */
export type RevealProps<T extends RevealElement = "div"> = RevealOptions & {
  /**
   * The tag of the rendered element.
   * @default "div"
   */
  as?: T;
  ref?: Ref<ComponentRef<T>>;
} & Omit<ComponentPropsWithoutRef<T>, keyof RevealOptions | "as">;

// React 18 only passes a ref to function components wrapped in forwardRef.
type WithoutRef<T> = T extends unknown ? Omit<T, "as" | "ref"> : never;

const RevealWithRef = /* @__PURE__ */ forwardRef(function Reveal(
  props: WithoutRef<RevealProps> & { as?: RevealElement },
  ref: ForwardedRef<Element>,
) {
  const { as, keyframes, from, duration, threshold, when, onReveal, ...rest } = props;
  const { getProps } = useReveal<Element>(props);

  // oxlint-disable-next-line react/refs -- getProps passes the ref on to the element and does not read it.
  return createElement(as ?? "div", getProps({ ...rest, ref }));
});

/** Renders an element around its children and reveals it when it enters the viewport. */
export const Reveal = RevealWithRef as <T extends RevealElement = "div">(
  props: RevealProps<T>,
) => ReactElement;
