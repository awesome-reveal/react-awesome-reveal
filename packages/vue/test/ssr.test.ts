import { createSSRApp, h, withDirectives } from "vue";
import { renderToString } from "vue/server-renderer";

import { describeSSRContract } from "@awesome-reveal/test-utils/contract-ssr";

import { defaultKeyframes } from "@awesome-reveal/test-utils/entrance-fixtures";
import { Cascade, Reveal } from "../src/Reveal";
import { vCascade, vReveal } from "../src/vReveal";

import DirectiveBox from "./fixtures/DirectiveBox.vue";
import RevealCard from "./fixtures/RevealCard.vue";

function render(component: Parameters<typeof createSSRApp>[0], props?: Record<string, unknown>) {
  return renderToString(createSSRApp(component, props));
}

// The setup fails the test if Vue warns.
describe("server render", () => {
  it("renders the Reveal component hidden", async () => {
    expect(await render(RevealCard)).toBe(
      '<section data-awesome-reveal="hidden" style="color:red;"><p>hello</p></section>',
    );
  });

  it("renders the Reveal component hidden with when", async () => {
    const html = await render(() => h(Reveal, { when: true }, () => "hello"));

    expect(html).toBe('<div data-awesome-reveal="hidden">hello</div>');
  });

  it("renders a compiled v-reveal element hidden", async () => {
    expect(await render(DirectiveBox, { options: { keyframes: defaultKeyframes } })).toBe(
      '<div style="" data-awesome-reveal="hidden"><span>a</span><span>b</span></div>',
    );
  });

  it("renders a v-reveal element of a render function hidden", async () => {
    const html = await render(() => withDirectives(h("div", "hello"), [[vReveal]]));

    expect(html).toBe('<div data-awesome-reveal="hidden">hello</div>');
  });

  it("renders a v-reveal element hidden with when", async () => {
    const html = await render(() => withDirectives(h("div", "hello"), [[vReveal, { when: true }]]));

    expect(html).toBe('<div data-awesome-reveal="hidden">hello</div>');
  });
});

describeSSRContract("Vue Reveal", {
  async render(options, style) {
    return render(() => h(Reveal, { ...options, style, "data-contract": "" } as never, () => "x"));
  },
});

describeSSRContract("Vue v-reveal", {
  async render(options, style) {
    return render(() =>
      withDirectives(h("div", { style, "data-contract": "" }, "x"), [[vReveal, options]]),
    );
  },
});

describeSSRContract(
  "Vue Cascade",
  {
    async render(options, style) {
      return render(() =>
        h(Cascade, { ...options, style, "data-contract": "" } as never, () => h("p", "x")),
      );
    },
  },
  "cascade",
);

describeSSRContract(
  "Vue v-cascade",
  {
    async render(options, style) {
      return render(() =>
        withDirectives(h("ul", { style, "data-contract": "" }, "x"), [[vCascade, options]]),
      );
    },
  },
  "cascade",
);
