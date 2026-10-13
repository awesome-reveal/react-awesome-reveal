import { createSSRApp, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";

import { animations } from "@awesome-reveal/test-utils/animate";

import DirectiveBox from "./fixtures/DirectiveBox.vue";
import RevealCard from "./fixtures/RevealCard.vue";
import { intersect } from "./intersect";

async function hydrate(
  component: Parameters<typeof createSSRApp>[0],
  props?: Record<string, unknown>,
) {
  const container = document.createElement("div");
  container.innerHTML = await renderToString(createSSRApp(component, props));
  document.body.append(container);
  const app = createSSRApp(component, props);
  app.mount(container);
  return { app, element: container.firstElementChild as HTMLElement };
}

// The setup fails the test on a hydration mismatch warning.
describe("hydration", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("hydrates the Reveal component, then reveals it", async () => {
    const { app, element } = await hydrate(RevealCard);

    expect(element).toHaveStyle({ opacity: "0" });
    await intersect(element, true);
    expect(element).not.toHaveAttribute("data-reveal");
    expect(element).toHaveStyle({ opacity: "1" });
    expect(animations).toHaveLength(1);
    app.unmount();
  });

  it("hydrates a v-reveal element, then reveals it", async () => {
    const { app, element } = await hydrate(DirectiveBox);

    expect(element).toHaveStyle({ opacity: "0" });
    await intersect(element, true);
    expect(element).not.toHaveAttribute("data-reveal");
    expect(element).toHaveStyle({ opacity: "1" });
    app.unmount();
  });

  it.each([
    ["the Reveal component", RevealCard, { when: true }],
    ["a v-reveal element", DirectiveBox, { options: { when: true } }],
  ])("hydrates %s with when hidden, then plays the entrance once", async (_, component, props) => {
    const { app, element } = await hydrate(component, props);

    await nextTick();
    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations.map((animation) => animation.element)).toEqual([element]);
    app.unmount();
  });

  it("hydrates a v-reveal element with a style binding without a mismatch", async () => {
    const { app, element } = await hydrate(DirectiveBox, { color: "red" });

    expect(element).toHaveStyle({ color: "rgb(255, 0, 0)", opacity: "0" });
    app.unmount();
  });
});
