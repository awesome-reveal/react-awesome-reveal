import { fileURLToPath } from "node:url";

import { buildSite, type Site } from "./build-site";

function source(path: string) {
  return fileURLToPath(new URL(path, import.meta.url));
}

// The package has "sideEffects": false, which must not drop the script and the style of the component.
const aliases = {
  "@awesome-reveal/astro": source("../src/index.ts"),
  "@awesome-reveal/core/adapter": source("../../core/src/adapter.ts"),
};

describe("a static build of a page with Reveal", () => {
  let site: Site;
  let page: string;

  beforeAll(async () => {
    site = await buildSite(aliases);
    page = [site.html, ...Object.values(site.assets)].join("\n");
  }, 60_000);

  it("defines the custom element", () => {
    expect(page).toMatch(/customElements\.define\(["`]awesome-reveal["`]/);
  });

  it("bundles reveal.css, so the user does not import it", () => {
    expect(page).toMatch(
      /\[data-awesome-reveal=["]?hidden["]?\]\[data-awesome-reveal-ready\],\[data-awesome-reveal=["]?cascade["]?\]\[data-awesome-reveal-ready\]>\*\{opacity:0!important\}/,
    );
    expect(page).toMatch(/\(scripting: ?none\)/);
    expect(page).toMatch(/@keyframes awesome-reveal-hold/);
    expect(page).toMatch(/awesome-reveal\{display:contents\}/);
  });

  it("keeps the class prop", () => {
    expect(site.html).toMatch(/<section class="box"[\s>]/);
  });

  it("renders no style attribute, which the security.csp of Astro blocks", () => {
    expect(site.html).toContain('http-equiv="content-security-policy"');
    expect(site.html).not.toMatch(/<[^>]*\sstyle=/);
  });
});

it.each(["where", "class"] as const)(
  "keeps the class prop with the %s scoped style strategy",
  async (scopedStyleStrategy) => {
    const { html } = await buildSite(aliases, { scopedStyleStrategy });

    expect(html).toMatch(/<section class="box"[\s>]/);
  },
  60_000,
);
