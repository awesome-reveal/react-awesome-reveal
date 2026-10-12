import { renderToString } from "react-dom/server";
import type { CSSProperties } from "react";

import { describeSSRContract } from "@awesome-reveal/test-utils/contract-ssr";

import { slide } from "../src/keyframes";
import { Reveal } from "../src/Reveal";
import { type RevealOptions, useReveal } from "../src/useReveal";

// The setup fails the test if React warns, for example about useLayoutEffect on React 18.
test("renders hidden content on the server without warnings", () => {
  const html = renderToString(
    <Reveal keyframes={slide()}>
      <p>hello</p>
    </Reveal>,
  );

  expect(html).toBe('<div style="opacity:0" data-reveal="hidden"><p>hello</p></div>');
});

describeSSRContract("React Reveal", {
  inlineOpacity: true,
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
  inlineOpacity: true,
  async render(options, style) {
    return renderToString(<HookBox options={options as RevealOptions} style={style} />);
  },
});
