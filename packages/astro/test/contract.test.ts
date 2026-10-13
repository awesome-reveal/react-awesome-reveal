import { describeContract, type ContractOptions } from "@awesome-reveal/test-utils/contract";

import { RevealElement } from "../src/element";

if (!customElements.get("awesome-reveal")) customElements.define("awesome-reveal", RevealElement);

// Builds the markup of Reveal.astro by hand. ssr.test.ts checks the real server output.
describeContract("Astro <awesome-reveal>", {
  async mount(options, init) {
    const host = document.createElement("awesome-reveal") as RevealElement;
    let current = options;
    const write = ({ when, onReveal, ...rest }: ContractOptions) => {
      host.setAttribute("options", JSON.stringify(rest));
      host.when = when ?? null;
    };
    write(options);
    host.addEventListener("reveal", (event) => current.onReveal?.(event.target as Element));
    const element = document.createElement("div");
    element.setAttribute("data-contract", "");
    element.setAttribute("data-reveal", "hidden");
    Object.assign(element.style, init?.style);
    element.innerHTML = "<span>1</span><span>2</span><span>3</span>";
    host.append(element);
    document.body.append(host);
    return {
      element: () => element,
      rerender: async (next) => {
        current = next;
        write(next);
      },
      unmount: async () => {
        host.remove();
        await Promise.resolve();
      },
      flush: () => Promise.resolve(),
      run: async (fn) => fn(),
    };
  },
});
