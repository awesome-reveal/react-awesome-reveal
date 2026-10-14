import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reveal, cascade, type RevealHandle } from "../../src/index";
import { mountBelowTheFold, scrollIntoView, scrollToTop, settle, showTopHalf } from "./helpers";

let target: HTMLElement;
let handles: RevealHandle[];
const track = (handle: RevealHandle) => {
  handles.push(handle);
  return handle;
};
const opacity = (element = target) => getComputedStyle(element).opacity;
const animation = (element = target) => element.getAnimations()[0]!;
const native = { keyframes: [{ opacity: 0 }, {}], duration: 60_000 };

beforeEach(() => {
  target = mountBelowTheFold();
  handles = [];
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false } as MediaQueryList);
});
afterEach(() => {
  for (const handle of handles) handle.dispose();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});
async function enter(element = target) {
  scrollIntoView(element);
  await expect.poll(() => animation(element)?.playState).toBe("running");
}

describe("zero-CSS reveal", () => {
  it("applies the first frame immediately and reveals the resting author style", async () => {
    const styles = document.querySelectorAll("style").length;
    track(reveal(target));
    expect(opacity()).toBe("0");
    expect(target.style.cssText).toBe("height: 100px;");
    expect(document.querySelectorAll("style").length).toBe(styles);
    expect(animation().effect!.getTiming().duration).toBe(600);
    expect((animation().effect as KeyframeEffect).getKeyframes()[0]).toMatchObject({
      opacity: "0",
      transform: "translate(0px, 24px)",
    });
    await enter();
    animation().finish();
    expect(opacity()).toBe("1");
    scrollToTop();
    await settle();
    expect(opacity()).toBe("1");
  });
  it.each(["left", "right", "top", "bottom"] as const)("reveals from %s", async (from) => {
    track(reveal(target, { from, duration: 60_000 }));
    expect(opacity()).toBe("0");
    await enter();
    animation().finish();
    expect(opacity()).toBe("1");
  });
  it("a custom object does not add defaults and preserves resting transforms", () => {
    target.style.transform = "rotate(10deg)";
    track(reveal(target, { from: { opacity: 0 } }));
    expect(getComputedStyle(target).transform).toBe(
      "matrix(0.984808, 0.173648, -0.173648, 0.984808, 0, 0)",
    );
    expect((animation().effect as KeyframeEffect).getKeyframes()[0]).not.toHaveProperty(
      "transform",
    );
  });
  it("applies transform-only custom state without a fade", () => {
    track(reveal(target, { from: { scale: 0.9, rotate: "-5deg", blur: "0.5rem" } }));
    expect(opacity()).toBe("1");
    expect((animation().effect as KeyframeEffect).getKeyframes()[0]).toMatchObject({
      transform: "scale(0.9) rotate(-5deg)",
      filter: "blur(0.5rem)",
    });
  });
  it("plays once and stays revealed when the element leaves and enters again", async () => {
    track(reveal(target, native));
    await enter();
    animation().finish();
    scrollToTop();
    await settle();
    scrollIntoView(target);
    await settle();
    expect(opacity()).toBe("1");
    expect(target.getAnimations()).toEqual([]);
  });
  it("waits for the threshold", async () => {
    track(reveal(target, { ...native, threshold: 0.8 }));
    showTopHalf(target);
    await settle();
    expect(animation().playState).toBe("paused");
    await enter();
  });
  it.each([false, true])(
    "disposes to resting style before/during animation: %s",
    async (during) => {
      target.style.opacity = "0.5";
      const handle = track(reveal(target, native));
      expect(opacity()).toBe("0");
      if (during) await enter();
      const effect = animation();
      handle.dispose();
      handle.dispose();
      expect(opacity()).toBe("0.5");
      expect(effect.playState).toBe("idle");
      expect(target.getAnimations()).toEqual([]);
      scrollIntoView(target);
      await settle();
      expect(target.getAnimations()).toEqual([]);
    },
  );
  it("invalid native values fail visible", () => {
    track(reveal(target, { keyframes: [{ opacity: 0, easing: "invalid" }, {}] }));
    expect(opacity()).toBe("1");
    expect(target.getAnimations()).toEqual([]);
  });
  it("reduced motion immediately exposes generated and native entrances", () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    track(reveal(target, native));
    track(reveal(target.firstElementChild!));
    expect(opacity()).toBe("1");
    expect(target.getAnimations({ subtree: true })).toEqual([]);
  });
  it("unsupported observation and invalid thresholds reveal immediately", () => {
    track(reveal(target, { ...native, threshold: 2 }));
    expect(animation().playState).toBe("running");
  });
});

describe("cascade", () => {
  it("applies only direct children and starts the first without initial delay", async () => {
    target.children[0]!.innerHTML = "<b>nested</b>";
    track(cascade(target, { ...native, interval: 10_000 }));
    const children = Array.from(target.children) as HTMLElement[];
    expect(target.getAnimations()).toEqual([]);
    expect(children.map(opacity)).toEqual(["0", "0", "0"]);
    expect(children.map((c) => animation(c).effect!.getTiming().delay)).toEqual([
      0, 10_000, 20_000,
    ]);
    expect(target.querySelector("b")!.getAnimations()).toEqual([]);
    scrollIntoView(target);
    await expect.poll(() => animation(children[0]).playState).toBe("running");
    expect(animation(children[0]).effect!.getComputedTiming().progress).not.toBeNull();
    expect(animation(children[1]).effect!.getComputedTiming().progress).toBe(0);
  });
  it("multiple containers remain independent and disposal cancels pending children", async () => {
    const other = document.createElement("ul");
    other.innerHTML = "<li>a</li><li>b</li>";
    document.body.append(other);
    const handle = track(cascade([target, other], { ...native, interval: 10_000 }));
    scrollIntoView(target);
    await expect.poll(() => animation(target.children[0] as HTMLElement).playState).toBe("running");
    expect(animation(other.children[0] as HTMLElement).playState).toBe("paused");
    handle.dispose();
    expect(target.getAnimations({ subtree: true })).toEqual([]);
    expect(other.getAnimations({ subtree: true })).toEqual([]);
    expect(Array.from(target.children).map((c) => getComputedStyle(c).opacity)).toEqual([
      "1",
      "1",
      "1",
    ]);
  });
  it("reduced motion bypasses every child delay", () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    track(cascade(target, { ...native, interval: 10_000 }));
    expect(target.getAnimations({ subtree: true })).toEqual([]);
    expect(Array.from(target.children).map((c) => getComputedStyle(c).opacity)).toEqual([
      "1",
      "1",
      "1",
    ]);
  });
});
