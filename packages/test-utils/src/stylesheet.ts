import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Vitest turns CSS imports into empty strings, also with ?raw. In jsdom, import.meta.url is not a file URL.
// jsdom applies an @media block only when its query is exactly `screen`, so the first query becomes `screen`.
const css = readFileSync(
  resolve(import.meta.dirname, "../../react/src/reveal.css"),
  "utf8",
).replace(/@media [^{]+\{/, "@media screen {");

/** Adds reveal.css to the document, as the package import does in a browser bundle. */
export function installStylesheet() {
  if (document.getElementById("reveal-css")) return;
  const style = document.createElement("style");
  style.id = "reveal-css";
  style.textContent = css;
  document.head.append(style);
}
