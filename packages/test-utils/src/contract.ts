import type { RevealOptions } from "@awesome-reveal/core/adapter";

import { animations, runningAnimations } from "./animate";
import { intersect as report, MockIntersectionObserver, observerOf } from "./intersection-observer";

export type ContractOptions = RevealOptions;

export interface MountInit {
  style?: Partial<CSSStyleDeclaration>;
}

export interface Mounted {
  element(): HTMLElement;
  rerender(options: ContractOptions): Promise<void>;
  unmount(): Promise<void>;
  flush(): Promise<void>;
  /** Wraps a report of the mock observer in the update scope of the framework. */
  run(fn: () => void): Promise<void>;
  /** Renders a new element for the same reveal, such as a new `as` tag, with these options. */
  replaceNode?(options?: ContractOptions): Promise<void>;
}

export interface Harness {
  /** Renders an element with `data-contract` and three element children. */
  mount(options: ContractOptions, init?: MountInit): Promise<Mounted>;
  /** Set to `true` when the framework can render a new element for the same reveal. */
  replacesNode?: boolean;
  /** Set to `true` when the reveal belongs to its element, so a new element starts a new reveal. */
  boundToElement?: boolean;
}

const hidden = (element: HTMLElement) => element.getAttribute("data-reveal") === "hidden";

const shown = (element: HTMLElement) => !element.hasAttribute("data-reveal");

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

// Reports throw from a microtask. The wrapper keeps the microtasks of the framework running.
function collectReports() {
  const errors: unknown[] = [];
  const original = globalThis.queueMicrotask;
  vi.stubGlobal("queueMicrotask", (callback: VoidFunction) =>
    original(() => {
      try {
        callback();
      } catch (error) {
        errors.push(error);
      }
    }),
  );
  return errors;
}

export function describeContract(name: string, harness: Harness) {
  describe(`reveal contract: ${name}`, () => {
    let current: Mounted | undefined;

    async function mount(options: ContractOptions = {}, init?: MountInit) {
      current = await harness.mount(options, init);
      return current;
    }

    const rerender = (m: Mounted, options: ContractOptions) => m.rerender(options);

    async function intersect(m: Mounted, visible: boolean | number) {
      await m.run(() => report(m.element(), visible));
    }

    afterEach(async () => {
      await current?.unmount();
      current = undefined;
      document.body.innerHTML = "";
    });

    it("hides the element at the start", async () => {
      const m = await mount();
      expect(hidden(m.element())).toBe(true);
      expect(animations).toHaveLength(0);
      expect(observerOf(m.element())).toBeDefined();
    });

    it("reveals once on intersect", async () => {
      const m = await mount();
      await intersect(m, true);
      expect(shown(m.element())).toBe(true);
      expect(animations.map((a) => a.element)).toEqual([m.element()]);
      expect(observerOf(m.element())).toBeUndefined();
    });

    it("when: true shows and plays with no observer", async () => {
      const m = await mount({ when: true });
      expect(shown(m.element())).toBe(true);
      expect(animations).toHaveLength(1);
      expect(MockIntersectionObserver.instances.size).toBe(0);
    });

    it("when: false stays hidden with no observer", async () => {
      const m = await mount({ when: false });
      expect(hidden(m.element())).toBe(true);
      expect(MockIntersectionObserver.instances.size).toBe(0);
    });

    it("when: undefined observes", async () => {
      const m = await mount({ when: undefined });
      expect(observerOf(m.element())).toBeDefined();
    });

    it("when: null observes", async () => {
      const m = await mount({ when: null });
      expect(observerOf(m.element())).toBeDefined();
      await intersect(m, true);
      expect(shown(m.element())).toBe(true);
    });

    it("a toggle of when replays", async () => {
      const m = await mount({ when: false });
      await rerender(m, { when: true });
      expect(shown(m.element())).toBe(true);
      await rerender(m, { when: false });
      expect(hidden(m.element())).toBe(true);
      expect(runningAnimations()).toHaveLength(0);
      await rerender(m, { when: true });
      expect(animations).toHaveLength(2);
      expect(runningAnimations()).toHaveLength(1);
    });

    it("a change of threshold restarts the observer", async () => {
      const m = await mount({ threshold: 0.5 });
      const before = observerOf(m.element());
      await rerender(m, { threshold: 0.2 });
      const after = observerOf(m.element());
      expect(after).toBeDefined();
      expect(after).not.toBe(before);
      expect(MockIntersectionObserver.instances.size).toBe(1);
    });

    it("reveals when the element leaves before it reaches the threshold", async () => {
      const m = await mount({ threshold: 0.5 });
      await intersect(m, 0.2);
      expect(hidden(m.element())).toBe(true);
      await intersect(m, false);
      expect(shown(m.element())).toBe(true);
      expect(runningAnimations()).toHaveLength(1);
    });

    it("the other options apply at the next reveal", async () => {
      const m = await mount({ duration: 300 });
      const before = observerOf(m.element());
      await rerender(m, { duration: 400 });
      expect(observerOf(m.element())).toBe(before);
      await intersect(m, true);
      await rerender(m, { duration: 500 });
      expect(animations).toHaveLength(1);
      expect(animations[0]!.options).toMatchObject({ duration: 400 });
      await rerender(m, { when: false, duration: 500 });
      await rerender(m, { when: true, duration: 500 });
      expect(animations[1]!.options).toMatchObject({ duration: 500 });
    });

    it("reduced motion shows the element with no animation", async () => {
      vi.stubGlobal("matchMedia", () => ({ matches: true }));
      const m = await mount({});
      await intersect(m, true);
      expect(shown(m.element())).toBe(true);
      expect(animations).toHaveLength(0);
    });

    it("switching to reduced motion cancels the entrance and exposes content", async () => {
      const media = new EventTarget() as EventTarget & { matches: boolean };
      media.matches = false;
      vi.stubGlobal("matchMedia", () => media);
      const m = await mount({ when: false });
      media.matches = true;
      await m.run(() => media.dispatchEvent(new Event("change")));
      expect(shown(m.element())).toBe(true);
      expect(runningAnimations()).toHaveLength(0);
      expect(observerOf(m.element())).toBeUndefined();
    });

    it("the reveal keeps the inline style of the user", async () => {
      const m = await mount({}, { style: { opacity: "0.5", color: "red" } });
      expect(m.element().style.opacity).toBe("0.5");
      await intersect(m, true);
      expect(m.element().style.opacity).toBe("0.5");
      expect(m.element().style.color).toBe("red");
    });

    it("unmount cancels the animation and the observer", async () => {
      const m = await mount();
      await intersect(m, true);
      await m.unmount();
      await m.flush();
      expect(runningAnimations()).toHaveLength(0);
      expect(MockIntersectionObserver.instances.size).toBe(0);
    });

    if (harness.replacesNode) {
      it(
        harness.boundToElement
          ? "a new element after the reveal starts a new reveal"
          : "a new element after the reveal does not replay",
        async () => {
          const m = await mount();
          await intersect(m, true);
          const old = m.element();
          await m.replaceNode?.();
          expect(m.element()).not.toBe(old);
          if (harness.boundToElement) {
            expect(hidden(m.element())).toBe(true);
            expect(observerOf(m.element())).toBeDefined();
          } else {
            expect(shown(m.element())).toBe(true);
            expect(animations).toHaveLength(1);
            expect(MockIntersectionObserver.instances.size).toBe(0);
          }
        },
      );

      it("a new element before the reveal is observed", async () => {
        const m = await mount();
        await m.replaceNode?.();
        expect(hidden(m.element())).toBe(true);
        expect(observerOf(m.element())).toBeDefined();
        expect(MockIntersectionObserver.instances.size).toBe(1);
      });

      it("a new element and `when: true` in one update play on the new element", async () => {
        const m = await mount({ when: false });
        await m.replaceNode?.({ when: true });
        expect(shown(m.element())).toBe(true);
        expect(animations.map((a) => a.element)).toEqual([m.element()]);
        expect(runningAnimations()).toHaveLength(1);
      });
    }

    it("onReveal is called with the element at each reveal", async () => {
      const onReveal = vi.fn();
      const m = await mount({ onReveal });
      expect(onReveal).not.toHaveBeenCalled();
      await intersect(m, true);
      expect(onReveal.mock.calls).toEqual([[m.element()]]);
      await rerender(m, { when: false, onReveal });
      await rerender(m, { when: true, onReveal });
      expect(onReveal).toHaveBeenCalledTimes(2);
    });

    it("direction builds the entrance", async () => {
      const m = await mount({ from: "left" });
      await intersect(m, true);
      const [, move] = animations[0]!.keyframes as Keyframe[];
      expect(move).toMatchObject({ translate: "-24px 0px", composite: "add" });
      expect(move!.easing).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
    });

    it("the first reveal marks the document as started", async () => {
      document.documentElement.removeAttribute("data-reveal-ready");
      await mount();
      expect(document.documentElement.hasAttribute("data-reveal-ready")).toBe(true);
    });

    it("with no IntersectionObserver the element shows at once", async () => {
      vi.stubGlobal("IntersectionObserver", undefined);
      const m = await mount();
      await m.flush();
      expect(shown(m.element())).toBe(true);
      expect(animations).toHaveLength(1);
    });

    it("a throwing IntersectionObserver shows the element", async () => {
      // A test file can run more than one harness, and each message reports once per module.
      const message = `Invalid threshold: ${name}`;
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          constructor() {
            throw new SyntaxError(message);
          }
        },
      );
      // jsdom reports an error of a custom element callback as an error event of the window.
      const windowErrors: unknown[] = [];
      const onError = (event: ErrorEvent) => {
        event.preventDefault();
        windowErrors.push(event.error);
      };
      window.addEventListener("error", onError);
      const reports = collectReports();
      let thrown: unknown;
      try {
        await mount({ threshold: 2 }).catch((error) => (thrown = error));
        await settle();
      } finally {
        window.removeEventListener("error", onError);
      }
      expect(thrown).toBeUndefined();
      expect(windowErrors).toEqual([]);
      expect(reports).toEqual([new SyntaxError(message)]);
      const element = document.querySelector<HTMLElement>("[data-contract]");
      expect(element && shown(element)).toBe(true);
    });

    it("invalid native keyframes leave the element visible, and report once", async () => {
      const message = `Invalid easing: ${name}`;
      const original = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        if (JSON.stringify(keyframes).includes('"bogus"')) throw new TypeError(message);
        return original.call(this, keyframes, options);
      };
      const keyframes = [{ opacity: 0, easing: "bogus" }, {}];
      const reports = collectReports();
      const m = await mount({ keyframes });
      await intersect(m, true);
      await rerender(m, { when: false, keyframes });
      await rerender(m, { when: true, keyframes });
      await settle();
      expect(shown(m.element())).toBe(true);
      expect(reports).toEqual([new TypeError(message)]);
    });
  });
}
