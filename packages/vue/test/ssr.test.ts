import { createSSRApp, h, withDirectives } from "vue";
import { renderToString } from "vue/server-renderer";

import { slide } from "../src/keyframes";
import { Reveal } from "../src/Reveal";
import { vReveal } from "../src/vReveal";

import DirectiveBox from "./fixtures/DirectiveBox.vue";
import RevealCard from "./fixtures/RevealCard.vue";

function render(component: Parameters<typeof createSSRApp>[0], props?: Record<string, unknown>) {
  return renderToString(createSSRApp(component, props));
}

// The setup fails the test if Vue warns.
describe("server render", () => {
  it("renders the Reveal component hidden", async () => {
    expect(await render(RevealCard)).toBe(
      '<section style="color:red;opacity:0;" data-reveal="hidden"><p>hello</p></section>',
    );
  });

  it("renders the Reveal component visible with when", async () => {
    const html = await render(() => h(Reveal, { when: true }, () => "hello"));

    expect(html).toBe("<div>hello</div>");
  });

  it("renders a compiled v-reveal element hidden", async () => {
    expect(await render(DirectiveBox, { options: { keyframes: slide() } })).toBe(
      '<div style="opacity:0;" data-reveal="hidden" data-allow-mismatch="style"><span>a</span><span>b</span></div>',
    );
  });

  it("renders a v-reveal element of a render function hidden", async () => {
    const html = await render(() => withDirectives(h("div", "hello"), [[vReveal]]));

    expect(html).toBe(
      '<div style="opacity:0;" data-reveal="hidden" data-allow-mismatch="style">hello</div>',
    );
  });

  it("renders a v-reveal element visible with when", async () => {
    const html = await render(() => withDirectives(h("div", "hello"), [[vReveal, { when: true }]]));

    expect(html).toBe("<div>hello</div>");
  });
});
