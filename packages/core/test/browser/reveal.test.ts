import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fade } from "../../src/keyframes/presets";
import { type RevealController, type RevealOptions, reveal } from "../../src/reveal";
import { mountBelowTheFold, scrollIntoView, scrollToTop, settle, showTopHalf } from "./helpers";

let element: HTMLElement;
let controller: RevealController | undefined;
// Long enough that no animation finishes while a test inspects it.
const options: RevealOptions = { keyframes: fade(), duration: 60_000, reducedMotion: "never" };

beforeEach(() => {
  element = mountBelowTheFold();
});

afterEach(() => {
  controller?.destroy();
  controller = undefined;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function isHidden() {
  return element.style.opacity === "0" && element.dataset.reveal === "hidden";
}

function countObservers(): IntersectionObserver[] {
  const observers: IntersectionObserver[] = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class extends IntersectionObserver {
      constructor(...args: ConstructorParameters<typeof IntersectionObserver>) {
        super(...args);
        observers.push(this);
      }
    },
  );
  return observers;
}

async function waitForReveal() {
  await expect.element(element).not.toHaveAttribute("data-reveal");
  expect(controller!.revealed).toBe(true);
}

async function revealInView(revealOptions: RevealOptions = options) {
  controller = reveal(element, revealOptions);
  scrollIntoView(element);
  await waitForReveal();
}

describe("reveal", () => {
  it("hides the element until it enters the viewport", async () => {
    controller = reveal(element, options);
    await settle();
    expect(isHidden()).toBe(true);
    expect(controller.revealed).toBe(false);
    expect(element.getAnimations()).toEqual([]);
  });

  it("plays the default keyframes with no options", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false } as MediaQueryList);
    controller = reveal(element);
    scrollIntoView(element);
    await waitForReveal();

    const [first] = (element.getAnimations()[0]!.effect as KeyframeEffect).getKeyframes();
    expect(first).toMatchObject({ opacity: "0", transform: "translate(0px, 16px)" });
  });

  it("removes the hidden style and starts the animation in the same frame", async () => {
    controller = reveal(element, { ...options, delay: 1000 });
    let opacityAtReveal: string | undefined;
    new MutationObserver(() => {
      opacityAtReveal ??= getComputedStyle(element).opacity;
    }).observe(element, { attributes: true });

    scrollIntoView(element);
    await waitForReveal();
    expect(element.getAttribute("style")).toBe("height: 100px;");
    expect(element.dataset.reveal).toBeUndefined();
    expect(element.getAnimations()).toHaveLength(1);
    expect(opacityAtReveal).toBe("0");
  });

  it("stays revealed after it leaves the viewport with once", async () => {
    await revealInView();
    scrollToTop();
    await settle();
    expect(controller!.revealed).toBe(true);
    expect(isHidden()).toBe(false);
  });

  it("hides the element again and cancels the animation when it leaves, without once", async () => {
    await revealInView({ ...options, once: false });
    const [animation] = element.getAnimations();

    scrollToTop();
    await expect.element(element).toHaveAttribute("data-reveal", "hidden");
    expect(controller!.revealed).toBe(false);
    expect(isHidden()).toBe(true);
    expect(animation!.playState).toBe("idle");
  });

  it("restarts the observer when the threshold changes", async () => {
    controller = reveal(element, { ...options, threshold: 1 });
    showTopHalf(element);
    await settle();
    expect(controller.revealed).toBe(false);

    controller.update({ ...options, threshold: 0.4 });
    await waitForReveal();
  });

  it("keeps the observer when only the animation options change", async () => {
    const observers = countObservers();
    controller = reveal(element, options);
    controller.update({ ...options, duration: 30_000 });
    expect(observers).toHaveLength(1);
  });

  it("replaces the options, so a removed option returns to its default", async () => {
    controller = reveal(element, { ...options, stagger: 100 });
    controller.update(options);
    scrollIntoView(element);
    await waitForReveal();
    expect(element.getAnimations()).toHaveLength(1);
  });

  it("plays the updated keyframes at the next reveal", async () => {
    controller = reveal(element, options);
    controller.update({ ...options, duration: 50_000 });
    scrollIntoView(element);
    await waitForReveal();
    expect(element.getAnimations()[0]!.effect!.getTiming().duration).toBe(50_000);
  });

  it("does not observe a revealed element again with once", async () => {
    const observers = countObservers();
    await revealInView();
    controller!.update({ ...options, threshold: 0.5 });
    expect(observers).toHaveLength(1);
  });

  it("observes a revealed element again, with no new animation, when once becomes false", async () => {
    await revealInView();
    const [animation] = element.getAnimations();

    controller!.update({ ...options, once: false });
    await settle();
    expect(element.getAnimations()).toEqual([animation]);
    scrollToTop();
    await expect.element(element).toHaveAttribute("data-reveal", "hidden");
  });

  it("stops the observation and the animation when destroyed", async () => {
    await revealInView({ ...options, once: false });
    const [animation] = element.getAnimations();

    controller!.destroy();
    expect(animation!.playState).toBe("idle");
    scrollToTop();
    await settle();
    expect(controller!.revealed).toBe(true);
  });

  it("ignores updates after destroy", async () => {
    const observers = countObservers();
    controller = reveal(element, options);
    controller.destroy();
    controller.update({ ...options, threshold: 0.5 });
    scrollIntoView(element);
    await settle();
    expect(observers).toHaveLength(1);
    expect(controller.revealed).toBe(false);
  });

  it("reveals the element at once without IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    controller = reveal(element, options);
    expect(controller.revealed).toBe(true);
    expect(isHidden()).toBe(false);
    expect(element.getAnimations()).toHaveLength(1);
  });
});
