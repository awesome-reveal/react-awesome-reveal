import type { CascadeOptions, RevealOptions } from "@awesome-reveal/core/adapter";
import type { HTMLTag, Polymorphic } from "astro/types";

import type { RevealElement } from "./element.js";
import CascadeComponent from "./Cascade.astro";
import RevealComponent from "./Reveal.astro";

export type { CascadeOptions, RevealElement, RevealOptions };

declare global {
  interface HTMLElementTagNameMap {
    "awesome-reveal": RevealElement;
  }
}

type WithoutCallback<T> = T extends unknown ? Omit<T, "onReveal"> : never;

/** Configures the rendered tag, its attributes and the serializable reveal options. */
export type RevealProps<Tag extends HTMLTag = "div"> = Polymorphic<{ as: Tag }> &
  WithoutCallback<RevealOptions>;

/** Configures the rendered tag, its attributes and the serializable cascade options. */
export type CascadeProps<Tag extends HTMLTag = "div"> = RevealProps<Tag> &
  Pick<CascadeOptions, "interval">;

// Only the Astro language tools resolve a .astro import, so the declarations must not contain one.
/** Renders one element and animates it when it enters the viewport. */
export const Reveal = RevealComponent as unknown as <Tag extends HTMLTag = "div">(
  props: RevealProps<Tag>,
) => any;

/**
 * Renders one element and reveals its direct element children in sequence, `interval` milliseconds
 * apart, when it enters the viewport.
 */
export const Cascade = CascadeComponent as unknown as <Tag extends HTMLTag = "div">(
  props: CascadeProps<Tag>,
) => any;

export type { Side, StartState } from "@awesome-reveal/core";
