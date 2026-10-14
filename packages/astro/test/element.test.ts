import { animations } from "@awesome-reveal/test-utils/animate";
import { intersect, observerOf } from "@awesome-reveal/test-utils/intersection-observer";

import type { RevealElement } from "../src/element";

function render(options?: object) {
  document.body.innerHTML = `<awesome-reveal><p data-awesome-reveal="hidden">hello</p></awesome-reveal>`;
  const host = document.querySelector<RevealElement>("awesome-reveal")!;
  // Sets the attribute after the connection, as the browser parser can.
  if (options) host.setAttribute("options", JSON.stringify(options));
  return { host, element: host.firstElementChild as HTMLElement };
}

function connect(options: object, when?: string) {
  const host = document.createElement("awesome-reveal") as RevealElement;
  host.setAttribute("options", JSON.stringify(options));
  if (when != null) host.setAttribute("when", when);
  host.innerHTML = `<p data-awesome-reveal="hidden">hello</p>`;
  document.body.append(host);
  return { host, element: host.firstElementChild as HTMLElement };
}

describe("<awesome-reveal>", () => {
  it("hides its first element child, and reveals it with the options of the attribute", () => {
    const { element } = connect({ duration: 100, threshold: 0.5 });

    expect(element).toHaveStyle({ opacity: "0" });
    expect(observerOf(element)).toMatchObject({ thresholds: [0, 0.5] });

    intersect(element, true);

    expect(element).not.toHaveAttribute("data-awesome-reveal");
    expect(animations).toHaveLength(1);
    expect(animations[0]).toMatchObject({ element, options: { duration: 100 } });
  });

  it("uses the default options without an attribute", () => {
    const { element } = render();

    intersect(element, true);

    expect(animations[0]?.options).toMatchObject({ duration: 600, delay: 0 });
  });

  it("reveals at once with `when`, and does not observe the viewport", () => {
    const { element } = connect({}, "true");

    expect(element).not.toHaveAttribute("data-awesome-reveal");
    expect(observerOf(element)).toBeUndefined();
    expect(animations).toHaveLength(1);
  });

  it("applies a change of the options attribute", () => {
    const { host, element } = connect({ duration: 100 }, "false");

    host.setAttribute("options", JSON.stringify({ duration: 200 }));
    host.when = true;

    expect(animations[0]).toMatchObject({ element, options: { duration: 200 } });
  });

  it("reflects `when` in its attribute, and tells whether it is revealed", () => {
    const { host, element } = connect({}, "false");
    expect(host.when).toBe(false);
    expect(host.revealed).toBe(false);
    expect(element).toHaveStyle({ opacity: "0" });

    host.when = true;
    expect(host.getAttribute("when")).toBe("true");
    expect(host.revealed).toBe(true);
    expect(element).not.toHaveAttribute("data-awesome-reveal");

    host.when = null;
    expect(host.hasAttribute("when")).toBe(false);
    expect(host.when).toBeNull();
    expect(observerOf(element)).toBeDefined();
  });

  it("dispatches a reveal event that bubbles from the element at each reveal", () => {
    const { host, element } = connect({});
    const targets: EventTarget[] = [];
    host.addEventListener("reveal", (event) => targets.push(event.target!));

    intersect(element, true);
    host.when = false;
    host.when = true;

    expect(targets).toEqual([element, element]);
  });

  it("stops the observation when it leaves the document", async () => {
    const { host, element } = connect({});

    host.remove();
    await Promise.resolve();

    expect(observerOf(element)).toBeUndefined();
  });

  it("keeps its state when it leaves and enters the document in one task", async () => {
    const { host, element } = connect({});
    intersect(element, true);

    document.body.append(document.createElement("div"), host);
    await Promise.resolve();

    expect(element).not.toHaveAttribute("data-awesome-reveal");
    expect(observerOf(element)).toBeUndefined();
    expect(animations).toHaveLength(1);
  });

  it.each(["re-append", "moveBefore"])(
    "keeps the observer of a hidden element after a %s",
    async (move) => {
      const { host, element } = connect({});
      const observer = observerOf(element);

      // jsdom has no moveBefore(), which calls this callback instead of the disconnection.
      if (move === "moveBefore") host.connectedMoveCallback();
      else document.body.append(document.createElement("div"), host);
      await Promise.resolve();

      expect(element).toHaveAttribute("data-awesome-reveal", "hidden");
      expect(observerOf(element)).toBe(observer);
    },
  );

  it("keeps its state when moveBefore() moves it", () => {
    const { host, element } = connect({});
    intersect(element, true);

    // jsdom has no moveBefore(), which calls this callback instead of the disconnection.
    host.connectedMoveCallback();

    expect(element).not.toHaveAttribute("data-awesome-reveal");
    expect(observerOf(element)).toBeUndefined();
  });

  it("hides and observes the element again when it enters the document later", async () => {
    const { host, element } = connect({});
    intersect(element, true);
    host.remove();
    await Promise.resolve();

    document.body.append(host);

    expect(element).toHaveStyle({ opacity: "0" });
    expect(observerOf(element)).toBeDefined();
  });

  describe("on a prerendered page", () => {
    function setPrerendering(value: boolean) {
      Object.defineProperty(document, "prerendering", { configurable: true, value });
    }

    function activate() {
      setPrerendering(false);
      document.dispatchEvent(new Event("prerenderingchange"));
    }

    beforeEach(() => setPrerendering(true));

    afterEach(() => {
      delete (document as { prerendering?: boolean }).prerendering;
    });

    it("waits for the activation", () => {
      const { element } = connect({});
      expect(observerOf(element)).toBeUndefined();

      activate();

      expect(observerOf(element)).toBeDefined();
    });

    it("reads the options at the activation", () => {
      const { host, element } = connect({});
      host.setAttribute("options", JSON.stringify({ threshold: 0.5 }));

      activate();

      expect(observerOf(element)).toMatchObject({ thresholds: [0, 0.5] });
    });

    it("keeps a focused element hidden at the connection with when: false", () => {
      const { host, element } = connect({}, "false");
      const onReveal = vi.fn();
      host.addEventListener("reveal", onReveal);
      element.tabIndex = -1;
      element.focus();

      activate();

      expect(element).toHaveAttribute("data-awesome-reveal", "hidden");
      expect(onReveal).not.toHaveBeenCalled();
    });

    it("does nothing at the activation when the element is removed", () => {
      const { host, element } = connect({});
      host.remove();

      activate();

      expect(observerOf(element)).toBeUndefined();
    });
  });

  function connectRaw(value: string) {
    const host = document.createElement("awesome-reveal") as RevealElement;
    host.setAttribute("options", value);
    host.innerHTML = `<p data-awesome-reveal="hidden">hello</p>`;
    document.body.append(host);
    return host.firstElementChild as HTMLElement;
  }

  it.each(["null", '"slide"', "5"])(
    "reveals with the default options when the attribute is %s",
    (value) => {
      const element = connectRaw(value);

      intersect(element, true);

      expect(element).not.toHaveAttribute("data-awesome-reveal");
      expect(animations).toHaveLength(1);
    },
  );

  it("reports an invalid options attribute and reveals with the defaults", () => {
    const errors: unknown[] = [];
    // jsdom reports the error of a custom element callback to the window, and fails the run on it.
    const onError = (event: ErrorEvent) => {
      event.preventDefault();
      errors.push(event.error);
    };
    window.addEventListener("error", onError);
    const element = connectRaw("{");
    window.removeEventListener("error", onError);

    intersect(element, true);

    expect(errors).toEqual([expect.any(SyntaxError)]);
    expect(element).not.toHaveAttribute("data-awesome-reveal");
    expect(animations[0]?.options).toMatchObject({ duration: 600 });
  });

  it("lets the viewport reveal with an invalid options attribute, also with when: false", () => {
    const onError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener("error", onError);
    const host = document.createElement("awesome-reveal") as RevealElement;
    host.setAttribute("options", "{");
    host.setAttribute("when", "false");
    host.innerHTML = `<p data-awesome-reveal="hidden">hello</p>`;
    document.body.append(host);
    window.removeEventListener("error", onError);
    const element = host.firstElementChild as HTMLElement;

    intersect(element, true);

    expect(element).not.toHaveAttribute("data-awesome-reveal");
  });

  it("uses the default options when the attribute changes to null", () => {
    const { host, element } = connect({ duration: 100 });

    host.setAttribute("options", "null");
    intersect(element, true);

    expect(animations[0]).toMatchObject({ element, options: { duration: 600 } });
  });

  it("keeps the previous options when the attribute changes to invalid JSON", () => {
    const { host, element } = connect({ duration: 100 });
    const onError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener("error", onError);
    host.setAttribute("options", "{");
    window.removeEventListener("error", onError);
    intersect(element, true);

    expect(animations[0]).toMatchObject({ element, options: { duration: 100 } });
  });

  it("does nothing without an element child", () => {
    document.body.innerHTML = "<awesome-reveal>text</awesome-reveal>";

    expect(document.body.textContent).toBe("text");
  });
});
