import { type RevealController, reveal, type RevealOptions } from "@awesome-reveal/core";

const readOptions = (host: HTMLElement): RevealOptions =>
  JSON.parse(host.getAttribute("options") || "{}") ?? {};

// The TypeScript DOM lib does not have the Speculation Rules additions yet.
type PrerenderingDocument = Document & { prerendering?: boolean };

export class RevealElement extends HTMLElement {
  // No class fields: Safari 13.1 does not support them.
  static get observedAttributes() {
    return ["options"];
  }

  declare private controller?: RevealController;

  connectedCallback() {
    if (this.controller || !this.isConnected) return;
    // A prerendered page is not visible, so it must not play the animation.
    if ((document as PrerenderingDocument).prerendering) {
      document.addEventListener("prerenderingchange", () => this.connectedCallback(), {
        once: true,
      });
      return;
    }
    const target = this.firstElementChild as HTMLElement | null;
    if (!target) return;
    // Invalid JSON throws after the reveal exists, so the element does not stay hidden.
    this.controller = reveal(target);
    this.controller.setOptions(readOptions(this));
  }

  // The ClientRouter moves `transition:persist` elements with moveBefore(), which keeps the state.
  connectedMoveCallback() {}

  disconnectedCallback() {
    // Without moveBefore(), a persisted element leaves and enters the DOM in one task.
    queueMicrotask(() => {
      if (this.isConnected) return;
      this.controller?.destroy();
      this.controller = undefined;
    });
  }

  attributeChangedCallback() {
    this.controller?.setOptions(readOptions(this));
  }
}
