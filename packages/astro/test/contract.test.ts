import { describeContract } from "@awesome-reveal/test-utils/contract";

import { RevealElement } from "../src/element";

if (!customElements.get("awesome-reveal")) customElements.define("awesome-reveal", RevealElement);

// Builds the markup of Reveal.astro by hand. contract.ssr.test.ts checks the real server output.
describeContract("Astro <awesome-reveal>", {
  drift: ["S04d", "S09", "S13", "S14"],
  async mount(options, init) {
    const host = document.createElement("awesome-reveal");
    host.setAttribute("options", JSON.stringify(options));
    const element = document.createElement("div");
    element.setAttribute("data-contract", "");
    if (!options.when) element.setAttribute("data-reveal", "hidden");
    Object.assign(element.style, init?.style);
    element.innerHTML = "<span>1</span><span>2</span><span>3</span>";
    host.append(element);
    document.body.append(host);
    return {
      element: () => element,
      rerender: async (next) => host.setAttribute("options", JSON.stringify(next)),
      unmount: async () => {
        host.remove();
        await Promise.resolve();
      },
      flush: () => Promise.resolve(),
      run: async (fn) => fn(),
    };
  },
});
