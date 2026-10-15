import type { CascadeProps, RevealProps, RevealTag } from "../../dist/index.js";

const table: RevealProps<"table"> = { as: "table" };
const select: CascadeProps<"select"> = { as: "select" };
// @ts-expect-error A table row cannot be a child of the custom element host.
const row: RevealTag = "tr";
// @ts-expect-error A table section cannot be a child of the custom element host.
const section: CascadeProps<"tbody"> = { as: "tbody" };
// @ts-expect-error An SVG shape needs an svg parent, and the host is an HTML element.
const shape: RevealTag = "circle";

void [table, select, row, section, shape];
