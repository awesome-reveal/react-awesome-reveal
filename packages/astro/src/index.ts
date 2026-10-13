import type { RevealOptions } from "@awesome-reveal/core";
import type { HTMLTag, Polymorphic } from "astro/types";

import type { RevealElement } from "./element.js";
import Component from "./Reveal.astro";

export type { RevealElement, RevealOptions };

declare global {
  interface HTMLElementTagNameMap {
    "awesome-reveal": RevealElement;
  }
}

/** The props of `Reveal`: the tag of the rendered element, its attributes and the reveal options. */
export type RevealProps<Tag extends HTMLTag = "div"> = Polymorphic<{ as: Tag }> &
  Omit<RevealOptions, "onReveal">;

// Only the Astro language tools resolve a .astro import, so the declarations must not contain one.
/** Renders one element and animates it when it enters the viewport. */
export const Reveal = Component as unknown as <Tag extends HTMLTag = "div">(
  props: RevealProps<Tag>,
) => any;

export * from "./keyframes.js";
