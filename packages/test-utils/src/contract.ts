import type { RevealOptions } from "@awesome-reveal/core";

import { animations, runningAnimations } from "./animate";
import { intersect as report, MockIntersectionObserver, observerOf } from "./intersection-observer";

export type ContractOptions = Omit<RevealOptions, "when"> & { when?: boolean | null };

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
  /** Makes the framework render a new element for the same reveal, such as a new `as` tag. */
  replaceNode?(): Promise<void>;
}

export interface Harness {
  /** Renders an element with `data-contract` and three element children. */
  mount(options: ContractOptions, init?: MountInit): Promise<Mounted>;
  /** The element stays in the document after unmount, as with `destroy()` of core. */
  keepsElement?: boolean;
  /** The framework can render a new element for the same reveal. */
  replacesNode?: boolean;
  /** Scenario ids that fail until a later phase fixes them. A scenario that passes anyway fails the run. */
  drift?: string[];
}

const hidden = (element: HTMLElement) =>
  element.style.opacity === "0" && element.getAttribute("data-reveal") === "hidden";

const shown = (element: HTMLElement) =>
  element.style.opacity !== "0" && !element.hasAttribute("data-reveal");

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

let uniqueErrors = 0;

// The reports are thrown from a microtask, so a test collects them instead of failing on them.
function collectReports() {
  const reports: unknown[] = [];
  const original = globalThis.queueMicrotask;
  vi.stubGlobal("queueMicrotask", (callback: VoidFunction) =>
    original(() => {
      try {
        callback();
      } catch (error) {
        reports.push(error);
      }
    }),
  );
  return reports;
}

export function describeContract(name: string, harness: Harness) {
  const drift = new Set(harness.drift);
  const scenario = (id: string, title: string, fn: () => Promise<void>) =>
    (drift.has(id) ? it.fails : it)(`${id} ${title}`, fn);

  describe(`reveal contract: ${name}`, () => {
    let current: Mounted | undefined;

    async function mount(options: ContractOptions = {}, init?: MountInit) {
      current = await harness.mount({ reducedMotion: "never", ...options }, init);
      return current;
    }

    const rerender = (m: Mounted, options: ContractOptions) =>
      m.rerender({ reducedMotion: "never", ...options });

    async function intersect(m: Mounted, visible: boolean | number) {
      await m.run(() => report(m.element(), visible));
    }

    afterEach(async () => {
      await current?.unmount();
      current = undefined;
      document.body.innerHTML = "";
    });

    scenario("S01", "hides the element at the start", async () => {
      const m = await mount();
      expect(hidden(m.element())).toBe(true);
      expect(animations).toHaveLength(0);
      expect(observerOf(m.element())).toBeDefined();
    });

    scenario("S02", "reveals once on intersect", async () => {
      const m = await mount();
      await intersect(m, true);
      expect(shown(m.element())).toBe(true);
      expect(animations.map((a) => a.element)).toEqual([m.element()]);
      expect(observerOf(m.element())).toBeUndefined();
    });

    scenario("S03", "once: false hides on leave and replays on enter", async () => {
      const m = await mount({ once: false });
      await intersect(m, true);
      await intersect(m, false);
      expect(hidden(m.element())).toBe(true);
      expect(runningAnimations()).toHaveLength(0);
      await intersect(m, true);
      expect(animations).toHaveLength(2);
      expect(runningAnimations()).toHaveLength(1);
    });

    scenario("S04a", "when: true shows and plays with no observer", async () => {
      const m = await mount({ when: true });
      expect(shown(m.element())).toBe(true);
      expect(animations).toHaveLength(1);
      expect(MockIntersectionObserver.instances.size).toBe(0);
    });

    scenario("S04b", "when: false stays hidden with no observer", async () => {
      const m = await mount({ when: false });
      expect(hidden(m.element())).toBe(true);
      expect(MockIntersectionObserver.instances.size).toBe(0);
    });

    scenario("S04c", "when: undefined observes", async () => {
      const m = await mount({ when: undefined });
      expect(observerOf(m.element())).toBeDefined();
    });

    scenario("S04d", "when: null observes", async () => {
      const m = await mount({ when: null });
      expect(observerOf(m.element())).toBeDefined();
      await intersect(m, true);
      expect(shown(m.element())).toBe(true);
    });

    scenario("S05", "a toggle of when replays", async () => {
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

    for (const [id, option, from, to] of [
      ["S06a", "threshold", 0.5, 0.2],
      ["S06b", "rootMargin", "10px", "20px"],
      ["S06c", "once", true, false],
    ] as const) {
      scenario(id, `a change of ${option} restarts the observer`, async () => {
        const m = await mount({ [option]: from });
        const before = observerOf(m.element());
        await rerender(m, { [option]: to });
        const after = observerOf(m.element());
        expect(after).toBeDefined();
        expect(after).not.toBe(before);
        expect(MockIntersectionObserver.instances.size).toBe(1);
      });
    }

    scenario("S06d", "the other options apply at the next reveal", async () => {
      const m = await mount({ once: false, duration: 300 });
      const before = observerOf(m.element());
      await rerender(m, { once: false, duration: 400 });
      expect(observerOf(m.element())).toBe(before);
      await intersect(m, true);
      await rerender(m, { once: false, duration: 500 });
      expect(animations).toHaveLength(1);
      expect(animations[0]!.options).toMatchObject({ duration: 400 });
      await intersect(m, false);
      await intersect(m, true);
      expect(animations[1]!.options).toMatchObject({ duration: 500 });
    });

    scenario("S07", "reduced motion shows the element with no animation", async () => {
      vi.stubGlobal("matchMedia", () => ({ matches: true }));
      const m = await mount({ reducedMotion: "user" });
      await intersect(m, true);
      expect(shown(m.element())).toBe(true);
      expect(animations).toHaveLength(0);
    });

    scenario("S08", "stagger animates the children", async () => {
      const m = await mount({ stagger: 50, delay: 100 });
      await intersect(m, true);
      expect(animations.map((a) => a.element)).toEqual(Array.from(m.element().children));
      expect(animations.map((a) => (a.options as KeyframeAnimationOptions).delay)).toEqual([
        100, 150, 200,
      ]);
    });

    scenario("S09", "the reveal restores the inline opacity of the user", async () => {
      const m = await mount({}, { style: { opacity: "0.5", color: "red" } });
      expect(m.element().style.opacity).toBe("0");
      await intersect(m, true);
      expect(m.element().style.opacity).toBe("0.5");
      expect(m.element().style.color).toBe("red");
    });

    scenario("S10a", "unmount cancels the animation and the observer", async () => {
      const m = await mount({ once: false });
      await intersect(m, true);
      await m.unmount();
      await m.flush();
      expect(runningAnimations()).toHaveLength(0);
      expect(MockIntersectionObserver.instances.size).toBe(0);
    });

    if (harness.keepsElement)
      scenario("S10b", "destroy restores a hidden element", async () => {
        const m = await mount({}, { style: { opacity: "0.5" } });
        await m.unmount();
        expect(m.element().style.opacity).toBe("0.5");
        expect(m.element().hasAttribute("data-reveal")).toBe(false);
      });

    if (harness.replacesNode) {
      scenario("S11a", "a new element after the reveal does not replay", async () => {
        const m = await mount();
        await intersect(m, true);
        const old = m.element();
        await m.replaceNode?.();
        expect(m.element()).not.toBe(old);
        expect(shown(m.element())).toBe(true);
        expect(animations).toHaveLength(1);
        expect(MockIntersectionObserver.instances.size).toBe(0);
      });

      scenario("S11b", "a new element before the reveal is observed", async () => {
        const m = await mount();
        await m.replaceNode?.();
        expect(hidden(m.element())).toBe(true);
        expect(observerOf(m.element())).toBeDefined();
        expect(MockIntersectionObserver.instances.size).toBe(1);
      });
    }

    scenario("S12", "with no IntersectionObserver the element shows at once", async () => {
      vi.stubGlobal("IntersectionObserver", undefined);
      const m = await mount();
      await m.flush();
      expect(shown(m.element())).toBe(true);
      expect(animations).toHaveLength(1);
    });

    scenario("S13", "a throwing IntersectionObserver shows the element and reports", async () => {
      const message = `Invalid rootMargin ${uniqueErrors++}`;
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          constructor() {
            throw new SyntaxError(message);
          }
        },
      );
      const reports = collectReports();
      // jsdom reports an error of a custom element callback as an error event of the window.
      const windowErrors: unknown[] = [];
      const onError = (event: ErrorEvent) => {
        event.preventDefault();
        windowErrors.push(event.error);
      };
      window.addEventListener("error", onError);
      let thrown: unknown;
      try {
        await mount({ rootMargin: "10" }).catch((error) => (thrown = error));
        await settle();
      } finally {
        window.removeEventListener("error", onError);
      }
      expect(thrown).toBeUndefined();
      expect(windowErrors).toEqual([]);
      const element = document.querySelector<HTMLElement>("[data-contract]");
      expect(element && shown(element)).toBe(true);
      expect(reports).toEqual([expect.objectContaining({ message })]);
    });

    scenario("S14", "an invalid easing is reported once and the element shows", async () => {
      const message = `Invalid easing ${uniqueErrors++}`;
      const original = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        if (JSON.stringify(keyframes).includes('"bogus"')) throw new TypeError(message);
        return original.call(this, keyframes, options);
      };
      const reports = collectReports();
      const m = await mount({ once: false, keyframes: [{ opacity: 0, easing: "bogus" }, {}] });
      await intersect(m, true);
      await intersect(m, false);
      await intersect(m, true);
      await settle();
      expect(shown(m.element())).toBe(true);
      expect(reports).toEqual([expect.objectContaining({ message })]);
    });
  });
}
