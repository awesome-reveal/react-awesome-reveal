import { act, render, screen } from "@testing-library/react";
import { StrictMode, useLayoutEffect, version } from "react";

import { slide } from "../src/keyframes";
import { type RevealOptions, useReveal } from "../src/useReveal";
import {
  animations,
  runningAnimations,
  uninstallAnimate,
} from "@awesome-reveal/test-utils/animate";
import { observerOf } from "@awesome-reveal/test-utils/intersection-observer";

import { intersect } from "./intersect";

function Box(props: Partial<RevealOptions>) {
  const { getProps, revealed } = useReveal<HTMLDivElement>({ keyframes: slide(), ...props });

  return (
    <div {...getProps({ "data-testid": "box", "data-revealed": revealed })}>
      <span>one</span>
      <span>two</span>
      <span>three</span>
    </div>
  );
}

function box(): HTMLElement {
  return screen.getByTestId("box");
}

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", () => ({ matches: reduce }));
}

describe(`useReveal (React ${version})`, () => {
  it("hides the element until it enters the viewport", () => {
    render(<Box />);

    expect(box()).toHaveStyle({ opacity: "0" });
    expect(box()).toHaveAttribute("data-revealed", "false");
    expect(animations).toHaveLength(0);
  });

  it("reveals and animates the element when it enters the viewport", () => {
    render(<Box />);
    intersect(box(), true);

    expect(box().style.opacity).toBe("");
    expect(box()).toHaveAttribute("data-revealed", "true");
    expect(animations).toHaveLength(1);
    expect(animations[0]).toMatchObject({
      element: box(),
      keyframes: slide(),
      options: { duration: 600, delay: 0, fill: "backwards" },
    });
  });

  it("passes duration and delay to the animation", () => {
    render(<Box duration={300} delay={100} />);
    intersect(box(), true);

    expect(animations[0]?.options).toEqual({ duration: 300, delay: 100, fill: "backwards" });
  });

  it("staggers the element children instead of the element", () => {
    render(<Box delay={100} stagger={50} />);
    intersect(box(), true);

    expect(animations.map(({ element }) => element.textContent)).toEqual(["one", "two", "three"]);
    expect(animations.map(({ options }) => (options as KeyframeAnimationOptions).delay)).toEqual([
      100, 150, 200,
    ]);
  });

  it("passes threshold and rootMargin to the observer", () => {
    render(<Box threshold={0.5} rootMargin="10px" />);

    expect(observerOf(box())).toMatchObject({ thresholds: [0.5], rootMargin: "10px" });
  });

  it("waits until the visible fraction reaches the threshold", () => {
    render(<Box threshold={0.5} />);

    intersect(box(), 0.2);
    expect(box()).toHaveStyle({ opacity: "0" });

    intersect(box(), 0.6);
    expect(box().style.opacity).toBe("");
  });

  it("stops observing after the first reveal by default", () => {
    render(<Box />);
    intersect(box(), true);

    expect(observerOf(box())).toBeUndefined();
  });

  it("hides the element again and cancels the animation when it leaves the viewport and once is false", () => {
    render(<Box once={false} />);
    intersect(box(), true);
    intersect(box(), false);

    expect(box()).toHaveStyle({ opacity: "0" });
    expect(runningAnimations()).toHaveLength(0);

    intersect(box(), true);
    expect(animations).toHaveLength(2);
    expect(runningAnimations()).toHaveLength(1);
  });

  it("cancels the animation on unmount", async () => {
    const { unmount } = render(<Box />);
    intersect(box(), true);
    unmount();
    await act(async () => {});

    expect(runningAnimations()).toHaveLength(0);
  });

  it("applies option changes to the next reveal without replaying", () => {
    const { rerender } = render(<Box once={false} duration={300} />);
    intersect(box(), true);
    rerender(<Box once={false} duration={400} keyframes={[{ opacity: 0 }, {}]} />);

    expect(animations).toHaveLength(1);

    intersect(box(), false);
    intersect(box(), true);
    expect(animations[1]).toMatchObject({
      keyframes: [{ opacity: 0 }, {}],
      options: { duration: 400 },
    });
  });

  it("starts the animation in the commit that reveals the element", () => {
    const animationsAtCommit: number[] = [];
    function Probe() {
      const { getProps, revealed } = useReveal<HTMLDivElement>({ keyframes: slide() });
      useLayoutEffect(() => {
        if (revealed) animationsAtCommit.push(animations.length);
      }, [revealed]);
      return <div {...getProps({ "data-testid": "box" })} />;
    }

    render(<Probe />);
    intersect(box(), true);

    expect(animationsAtCommit).toEqual([1]);
  });

  it("follows `when` and does not observe the viewport", () => {
    const { rerender } = render(<Box when={false} />);

    expect(observerOf(box())).toBeUndefined();
    expect(box()).toHaveStyle({ opacity: "0" });

    rerender(<Box when />);
    expect(box().style.opacity).toBe("");
    expect(animations).toHaveLength(1);
  });

  it.each([
    ["user", true, 0],
    ["user", false, 1],
    ["always", false, 0],
    ["never", true, 1],
  ] as const)(
    "with reducedMotion %s and a reduce preference of %s, plays %i animations",
    (reducedMotion, reduce, count) => {
      stubReducedMotion(reduce);
      render(<Box reducedMotion={reducedMotion} />);
      intersect(box(), true);

      expect(box().style.opacity).toBe("");
      expect(animations).toHaveLength(count);
    },
  );

  it("reveals the element when IntersectionObserver is not available", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Box />);

    expect(box().style.opacity).toBe("");
  });

  it("shows the element without animation when Element.animate is not available", () => {
    uninstallAnimate();
    render(<Box />);
    intersect(box(), true);

    expect(box().style.opacity).toBe("");
  });

  it("leaves one running animation under StrictMode", () => {
    render(
      <StrictMode>
        <Box />
      </StrictMode>,
    );
    intersect(box(), true);

    expect(runningAnimations()).toHaveLength(1);
  });

  it("plays the entrance on a new element when `when` turns true as the old one unmounts", async () => {
    function Toggle({ show, when }: { show: boolean; when: boolean }) {
      const { getProps } = useReveal<HTMLDivElement>({ keyframes: slide(), when });
      return show ? <div {...getProps({ "data-testid": "box" })} /> : null;
    }
    const { rerender } = render(<Toggle show when={false} />);
    rerender(<Toggle show={false} when />);
    await act(async () => {});
    rerender(<Toggle show when />);

    expect(animations.map(({ element }) => element)).toEqual([box()]);
  });

  it("plays the entrance of a new element with the options of the same commit", () => {
    function Late({ show, duration }: { show: boolean; duration: number }) {
      const { getProps } = useReveal<HTMLDivElement>({ keyframes: slide(), when: true, duration });
      return show ? <div {...getProps({ "data-testid": "box" })} /> : null;
    }
    const { rerender } = render(<Late show={false} duration={100} />);
    rerender(<Late show duration={900} />);

    expect(animations).toHaveLength(1);
    expect(animations[0]?.options).toMatchObject({ duration: 900 });
  });

  it("does not animate a new element when `when` turns false as it mounts", () => {
    function Late({ show, when }: { show: boolean; when: boolean }) {
      const { getProps } = useReveal<HTMLDivElement>({ keyframes: slide(), when });
      return show ? <div {...getProps({ "data-testid": "box" })} /> : null;
    }
    const { rerender } = render(<Late show={false} when />);
    rerender(<Late show when={false} />);

    expect(animations).toHaveLength(0);
    expect(box()).toHaveStyle({ opacity: "0" });
  });
});
