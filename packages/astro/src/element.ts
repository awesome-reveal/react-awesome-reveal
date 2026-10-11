import { type RevealController, reveal, type RevealOptions } from "@awesome-reveal/core";

// The TypeScript DOM lib does not have the Speculation Rules additions yet.
type PrerenderingDocument = Document & { prerendering?: boolean };

/**
 * `<awesome-reveal>`, the client side of `Reveal.astro`. It reveals its first element child with
 * the options of its `options` attribute, a JSON object.
 */
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
    if (target) this.controller = reveal(target, this.readOptions());
  }

  // With moveBefore(), as the ClientRouter uses for `transition:persist`, the element keeps its state.
  connectedMoveCallback() {}

  disconnectedCallback() {
    // Without moveBefore(), a `transition:persist` element leaves and enters the DOM in one task.
    queueMicrotask(() => {
      if (this.isConnected) return;
      this.controller?.destroy();
      this.controller = undefined;
    });
  }

  attributeChangedCallback() {
    this.controller?.update(this.readOptions());
  }

  // Invalid options fall back to the defaults, so that the element does not stay hidden.
  private readOptions(): RevealOptions {
    try {
      const options: unknown = JSON.parse(this.getAttribute("options") ?? "{}");
      if (options !== null && typeof options === "object") return options;
    } catch {}
    return {};
  }
}
