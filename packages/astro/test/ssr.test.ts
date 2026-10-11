import { experimental_AstroContainer as AstroContainer } from "astro/container";

import { fade } from "@awesome-reveal/core/keyframes";

import Reveal from "../src/Reveal.astro";

const container = await AstroContainer.create();

async function render(props: Record<string, unknown> = {}) {
  const html = await container.renderToString(Reveal, {
    props,
    slots: { default: "<p>hello</p>" },
  });
  // Astro 6 adds dev attributes, such as data-astro-source-file, and whitespace.
  return html
    .replace(/ data-astro-[\w-]+(="[^"]*")?/g, "")
    .replace(/<script[^>]*><\/script>/g, "")
    .replace(/>\s+</g, "><")
    .trim();
}

describe("Reveal on the server", () => {
  it("renders a hidden div in an <awesome-reveal> element", async () => {
    expect(await render()).toBe(
      '<awesome-reveal options="{}"><div data-reveal="hidden"><p>hello</p></div></awesome-reveal>',
    );
  });

  it("renders the tag of `as` with the other attributes, and no style attribute of its own", async () => {
    const html = await render({ as: "section", class: "hero", id: "intro", style: "color: red" });

    expect(html).toContain(
      '<section class="hero" id="intro" style="color: red" data-reveal="hidden"><p>hello</p></section>',
    );
  });

  it("serializes the options into the options attribute, with escaped JSON", async () => {
    const options = {
      keyframes: fade(),
      duration: 1000,
      delay: 100,
      stagger: 50,
      threshold: 0.5,
      rootMargin: "-10%",
      once: false,
      reducedMotion: "never",
    };

    const html = await render(options);
    const attribute = /options="([^"]*)"/.exec(html)![1]!;

    expect(attribute).not.toMatch(/["<>]/);
    expect(JSON.parse(attribute.replaceAll("&quot;", '"').replaceAll("&amp;", "&"))).toEqual(
      options,
    );
  });

  it("renders the element visible when `when` is true", async () => {
    expect(await render({ when: true })).toContain("<div><p>hello</p></div>");
  });

  it("renders the element hidden when `when` is false", async () => {
    expect(await render({ when: false })).toContain('<div data-reveal="hidden">');
  });
});
