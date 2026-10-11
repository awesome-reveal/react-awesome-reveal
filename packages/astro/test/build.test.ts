import { fileURLToPath } from "node:url";

import { buildSite, type Site } from "./build-site";

function source(path: string) {
  return fileURLToPath(new URL(path, import.meta.url));
}

// The package has "sideEffects": false, which must not drop the script and the style of the component.
describe("a static build of a page with Reveal", () => {
  let site: Site;
  let page: string;

  beforeAll(async () => {
    site = await buildSite({
      "@awesome-reveal/astro": source("../src/index.ts"),
      "@awesome-reveal/astro/keyframes": source("../src/keyframes.ts"),
      "@awesome-reveal/core": source("../../core/src/index.ts"),
      "@awesome-reveal/core/keyframes": source("../../core/src/keyframes/index.ts"),
    });
    page = [site.html, ...Object.values(site.assets)].join("\n");
  }, 60_000);

  it("defines the custom element", () => {
    expect(page).toMatch(/customElements\.define\(["`]awesome-reveal["`]/);
  });

  it("hides the element with a stylesheet rule while scripting is enabled", () => {
    expect(page).toMatch(
      /@media ?\(scripting:enabled\)\{awesome-reveal\[data-astro-cid-\w+\]>\[data-reveal=hidden\]\{opacity:0\}\}/,
    );
    expect(page).toMatch(/awesome-reveal\[data-astro-cid-\w+\]\{display:contents\}/);
  });
});
