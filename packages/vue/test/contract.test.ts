import { mount } from "@vue/test-utils";
import { h, nextTick, shallowRef, type VNode, withDirectives } from "vue";

import {
  type ContractOptions,
  describeContract,
  type Harness,
} from "@awesome-reveal/test-utils/contract";

import { Reveal } from "../src/Reveal";
import { vReveal } from "../src/vReveal";

const children = () => [1, 2, 3].map((n) => h("span", n));

type Tree = (options: ContractOptions, style: object | undefined, swap: boolean) => VNode;

function harness(tree: Tree, drift: string[] = []): Harness {
  return {
    replacesNode: true,
    drift,
    async mount(options, init) {
      const state = shallowRef({ options, swap: false });
      let error: unknown;
      const wrapper = mount(
        { render: () => tree(state.value.options, init?.style, state.value.swap) },
        {
          attachTo: document.body,
          global: {
            config: {
              errorHandler: (thrown) => {
                error = thrown;
              },
            },
          },
        },
      );
      await nextTick();
      if (error) throw error;
      return {
        element: () => document.querySelector<HTMLElement>("[data-contract]")!,
        rerender: async (next) => {
          state.value = { ...state.value, options: next };
          await nextTick();
        },
        unmount: async () => wrapper.unmount(),
        flush: () => nextTick(),
        run: async (fn) => {
          fn();
          await nextTick();
        },
        replaceNode: async () => {
          state.value = { ...state.value, swap: true };
          await nextTick();
        },
      };
    },
  };
}

describeContract(
  "Vue Reveal",
  harness(
    (options, style, swap) =>
      h(
        Reveal,
        { ...options, as: swap ? "section" : "div", style, "data-contract": "" } as never,
        children,
      ),
    ["S04d", "S13", "S14"],
  ),
);

describeContract(
  "Vue v-reveal",
  harness(
    (options, style, swap) =>
      withDirectives(
        h(swap ? "section" : "div", { key: String(swap), style, "data-contract": "" }, children()),
        [[vReveal, options]],
      ),
    ["S04d", "S09", "S11a", "S13", "S14"],
  ),
);
