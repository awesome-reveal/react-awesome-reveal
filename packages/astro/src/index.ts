import type { RevealOptions } from "@awesome-reveal/core";
import type { HTMLTag, Polymorphic } from "astro/types";

import Component from "./Reveal.astro";

export type { RevealOptions };

/** The props of `Reveal`: the tag of the rendered element, its attributes and the reveal options. */
export type RevealProps<Tag extends HTMLTag = "div"> = Polymorphic<{ as: Tag }> & RevealOptions;

// Only the Astro language tools resolve a .astro import, so the declarations must not contain one.
/** Renders one element and animates it when it enters the viewport. */
export const Reveal = Component as unknown as <Tag extends HTMLTag = "div">(
  props: RevealProps<Tag>,
) => any;
