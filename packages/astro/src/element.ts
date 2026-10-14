import {
  type CascadeOptions,
  cascadeHiddenAttributes,
  createCascade,
  createReveal,
  hiddenAttributes,
  type RevealStore,
} from "@awesome-reveal/core/adapter";

const onReveal = (element: Element) =>
  element.dispatchEvent(new Event("reveal", { bubbles: true }));

function readOptions(host: RevealElement): CascadeOptions {
  return {
    ...JSON.parse(host.getAttribute("options") || "{}"),
    when: host.when ?? undefined,
    onReveal,
  };
}

// The TypeScript DOM lib does not have the Speculation Rules additions yet.
type PrerenderingDocument = Document & { prerendering?: boolean };

/** Controls the entrance and reveal events of an Astro-rendered element. */
export class RevealElement extends HTMLElement {
  static observedAttributes = ["options", "when"];

  private controller?: RevealStore<CascadeOptions>;

  /** Tells if the element is revealed. */
  get revealed(): boolean {
    return this.controller?.revealed ?? false;
  }

  /** Controls the reveal manually, as the `when` prop does. `null` gives the control to the viewport. */
  get when(): boolean | null {
    const when = this.getAttribute("when");
    return when == null ? null : when !== "false";
  }

  set when(value: boolean | null) {
    if (value == null) this.removeAttribute("when");
    else this.setAttribute("when", String(value));
  }

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
    const cascade = this.hasAttribute("cascade");
    const hidden = (cascade ? cascadeHiddenAttributes : hiddenAttributes)["data-reveal"];
    // Invalid JSON throws after the reveal exists, so the element does not stay hidden.
    target.setAttribute("data-reveal", hidden);
    this.controller = cascade ? createCascade({ onReveal }) : createReveal({ onReveal });
    this.controller.subscribe((visible) => {
      if (visible) target.removeAttribute("data-reveal");
      else target.setAttribute("data-reveal", hidden);
    });
    this.controller.attach(target);
    this.controller.setOptions(readOptions(this));
  }

  // The ClientRouter moves `transition:persist` elements with moveBefore(), which keeps the state.
  connectedMoveCallback() {}

  disconnectedCallback() {
    // Without moveBefore(), a persisted element leaves and enters the DOM in one task.
    queueMicrotask(() => {
      if (this.isConnected) return;
      this.controller?.attach(null);
      this.firstElementChild?.removeAttribute("data-reveal");
      this.controller = undefined;
    });
  }

  attributeChangedCallback() {
    this.controller?.setOptions(readOptions(this));
  }
}
