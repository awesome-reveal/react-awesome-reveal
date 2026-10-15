import { experimental_AstroContainer as AstroContainer } from "astro/container";

import { fadeKeyframes } from "@awesome-reveal/test-utils/entrance-fixtures";
import { describeSSRContract } from "@awesome-reveal/test-utils/contract-ssr";

import { Cascade, Reveal } from "../src";

const container = await AstroContainer.create();

async function render(props: Record<string, unknown> = {}, component: unknown = Reveal) {
  const html = await container.renderToString(component as typeof Reveal, {
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
      '<awesome-reveal options="{}"><div data-awesome-reveal="hidden"><p>hello</p></div></awesome-reveal>',
    );
  });

  it("renders the tag of `as` with the other attributes, and no style attribute of its own", async () => {
    const html = await render({ as: "section", class: "hero", id: "intro", style: "color: red" });

    expect(html).toContain(
      '<section class="hero" id="intro" style="color: red" data-awesome-reveal="hidden"><p>hello</p></section>',
    );
  });

  it("serializes the options into the options attribute, with escaped JSON", async () => {
    const options = {
      keyframes: fadeKeyframes,
      duration: 1000,
      delay: 200,
      threshold: 0.5,
    };

    const html = await render(options);
    const attribute = /options="([^"]*)"/.exec(html)![1]!;

    expect(attribute).not.toMatch(/["<>]/);
    expect(JSON.parse(attribute.replaceAll("&quot;", '"').replaceAll("&amp;", "&"))).toEqual(
      options,
    );
  });

  it.each([true, false])("renders `when: %s` in its own attribute, hidden", async (when) => {
    expect(await render({ when })).toBe(
      `<awesome-reveal options="{}" when="${when}"><div data-awesome-reveal="hidden"><p>hello</p></div></awesome-reveal>`,
    );
  });

  it("serializes the entrance options", async () => {
    const html = await render({
      from: { scale: 0.9 },
    });
    const attribute = /options="([^"]*)"/.exec(html)![1]!.replaceAll("&quot;", '"');

    expect(JSON.parse(attribute)).toEqual({
      from: { scale: 0.9 },
    });
  });
});

describe("Cascade on the server", () => {
  it("renders a cascade host and hides the children with the container attribute", async () => {
    expect(await render({ delay: 100, interval: 120 }, Cascade)).toBe(
      '<awesome-reveal cascade options="{&quot;delay&quot;:100,&quot;interval&quot;:120}"><div data-awesome-reveal="cascade"><p>hello</p></div></awesome-reveal>',
    );
  });
});

describe.each([
  ["Reveal", Reveal],
  ["Cascade", Cascade],
])("%s with a tag that the type rejects", (_, component) => {
  // The custom element reports the moved tag in the browser, so the render must not fail the page.
  it.each(["tr", "TD"])("renders %s without a throw", async (as) => {
    await expect(render({ as }, component)).resolves.toContain("<awesome-reveal");
  });
});

const ssrHarness = (component: unknown) => ({
  async render(options: Record<string, unknown>, style?: Record<string, string>) {
    const css =
      style &&
      Object.entries(style)
        .map(([name, value]) => `${name}: ${value}`)
        .join("; ");
    return render({ ...options, style: css, "data-contract": "" }, component);
  },
});

describeSSRContract("Astro Reveal", ssrHarness(Reveal));

describeSSRContract("Astro Cascade", ssrHarness(Cascade), "cascade");
