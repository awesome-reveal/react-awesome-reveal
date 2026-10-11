import "@awesome-reveal/test-utils/setup/dom";

import { RevealElement } from "../../src/element";

customElements.define("awesome-reveal", RevealElement);

afterEach(() => {
  document.body.innerHTML = "";
});
