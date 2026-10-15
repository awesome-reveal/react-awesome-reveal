// @vitest-environment jsdom
import { reveal, cascade, type RevealHandle } from "../src/index";
import { animations, installAnimate, uninstallAnimate } from "@awesome-reveal/test-utils/animate";
import {
  defaultKeyframes,
  easing,
  fadeKeyframes,
} from "@awesome-reveal/test-utils/entrance-fixtures";
import { collectReports } from "@awesome-reveal/test-utils/reports";
import {
  intersect,
  observerOf,
  MockIntersectionObserver,
} from "@awesome-reveal/test-utils/intersection-observer";

let handles: RevealHandle[];
const track = (handle: RevealHandle) => {
  handles.push(handle);
  return handle;
};
const element = () => document.body.appendChild(document.createElement("div"));

beforeEach(() => {
  handles = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  installAnimate();
});
afterEach(() => {
  for (const handle of handles) handle.dispose();
  document.body.innerHTML = "";
  uninstallAnimate();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  MockIntersectionObserver.instances.clear();
});

describe("reveal", () => {
  it("establishes the default entrance immediately without CSS and plays on entry", () => {
    const target = element();
    const handle = track(reveal(target));
    expect(Object.keys(handle)).toEqual(["dispose"]);
    expect(animations[0]?.keyframes).toEqual(defaultKeyframes);
    expect(animations[0]?.options).toEqual({ duration: 600, delay: 0, fill: "backwards" });
    expect(animations[0]?.pause).toHaveBeenCalledOnce();
    expect(animations[0]?.play).not.toHaveBeenCalled();
    intersect(target, true);
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    expect(observerOf(target)).toBeUndefined();
    expect(target.hasAttribute("data-awesome-reveal")).toBe(false);
  });
  it.each([
    ["left", "-24px 0px"],
    ["right", "24px 0px"],
    ["top", "0px -24px"],
    ["bottom", "0px 24px"],
  ] as const)("generates %s", (from, translate) => {
    track(reveal(element(), { from }));
    expect(animations[0]?.keyframes).toMatchObject([
      { offset: 0, opacity: 0 },
      { offset: 0, composite: "add", translate: "0px 0px" },
      { offset: 1e-6, composite: "add", translate },
      { offset: 1, composite: "add", opacity: 0, translate: "0px 0px" },
    ]);
  });
  it.each([
    [{ opacity: 0 }, fadeKeyframes],
    [
      { scale: 0.9 },
      [
        { offset: 0, easing, composite: "add", scale: 0.9 },
        { offset: 1, composite: "add", scale: 1 },
      ],
    ],
    [{}, [{ offset: 1, composite: "add" }]],
  ])("uses exactly the custom start state %j", (from, keyframes) => {
    track(reveal(element(), { from }));
    expect(animations[0]?.keyframes).toEqual(keyframes);
  });
  it("converts numeric and string CSS values", () => {
    track(
      reveal(element(), {
        from: { opacity: 0.3, x: -16, y: "-100%", scale: 0.8, rotate: -5, blur: 8 },
      }),
    );
    expect(animations[0]?.keyframes).toEqual([
      { offset: 0, easing, opacity: 0.3 },
      {
        offset: 0,
        easing,
        composite: "add",
        translate: "-16px -100%",
        scale: 0.8,
        rotate: "-5deg",
        filter: "blur(8px)",
      },
      {
        offset: 1,
        composite: "add",
        opacity: 0,
        translate: "0px 0px",
        scale: 1,
        rotate: "0deg",
        filter: "blur(0px)",
      },
    ]);
    track(reveal(element(), { from: { x: "2rem", rotate: "0.5turn", blur: "0.5rem" } }));
    expect(animations[1]?.keyframes).toMatchObject([
      { translate: "2rem 0px", rotate: "0.5turn", filter: "blur(0.5rem)" },
      { translate: "0px 0px", rotate: "0deg", filter: "blur(0px)" },
    ]);
  });
  it("passes delay to the animation", () => {
    track(reveal(element(), { delay: 200 }));
    expect(animations[0]?.options).toEqual({ duration: 600, delay: 200, fill: "backwards" });
  });
  it("passes native keyframes unchanged and honors duration", () => {
    const keyframes: Keyframe[] = [
      { opacity: 0, transform: "scale(.8)", easing: "ease-in", offset: 0, composite: "replace" },
      { opacity: 1, transform: "scale(1)" },
    ];
    track(reveal(element(), { keyframes, duration: 500 }));
    expect(animations[0]?.keyframes).toBe(keyframes);
    expect(animations[0]?.options).toMatchObject({ duration: 500 });
  });
  it("waits for the threshold and plays once", () => {
    const target = element();
    track(reveal(target, { threshold: 0.5 }));
    const observer = observerOf(target)!;
    expect(observer.thresholds).toEqual([0, 0.5]);
    intersect(target, 0.2);
    expect(animations[0]?.play).not.toHaveBeenCalled();
    intersect(target, 0.5);
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    expect(observerOf(target)).toBeUndefined();
    observer.trigger(target, 0);
    observer.trigger(target, 1);
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    expect(animations[0]?.pause).toHaveBeenCalledOnce();
    expect(animations).toHaveLength(1);
  });
  it("plays when the element leaves before it reaches the threshold", () => {
    const target = element();
    track(reveal(target, { threshold: 0.5 }));
    intersect(target, false);
    expect(animations[0]?.play).not.toHaveBeenCalled();
    intersect(target, 0.2);
    intersect(target, false);
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    expect(observerOf(target)).toBeUndefined();
  });
  it("plays at the entry when the element cannot reach the threshold in the viewport", () => {
    const target = element();
    track(reveal(target, { threshold: 0.5 }));
    const root = { width: 1000, height: 500 };
    observerOf(target)!.triggerSized(target, 0.1, { width: 500, height: 2000 }, root);
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    expect(observerOf(target)).toBeUndefined();
  });
  it("waits for the threshold when the element can reach it in the viewport", () => {
    const target = element();
    track(reveal(target, { threshold: 0.5 }));
    const root = { width: 1000, height: 500 };
    observerOf(target)!.triggerSized(target, 0.1, { width: 500, height: 1000 }, root);
    expect(animations[0]?.play).not.toHaveBeenCalled();
  });
  it.each([
    [2000, true],
    [1000, false],
  ])(
    "uses its own viewport in a cross-origin frame with no root bounds: height %d plays %s",
    (height, plays) => {
      vi.stubGlobal("innerWidth", 1000);
      vi.stubGlobal("innerHeight", 500);
      const target = element();
      track(reveal(target, { threshold: 0.5 }));
      observerOf(target)!.triggerSized(target, 0.1, { width: 500, height }, null);
      expect(animations[0]?.play).toHaveBeenCalledTimes(Number(plays));
    },
  );
  it("cancels the entrance when focus enters the element, and stops observing", () => {
    const target = element();
    const link = target.appendChild(document.createElement("a"));
    link.tabIndex = -1;
    track(reveal(target, { threshold: 0.5 }));
    link.focus();
    expect(animations[0]?.cancel).toHaveBeenCalledOnce();
    expect(animations[0]?.play).not.toHaveBeenCalled();
    expect(observerOf(target)).toBeUndefined();
  });
  it("plays the entrance when focus leaves before the reveal", () => {
    const target = element();
    track(reveal(target));
    target.dispatchEvent(new FocusEvent("focusin"));
    expect(animations[0]?.play).toHaveBeenCalledOnce();
  });
  it("stops listening to focus on disposal", () => {
    const target = element();
    const listen = vi.spyOn(target, "addEventListener");
    const unlisten = vi.spyOn(target, "removeEventListener");
    track(reveal(target)).dispose();
    expect(listen).toHaveBeenCalledWith("focusin", expect.any(Function));
    expect(unlisten.mock.calls).toEqual(listen.mock.calls);
  });
  it.each([
    [0.3, 0],
    [0.6, 0],
  ])("reads each entry of one report: %d, then %d", (...ratios) => {
    const target = element();
    track(reveal(target, { threshold: 0.5 }));
    observerOf(target)!.trigger(target, ...ratios);
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    expect(observerOf(target)).toBeUndefined();
  });
  it.each(["selector", "iterable", "array-like", "live collection"])(
    "resolves multiple %s targets independently",
    (kind) => {
      const a = element(),
        b = element();
      const target =
        kind === "selector"
          ? "body > div"
          : kind === "iterable"
            ? new Set([a, b])
            : kind === "array-like"
              ? { 0: a, 1: b, length: 2 }
              : document.body.children;
      track(reveal(target));
      intersect(a, true);
      expect(animations[0]?.play).toHaveBeenCalledOnce();
      expect(animations[1]?.play).not.toHaveBeenCalled();
      intersect(b, true);
      expect(animations[1]?.play).toHaveBeenCalledOnce();
    },
  );
  it("ignores queued reports after disposal and permits repeated disposal", () => {
    const target = element();
    const handle = track(reveal(target));
    const observer = observerOf(target)!;
    handle.dispose();
    handle.dispose();
    observer.trigger(target, 1);
    expect(animations[0]?.cancel).toHaveBeenCalledOnce();
    expect(animations[0]?.play).not.toHaveBeenCalled();
    expect(observerOf(target)).toBeUndefined();
  });
  it("cancels active animations on disposal", () => {
    const target = element();
    const handle = track(reveal(target));
    intersect(target, true);
    handle.dispose();
    expect(animations[0]?.cancel).toHaveBeenCalledOnce();
  });
  it.each([false, true])(
    "reduced motion skips all animations including native frames: %s",
    (native) => {
      vi.stubGlobal("matchMedia", () => ({ matches: true }));
      track(reveal(element(), native ? { keyframes: [{ opacity: 0 }, { opacity: 1 }] } : {}));
      expect(animations).toHaveLength(0);
      expect(MockIntersectionObserver.instances.size).toBe(0);
    },
  );
  it("exposes pending content when the motion preference changes", () => {
    const media = new EventTarget() as EventTarget & { matches: boolean };
    media.matches = false;
    vi.stubGlobal("matchMedia", () => media);
    track(reveal(element()));
    media.matches = true;
    media.dispatchEvent(new Event("change"));
    expect(animations[0]?.cancel).toHaveBeenCalledOnce();
    expect(MockIntersectionObserver.instances.size).toBe(0);
  });
  it("fails safe and reports when native animation creation throws", () => {
    const error = new TypeError("invalid easing");
    vi.spyOn(Element.prototype, "animate").mockImplementation(() => {
      throw error;
    });
    const reports = collectReports();
    const target = element();
    expect(() =>
      track(reveal(target, { keyframes: [{ opacity: 0, easing: "bogus" }, { opacity: 1 }] })),
    ).not.toThrow();
    expect(target.hasAttribute("data-awesome-reveal")).toBe(false);
    expect(target.style.opacity).toBe("");
    expect(reports()).toEqual([error]);
  });
  it("reports an error message once for all the elements", () => {
    const error = new TypeError("invalid duration");
    vi.spyOn(Element.prototype, "animate").mockImplementation(() => {
      throw error;
    });
    const reports = collectReports();
    const container = element();
    container.innerHTML = "<p></p><p></p><p></p>";
    track(cascade(container, { duration: -1 }));
    track(reveal(container.children, { duration: -1 }));
    expect(reports()).toEqual([error]);
  });
  it("exposes content with no WAAPI or IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const target = element();
    track(reveal(target));
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    uninstallAnimate();
    track(reveal(element()));
  });
  it("fails safe and reports when observer construction throws", () => {
    const error = new RangeError("threshold");
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor() {
          throw error;
        }
      },
    );
    const reports = collectReports();
    expect(() => track(reveal(element(), { threshold: 2 }))).not.toThrow();
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    expect(reports()).toEqual([error]);
  });
  it("accepts empty and duplicate targets", () => {
    track(reveal(".absent"));
    const target = element();
    track(reveal([target, target]));
    expect(animations).toHaveLength(1);
  });
});

describe("cascade", () => {
  function container() {
    const target = element();
    target.innerHTML = "text<span><b>nested</b></span><!--comment--><span>b</span><span>c</span>";
    return target;
  }
  const delays = () => animations.map((a) => (a.options as KeyframeAnimationOptions).delay);
  it("observes the container and only animates direct element children with no first delay", () => {
    const target = container();
    track(cascade(target, { interval: 50 }));
    expect(animations.map((a) => a.element)).toEqual(Array.from(target.children));
    expect(delays()).toEqual([0, 50, 100]);
    expect(observerOf(target)).toBeDefined();
    expect(observerOf(target.firstElementChild!)).toBeUndefined();
    intersect(target, true);
    expect(animations.every((a) => a.play.mock.calls.length === 1)).toBe(true);
  });
  it("delay moves the start of the whole sequence", () => {
    track(cascade(container(), { delay: 100, interval: 50 }));
    expect(delays()).toEqual([100, 150, 200]);
  });
  it("keeps multiple containers independent", () => {
    const a = container(),
      b = container();
    track(cascade("body > div"));
    expect(delays()).toEqual([0, 80, 160, 0, 80, 160]);
    intersect(a, true);
    expect(animations.slice(0, 3).every((a) => a.play.mock.calls.length === 1)).toBe(true);
    expect(animations.slice(3).every((a) => a.play.mock.calls.length === 0)).toBe(true);
    intersect(b, true);
    expect(animations.slice(3).every((a) => a.play.mock.calls.length === 1)).toBe(true);
  });
  it("cancels pending cascade effects on disposal", () => {
    const target = container();
    const handle = track(cascade(target, { interval: 1000 }));
    intersect(target, true);
    expect(observerOf(target)).toBeUndefined();
    handle.dispose();
    handle.dispose();
    expect(animations.every((a) => a.cancel.mock.calls.length === 1)).toBe(true);
  });
  it("accepts an empty container", () => {
    const target = element();
    const handle = track(cascade(target));
    intersect(target, true);
    handle.dispose();
    expect(animations).toHaveLength(0);
  });
  it("reduced motion exposes every child without interval delays", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    track(cascade(container(), { interval: 1000 }));
    expect(animations).toHaveLength(0);
    expect(MockIntersectionObserver.instances.size).toBe(0);
  });
});

describe("release without dispose", () => {
  const flush = () => new Promise((resolve) => setTimeout(resolve));
  let listening: () => Promise<string[]>;
  const all = ["beforeprint", "afterprint", "change"];
  beforeEach(() => {
    const media = Object.assign(new EventTarget(), { matches: false });
    vi.stubGlobal("matchMedia", () => media);
    const listen = vi.spyOn(globalThis, "addEventListener");
    const listenPreference = vi.spyOn(media, "addEventListener");
    const unlisten = vi.spyOn(globalThis, "removeEventListener");
    const unlistenPreference = vi.spyOn(media, "removeEventListener");
    listening = async () => {
      await flush();
      const types = [...listen.mock.calls, ...listenPreference.mock.calls].map(([type]) => type);
      for (const [type] of [...unlisten.mock.calls, ...unlistenPreference.mock.calls])
        types.splice(types.indexOf(type), 1);
      return types;
    };
  });
  it("releases a finished reveal", async () => {
    const target = element();
    reveal(target);
    expect(await listening()).toEqual(all);
    intersect(target, true);
    expect(await listening()).toEqual(all);
    animations[0]!.finish();
    expect(await listening()).toEqual([]);
  });
  it("releases a cascade when every child finished", async () => {
    const target = element();
    target.innerHTML = "<p></p><p></p>";
    cascade(target);
    intersect(target, true);
    animations[0]!.finish();
    expect(await listening()).toEqual(all);
    animations[1]!.finish();
    expect(await listening()).toEqual([]);
  });
  it("releases an empty cascade at once", async () => {
    cascade(element());
    expect(await listening()).toEqual([]);
  });
  it("releases an entrance that page code cancels", async () => {
    reveal(element());
    animations[0]!.cancel();
    expect(await listening()).toEqual([]);
  });
  it("stays safe to dispose after the finish", async () => {
    const target = element();
    const handle = reveal(target);
    intersect(target, true);
    animations[0]!.finish();
    expect(await listening()).toEqual([]);
    expect(() => {
      handle.dispose();
      handle.dispose();
    }).not.toThrow();
    expect(animations[0]!.cancel).not.toHaveBeenCalled();
  });
  it("keeps the print listeners for a waiting reveal when another call is disposed", async () => {
    reveal(element()).dispose();
    const waiting = reveal(element());
    expect(await listening()).toEqual(all);
    waiting.dispose();
    expect(await listening()).toEqual([]);
  });
  it("releases each finished target while another target of the call waits", async () => {
    const finished = element(),
      waiting = element();
    reveal([finished, waiting]);
    animations[0]!.finish();
    await flush();
    expect(observerOf(finished)).toBeUndefined();
    expect(observerOf(waiting)).toBeDefined();
  });
});
