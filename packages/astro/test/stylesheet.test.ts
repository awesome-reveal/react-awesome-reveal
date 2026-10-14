import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(import.meta.dirname, path), "utf8");

// The unit tests of all adapters install the React copy of reveal.css.
it("has the same reveal.css as the React package", () => {
  expect(read("../src/reveal.css")).toBe(read("../../react/src/reveal.css"));
});
