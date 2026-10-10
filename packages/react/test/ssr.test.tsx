import { renderToString } from "react-dom/server";

import { slide } from "../src/keyframes";
import { Reveal } from "../src/Reveal";

// The setup fails the test if React warns, for example about useLayoutEffect on React 18.
test("renders hidden content on the server without warnings", () => {
  const html = renderToString(
    <Reveal keyframes={slide()}>
      <p>hello</p>
    </Reveal>,
  );

  expect(html).toBe('<div style="opacity:0" data-reveal="hidden"><p>hello</p></div>');
});
