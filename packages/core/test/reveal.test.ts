// @vitest-environment jsdom
import { reveal, cascade, type RevealHandle } from "../src/index";
import { animations, installAnimate, uninstallAnimate } from "@awesome-reveal/test-utils/animate";
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
    expect(animations[0]?.keyframes).toEqual([
      { opacity: 0, transform: "translate(0px, 24px)", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      {},
    ]);
    expect(animations[0]?.options).toEqual({ duration: 600, delay: 0, fill: "backwards" });
    expect(animations[0]?.pause).toHaveBeenCalledOnce();
    expect(animations[0]?.play).not.toHaveBeenCalled();
    intersect(target, true);
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    expect(observerOf(target)).toBeUndefined();
    expect(target.hasAttribute("data-reveal")).toBe(false);
  });
  it.each([
    ["left", "translate(-24px, 0px)"],
    ["right", "translate(24px, 0px)"],
    ["top", "translate(0px, -24px)"],
    ["bottom", "translate(0px, 24px)"],
  ] as const)("generates %s", (from, transform) => {
    track(reveal(element(), { from }));
    expect(animations[0]?.keyframes).toMatchObject([{ opacity: 0, transform }, {}]);
  });
  it.each([{ opacity: 0 }, { scale: 0.9 }, {}])(
    "uses exactly the custom start state %j",
    (from) => {
      track(reveal(element(), { from }));
      const frame = (animations[0]!.keyframes as Keyframe[])[0]!;
      expect(frame).not.toHaveProperty("transform", "translate(0px, 24px)");
      expect(frame.opacity).toBe(from.opacity);
      if (from.scale) expect(frame.transform).toBe("scale(0.9)");
      else expect(frame).not.toHaveProperty("transform");
    },
  );
  it("converts numeric and string CSS values", () => {
    track(
      reveal(element(), {
        from: { opacity: 0.3, x: -16, y: "-100%", scale: 0.8, rotate: -5, blur: 8 },
      }),
    );
    expect(animations[0]?.keyframes).toMatchObject([
      {
        opacity: 0.3,
        transform: "translate(-16px, -100%) scale(0.8) rotate(-5deg)",
        filter: "blur(8px)",
      },
      {},
    ]);
    track(reveal(element(), { from: { x: "2rem", rotate: "0.5turn", blur: "0.5rem" } }));
    expect(animations[1]?.keyframes).toMatchObject([
      { transform: "translate(2rem, 0px) rotate(0.5turn)", filter: "blur(0.5rem)" },
      {},
    ]);
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
    expect(observer.thresholds).toEqual([0.5]);
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
      track(reveal(element(), native ? { keyframes: [{ opacity: 0 }, {}] } : {}));
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
  it("fails safe when native animation creation throws", () => {
    vi.spyOn(Element.prototype, "animate").mockImplementation(() => {
      throw new TypeError("invalid easing");
    });
    const target = element();
    expect(() =>
      track(reveal(target, { keyframes: [{ opacity: 0, easing: "bogus" }, {}] })),
    ).not.toThrow();
    expect(target.hasAttribute("data-reveal")).toBe(false);
    expect(target.style.opacity).toBe("");
  });
  it("exposes content with no WAAPI or IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const target = element();
    track(reveal(target));
    expect(animations[0]?.play).toHaveBeenCalledOnce();
    uninstallAnimate();
    track(reveal(element()));
  });
  it("fails safe when observer construction or observation throws", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor() {
          throw new RangeError("threshold");
        }
      },
    );
    expect(() => track(reveal(element(), { threshold: 2 }))).not.toThrow();
    expect(animations[0]?.play).toHaveBeenCalledOnce();
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
  it("observes the container and only animates direct element children with no first delay", () => {
    const target = container();
    track(cascade(target, { interval: 50 }));
    expect(animations.map((a) => a.element)).toEqual(Array.from(target.children));
    expect(animations.map((a) => (a.options as KeyframeAnimationOptions).delay)).toEqual([
      0, 50, 100,
    ]);
    expect(observerOf(target)).toBeDefined();
    expect(observerOf(target.firstElementChild!)).toBeUndefined();
    intersect(target, true);
    expect(animations.every((a) => a.play.mock.calls.length === 1)).toBe(true);
  });
  it("keeps multiple containers independent", () => {
    const a = container(),
      b = container();
    track(cascade("body > div"));
    expect(animations.map((a) => (a.options as KeyframeAnimationOptions).delay)).toEqual([
      0, 80, 160, 0, 80, 160,
    ]);
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
