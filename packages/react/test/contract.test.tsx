import { act, render } from "@testing-library/react";
import type { CSSProperties, ReactElement } from "react";

import {
  type ContractOptions,
  describeContract,
  type Harness,
} from "@awesome-reveal/test-utils/contract";

import { Reveal } from "../src/Reveal";
import { type RevealOptions, useReveal } from "../src/useReveal";

const children = [1, 2, 3].map((n) => <span key={n}>{n}</span>);

type Tree = (
  options: ContractOptions,
  style: CSSProperties | undefined,
  swap: boolean,
) => ReactElement;

function harness(tree: Tree): Harness {
  return {
    replacesNode: true,
    async mount(options, init) {
      const style = init?.style as CSSProperties | undefined;
      let current = options;
      let swap = false;
      const result = render(tree(current, style, swap));
      const update = async () => result.rerender(tree(current, style, swap));
      return {
        element: () => result.container.querySelector<HTMLElement>("[data-contract]")!,
        rerender: async (next) => {
          current = next;
          await update();
        },
        unmount: async () => result.unmount(),
        flush: async () => act(async () => {}),
        run: async (fn) => act(fn),
        replaceNode: async () => {
          swap = true;
          await update();
        },
      };
    },
  };
}

describeContract(
  "React Reveal",
  harness((options, style, swap) => (
    <Reveal
      {...(options as RevealOptions)}
      as={swap ? "section" : "div"}
      style={style}
      data-contract=""
    >
      {children}
    </Reveal>
  )),
);

function HookBox({
  options,
  style,
  swap,
}: {
  options: ContractOptions;
  style?: CSSProperties;
  swap: boolean;
}) {
  const { getProps } = useReveal<HTMLElement>(options as RevealOptions);
  const Tag = swap ? "section" : "div";
  return <Tag {...getProps({ style, "data-contract": "" })}>{children}</Tag>;
}

describeContract(
  "React useReveal",
  harness((options, style, swap) => <HookBox options={options} style={style} swap={swap} />),
);
