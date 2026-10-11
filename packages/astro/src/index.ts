import type { RevealOptions } from "@awesome-reveal/core";
import type { HTMLTag, Polymorphic } from "astro/types";

export type { RevealOptions };

/** The props of `Reveal.astro`: the tag of the rendered element, its attributes and the reveal options. */
export type RevealProps<Tag extends HTMLTag = "div"> = Polymorphic<{ as: Tag }> & RevealOptions;
