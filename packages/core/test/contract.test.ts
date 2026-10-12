// @vitest-environment jsdom
import "./setup/console";
import "./setup/dom";

import { describeContract } from "@awesome-reveal/test-utils/contract";

import { reveal, type RevealOptions } from "../src";

describeContract("core reveal()", {
  keepsElement: true,
  drift: ["S04d", "S09", "S10b", "S13", "S14"],
  async mount(options, init) {
    document.body.innerHTML = `<div data-contract><span>1</span><span>2</span><span>3</span></div>`;
    const element = document.querySelector<HTMLElement>("[data-contract]")!;
    Object.assign(element.style, init?.style);
    const controller = reveal(element, options as RevealOptions);
    return {
      element: () => element,
      rerender: async (next) => controller.update(next as RevealOptions),
      unmount: async () => controller.destroy(),
      flush: async () => {},
      run: async (fn) => fn(),
    };
  },
});
