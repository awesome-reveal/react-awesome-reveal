// Astro's JSX entry resolves its ambient types in NodeNext; astro/types uses an extensionless import.
import type { JSX } from "astro/jsx-runtime";

const unsupported = [
  "html",
  "head",
  "body",
  "caption",
  "col",
  "colgroup",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "td",
  "th",
  "option",
  "optgroup",
] as const;

/** Selects a tag that the HTML parser keeps inside the custom element host. */
export type RevealTag = Exclude<keyof JSX.DefinedIntrinsicElements, (typeof unsupported)[number]>;

/** Rejects tags that the HTML parser removes or moves outside the host. */
export function assertRevealTag(tag: string): asserts tag is RevealTag {
  if ((unsupported as readonly string[]).includes(tag.toLowerCase()))
    throw new TypeError(
      `The <awesome-reveal> host cannot wrap <${tag}>. Reveal the containing table, select or content element instead.`,
    );
}
