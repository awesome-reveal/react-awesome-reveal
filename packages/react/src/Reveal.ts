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

import { type CascadeOptions, useCascade } from "./useCascade.js";
import { type RevealOptions, type RevealState, useReveal } from "./useReveal.js";

type RevealElement = keyof JSX.IntrinsicElements;

type ElementProps<Options, T extends RevealElement> = Options & {
  /**
   * The tag of the rendered element.
   * @default "div"
   */
  as?: T;
  ref?: Ref<ComponentRef<T>>;
} & Omit<ComponentPropsWithoutRef<T>, keyof Options | "as">;

/** Configures the reveal and the element rendered around its children. */
export type RevealProps<T extends RevealElement = "div"> = ElementProps<RevealOptions, T>;

/** Configures the cascade and the element rendered around its children. */
export type CascadeProps<T extends RevealElement = "div"> = ElementProps<CascadeOptions, T>;

// React 18 only passes a ref to function components wrapped in forwardRef.
type WithoutRef<T> = T extends unknown ? Omit<T, "as" | "ref"> : never;

function component(
  useTarget: (options: CascadeOptions) => RevealState<Element, string>,
  displayName: string,
) {
  const Component = forwardRef(function Component(
    props: WithoutRef<CascadeProps> & { as?: RevealElement },
    ref: ForwardedRef<Element>,
  ) {
    const { as, keyframes, from, duration, threshold, interval, when, onReveal, ...rest } = props;
    const { getProps } = useTarget(props);

    // oxlint-disable-next-line react/refs -- getProps passes the ref to the element and does not read it.
    return createElement(as ?? "div", getProps({ ...rest, ref }));
  });
  Component.displayName = displayName;
  return Component;
}

/** Renders an element around its children and reveals it when it enters the viewport. */
export const Reveal = /* @__PURE__ */ component(useReveal, "Reveal") as <
  T extends RevealElement = "div",
>(
  props: RevealProps<T>,
) => ReactElement;

/**
 * Renders an element around its children. When it enters the viewport, it reveals the direct
 * element children in sequence, `interval` milliseconds apart.
 */
export const Cascade = /* @__PURE__ */ component(useCascade, "Cascade") as <
  T extends RevealElement = "div",
>(
  props: CascadeProps<T>,
) => ReactElement;
