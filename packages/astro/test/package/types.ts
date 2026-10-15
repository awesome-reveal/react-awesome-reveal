import type { RevealProps } from "../../dist/index.js";

const table: RevealProps<"table"> = { as: "table" };
// @ts-expect-error A table row cannot be a child of the custom element host.
const row: RevealProps<"tr"> = { as: "tr" };

void [table, row];
