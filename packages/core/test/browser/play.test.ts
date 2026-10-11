import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fade } from "../../src/keyframes/presets";
import { play } from "../../src/play";

let element: HTMLElement;
const keyframes = fade();

beforeEach(() => {
  document.body.innerHTML = `<div id="target"><p>a</p><p>b</p><p>c</p></div>`;
  element = document.getElementById("target")!;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function timing(target: Element) {
  return target.getAnimations().map((animation) => {
    const { duration, delay, fill } = animation.effect!.getTiming();
    return { duration, delay, fill };
  });
}

describe("play", () => {
  it("animates the element with the default timing", () => {
    play(element, { keyframes, reducedMotion: "never" });
    expect(timing(element)).toEqual([{ duration: 600, delay: 0, fill: "backwards" }]);
  });

  it("plays the default keyframes without keyframes", () => {
    play(element, { reducedMotion: "never" });
    const [first] = (element.getAnimations()[0]!.effect as KeyframeEffect).getKeyframes();
    expect(first).toMatchObject({ opacity: "0", transform: "translate(0px, 24px)" });
  });

  it("applies the first keyframe in the frame that starts it, also during the delay", () => {
    play(element, { keyframes, delay: 1000, reducedMotion: "never" });
    expect(getComputedStyle(element).opacity).toBe("0");
  });

  it("animates the children one after the other with stagger", () => {
    play(element, { keyframes, duration: 300, delay: 50, stagger: 100, reducedMotion: "never" });

    expect(element.getAnimations()).toEqual([]);
    expect([...element.children].flatMap(timing)).toEqual([
      { duration: 300, delay: 50, fill: "backwards" },
      { duration: 300, delay: 150, fill: "backwards" },
      { duration: 300, delay: 250, fill: "backwards" },
    ]);
  });

  it("cancels the animations with the returned function", () => {
    const cancel = play(element, { keyframes, stagger: 100, reducedMotion: "never" });
    cancel();
    expect(document.getAnimations()).toEqual([]);
    expect(getComputedStyle(element.children[0]!).opacity).toBe("1");
  });

  it.each([
    ["user", true, 0],
    ["user", false, 1],
    ["always", false, 0],
    ["never", true, 1],
  ] as const)(
    "with reducedMotion %s and a reduced motion preference of %s, plays %i animations",
    (reducedMotion, prefersReduced, count) => {
      const matchMedia = window.matchMedia.bind(window);
      vi.spyOn(window, "matchMedia").mockImplementation((query) =>
        query === "(prefers-reduced-motion: reduce)"
          ? ({ matches: prefersReduced } as MediaQueryList)
          : matchMedia(query),
      );

      play(element, { keyframes, reducedMotion });
      expect(element.getAnimations()).toHaveLength(count);
    },
  );

  it("shows the element with no animation without Element.animate", () => {
    const animate = Object.getOwnPropertyDescriptor(Element.prototype, "animate")!;
    delete (Element.prototype as Partial<Element>).animate;
    try {
      expect(() => play(element, { keyframes, reducedMotion: "never" })()).not.toThrow();
    } finally {
      Object.defineProperty(Element.prototype, "animate", animate);
    }
  });
});
