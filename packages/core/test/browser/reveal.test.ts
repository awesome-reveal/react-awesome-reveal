import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reveal, cascade, type RevealHandle, type RevealOptions } from "../../src/index";
import { createReveal } from "../../src/adapter";
import { collectReports } from "@awesome-reveal/test-utils/reports";
import { mountBelowTheFold, scrollIntoView, scrollToTop, settle, showTopHalf } from "./helpers";

let target: HTMLElement;
let handles: RevealHandle[];
const track = (handle: RevealHandle) => {
  handles.push(handle);
  return handle;
};
const opacity = (element = target) => getComputedStyle(element).opacity;
const animation = (element = target) => element.getAnimations()[0]!;
const native = { keyframes: [{ opacity: 0 }, { opacity: 1 }], duration: 60_000 };

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
    expect(getComputedStyle(target).translate).toBe("0px");
    expect((animation().effect as KeyframeEffect).getKeyframes()).toContainEqual(
      expect.objectContaining({ translate: "0px 24px" }),
    );
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
    expect((animation().effect as KeyframeEffect).getKeyframes()).toHaveLength(2);
  });
  it("applies transform-only custom state without a fade", () => {
    track(reveal(target, { from: { scale: 0.9, rotate: "-5deg", blur: "0.5rem" } }));
    expect(opacity()).toBe("1");
    expect(getComputedStyle(target)).toMatchObject({
      scale: "0.9",
      rotate: "-5deg",
      filter: "blur(8px)",
    });
  });
  it("adds the entrance to the element's own transforms, filter and opacity", () => {
    Object.assign(target.style, {
      transform: "scale(2)",
      translate: "10px 0px",
      rotate: "10deg",
      filter: "brightness(0.5)",
      opacity: "0.5",
    });
    track(reveal(target, { from: { opacity: 0.2, x: 24, rotate: 5, blur: 8 }, duration: 1000 }));
    const style = getComputedStyle(target);
    expect(style).toMatchObject({
      opacity: "0.2",
      translate: "34px",
      rotate: "15deg",
      filter: "brightness(0.5) blur(8px)",
    });
    animation().currentTime = 500;
    // The easing is at about 96% of the change at the midpoint, so the fade goes to the element's 0.5.
    expect(Number(style.opacity)).toBeCloseTo(0.49, 2);
    animation().currentTime = 1000;
    expect(style).toMatchObject({
      opacity: "0.5",
      translate: "10px",
      rotate: "10deg",
      filter: "brightness(0.5)",
      transform: "matrix(2, 0, 0, 2, 0, 0)",
    });
  });
  it("moves the offset in screen pixels when the element has its own scale", () => {
    target.style.transform = "scale(2)";
    track(reveal(target, { from: { x: 24 }, duration: 1000 }));
    const start = target.getBoundingClientRect().x;
    animation().currentTime = 1000;
    expect(start - target.getBoundingClientRect().x).toBeCloseTo(24);
  });
  it.each<[string, RevealOptions]>([
    ["from", { from: "left", duration: 60_000 }],
    ["keyframes", native],
  ])("delay holds the start state of %s until the delay ends", async (_, options) => {
    track(reveal(target, { ...options, delay: 60_000 }));
    await enter();
    expect(opacity()).toBe("0");
    animation().currentTime = 59_999;
    expect(opacity()).toBe("0");
    animation().currentTime = 90_000;
    expect(Number(opacity())).toBeGreaterThan(0);
    expect(Number(opacity())).toBeLessThan(1);
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
  it.each(["finish", "cancel"] as const)(
    "does not play a waiting entrance that page code called %s() on",
    async (method) => {
      track(reveal(target, native));
      const effect = animation();
      effect[method]();
      expect(opacity()).toBe("1");
      scrollIntoView(target);
      await settle();
      expect(effect.playState).toBe(method === "finish" ? "finished" : "idle");
      expect(opacity()).toBe("1");
    },
  );
  it("plays a waiting entrance that page code paused", async () => {
    track(reveal(target, native));
    animation().pause();
    await enter();
  });
  it("waits for the threshold", async () => {
    track(reveal(target, { ...native, threshold: 0.8 }));
    showTopHalf(target);
    await settle();
    expect(animation().playState).toBe("paused");
    await enter();
  });
  it("reveals a hidden start state whose offset an ancestor clips", async () => {
    document.body.innerHTML = `<div style="height: 150vh"></div><div id="clip" style="height: 10px; overflow: hidden"><div id="small" style="height: 10px">a</div></div><div style="height: 150vh"></div>`;
    const small = document.getElementById("small")!;
    track(reveal(small));
    expect(opacity(small)).toBe("0");
    scrollIntoView(document.getElementById("clip")!);
    await expect.poll(() => animation(small).playState).toBe("running");
  });
  it("reveals an element taller than the viewport at its entry when it cannot reach the threshold", async () => {
    target.style.height = "300vh";
    track(reveal(target, { ...native, threshold: 0.5 }));
    await settle();
    expect(animation().playState).toBe("paused");
    scrollTo(0, target.offsetTop - innerHeight / 2);
    await expect.poll(() => animation().playState).toBe("running");
  });
  it("reveals when focus enters the element, also below the threshold", async () => {
    target.innerHTML = `<a href="#">a</a>`;
    track(reveal(target, { ...native, threshold: 0.8 }));
    showTopHalf(target);
    await settle();
    expect(animation().playState).toBe("paused");
    target.querySelector("a")!.focus();
    expect(animation().playState).toBe("running");
  });
  it("reveals an element taller than its scroll container when it leaves before the threshold", async () => {
    document.body.innerHTML = `<div id="scroller" style="height: 300px; overflow: auto"><div style="height: 400px"></div><div id="tall" style="height: 900px"></div><div style="height: 400px"></div></div>`;
    const scroller = document.getElementById("scroller")!;
    const tall = document.getElementById("tall")!;
    track(reveal(tall, { ...native, threshold: 0.5 }));
    scroller.scrollTop = 300;
    await settle();
    expect(animation(tall).playState).toBe("paused");
    scroller.scrollTop = 1400;
    await expect.poll(() => animation(tall).playState).toBe("running");
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
  it("invalid native values fail visible and report the browser error", () => {
    const reports = collectReports();
    track(reveal(target, { keyframes: [{ opacity: 0, easing: "invalid" }, { opacity: 1 }] }));
    expect(opacity()).toBe("1");
    expect(target.getAnimations()).toEqual([]);
    expect(reports()).toEqual([expect.any(TypeError)]);
  });
  it("reduced motion immediately exposes generated, native and delayed entrances", () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    track(reveal(target, { ...native, delay: 60_000 }));
    track(reveal(target.firstElementChild!));
    expect(opacity()).toBe("1");
    expect(target.getAnimations({ subtree: true })).toEqual([]);
  });
  it("print shows the waiting entrances, and the reveal still plays after the print", async () => {
    track(reveal(target, native));
    dispatchEvent(new Event("beforeprint"));
    expect(opacity()).toBe("1");
    dispatchEvent(new Event("afterprint"));
    expect(opacity()).toBe("0");
    await enter();
    expect(animation().currentTime as number).toBeLessThan(60_000);
  });
  it("print shows an entrance in its delay, and it keeps the delay after the print", async () => {
    track(reveal(target, { ...native, delay: 60_000 }));
    await enter();
    dispatchEvent(new Event("beforeprint"));
    expect(opacity()).toBe("1");
    dispatchEvent(new Event("afterprint"));
    expect(opacity()).toBe("0");
    expect(animation().playState).toBe("running");
    expect(animation().currentTime as number).toBeLessThan(60_000);
  });
  it("print does not change a playing entrance", async () => {
    track(reveal(target, native));
    await enter();
    const time = animation().currentTime as number;
    dispatchEvent(new Event("beforeprint"));
    dispatchEvent(new Event("afterprint"));
    expect(animation().playState).toBe("running");
    expect(animation().currentTime as number).toBeGreaterThanOrEqual(time);
    expect(animation().currentTime as number).toBeLessThan(60_000);
  });
  it("invalid thresholds reveal immediately and report the browser error", () => {
    const reports = collectReports();
    track(reveal(target, { ...native, threshold: 2 }));
    expect(animation().playState).toBe("running");
    expect(reports()).toEqual([expect.any(RangeError)]);
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
  it("print shows the waiting children", () => {
    track(cascade(target, { ...native, interval: 10_000 }));
    dispatchEvent(new Event("beforeprint"));
    expect(Array.from(target.children).map((c) => getComputedStyle(c).opacity)).toEqual([
      "1",
      "1",
      "1",
    ]);
    dispatchEvent(new Event("afterprint"));
    expect(Array.from(target.children).map((c) => getComputedStyle(c).opacity)).toEqual([
      "0",
      "0",
      "0",
    ]);
  });
  it("print shows the children in their delay, and they keep the delay after the print", async () => {
    track(cascade(target, { ...native, interval: 60_000 }));
    const child = target.children[1] as HTMLElement;
    scrollIntoView(target);
    await expect.poll(() => animation(child).playState).toBe("running");
    const time = animation(child).currentTime as number;
    dispatchEvent(new Event("beforeprint"));
    expect(opacity(child)).toBe("1");
    dispatchEvent(new Event("afterprint"));
    expect(opacity(child)).toBe("0");
    expect(animation(child).playState).toBe("running");
    expect(animation(child).currentTime as number).toBeGreaterThanOrEqual(time);
    expect(animation(child).currentTime as number).toBeLessThan(60_000);
    animation(child).currentTime = 90_000;
    expect(Number(opacity(child))).toBeGreaterThan(0);
    expect(Number(opacity(child))).toBeLessThan(1);
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

describe("adapter store", () => {
  it("a hide during the delay resets the element, and no entrance plays later", async () => {
    const options = { ...native, delay: 60_000 };
    const state = createReveal({ ...options, when: true });
    state.attach(target);
    const entrance = animation();
    entrance.currentTime = 30_000;
    expect(entrance.playState).toBe("running");
    expect(opacity()).toBe("0");
    state.setOptions({ ...options, when: false });
    expect(entrance.playState).toBe("idle");
    expect(opacity()).toBe("1");
    await settle();
    expect(target.getAnimations()).toEqual([]);
    state.attach(null);
  });
});
