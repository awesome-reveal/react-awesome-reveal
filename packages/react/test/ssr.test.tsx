import { renderToString } from "react-dom/server";
import type { CSSProperties } from "react";

import { describeSSRContract } from "@awesome-reveal/test-utils/contract-ssr";

import { defaultKeyframes } from "@awesome-reveal/test-utils/entrance-fixtures";
import { Cascade, Reveal } from "../src/Reveal";
import { useCascade } from "../src/useCascade";
import { type RevealOptions, useReveal } from "../src/useReveal";

// The setup fails the test if React warns, for example about useLayoutEffect on React 18.
test("renders hidden content on the server without warnings", () => {
  const html = renderToString(
    <Reveal keyframes={defaultKeyframes}>
      <p>hello</p>
    </Reveal>,
  );

  expect(html).toBe('<div data-reveal="hidden"><p>hello</p></div>');
});

describeSSRContract("React Reveal", {
  async render(options, style) {
    return renderToString(
      <Reveal {...(options as RevealOptions)} style={style} data-contract="">
        x
      </Reveal>,
    );
  },
});

function HookBox({ options, style }: { options: RevealOptions; style?: CSSProperties }) {
  const { getProps } = useReveal<HTMLElement>(options);
  return <div {...getProps({ style, "data-contract": "" })}>x</div>;
}

describeSSRContract("React useReveal", {
  async render(options, style) {
    return renderToString(<HookBox options={options as RevealOptions} style={style} />);
  },
});

describeSSRContract(
  "React Cascade",
  {
    async render(options, style) {
      return renderToString(
        <Cascade {...(options as RevealOptions)} style={style} data-contract="">
          <p>x</p>
        </Cascade>,
      );
    },
  },
  "cascade",
);

function CascadeHookBox({ options, style }: { options: RevealOptions; style?: CSSProperties }) {
  const { getProps } = useCascade<HTMLElement>(options);
  return <ul {...getProps({ style, "data-contract": "" })}>x</ul>;
}

describeSSRContract(
  "React useCascade",
  {
    async render(options, style) {
      return renderToString(<CascadeHookBox options={options as RevealOptions} style={style} />);
    },
  },
  "cascade",
);
