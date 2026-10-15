import { act, render, screen } from "@testing-library/react";
import { forwardRef, StrictMode, Suspense, useLayoutEffect, useState, version } from "react";

import { defaultKeyframes } from "@awesome-reveal/test-utils/entrance-fixtures";
import { type RevealOptions, useReveal } from "../src/useReveal";
import {
  animations,
  runningAnimations,
  uninstallAnimate,
} from "@awesome-reveal/test-utils/animate";
import { observerOf } from "@awesome-reveal/test-utils/intersection-observer";

import { intersect } from "./intersect";
import { useCascade } from "../src/useCascade";

function Box(props: Partial<RevealOptions>) {
  const { getProps, revealed } = useReveal<HTMLDivElement>(props as RevealOptions);

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

    expect(box()).toHaveStyle({ opacity: "1" });
    expect(box()).toHaveAttribute("data-revealed", "true");
    expect(animations).toHaveLength(1);
    expect(animations[0]).toMatchObject({
      element: box(),
      keyframes: defaultKeyframes,
      options: { duration: 600, delay: 0, fill: "backwards" },
    });
  });

  it("waits until the visible fraction reaches the threshold", () => {
    render(<Box threshold={0.5} />);

    intersect(box(), 0.2);
    expect(box()).toHaveStyle({ opacity: "0" });

    intersect(box(), 0.6);
    expect(box()).toHaveStyle({ opacity: "1" });
  });

  it("stops observing after the first reveal by default", () => {
    render(<Box />);
    intersect(box(), true);

    expect(observerOf(box())).toBeUndefined();
  });

  it("cancels the animation on unmount", async () => {
    const { unmount } = render(<Box />);
    intersect(box(), true);
    unmount();
    await act(async () => {});

    expect(runningAnimations()).toHaveLength(0);
  });

  it("applies option changes to the next reveal without replaying", () => {
    const keyframes = [{ opacity: 0 }, { opacity: 1 }];
    const { rerender } = render(<Box duration={300} />);
    intersect(box(), true);
    rerender(<Box duration={400} keyframes={keyframes} />);

    expect(animations).toHaveLength(1);

    rerender(<Box when={false} duration={400} keyframes={keyframes} />);
    rerender(<Box when duration={400} keyframes={keyframes} />);
    expect(animations[1]).toMatchObject({
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
      options: { duration: 400 },
    });
  });

  it("starts the animation in the commit that reveals the element", () => {
    const animationsAtCommit: number[] = [];
    function Probe() {
      const { getProps, revealed } = useReveal<HTMLDivElement>({ keyframes: defaultKeyframes });
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
    expect(box()).toHaveStyle({ opacity: "1" });
    expect(animations).toHaveLength(1);
  });

  it.each([true, false])("automatically respects reduced motion: %s", (reduce) => {
    stubReducedMotion(reduce);
    render(<Box />);
    expect(box()).toHaveStyle({ opacity: reduce ? "1" : "0" });
    intersect(box(), true);
    expect(animations).toHaveLength(reduce ? 0 : 1);
  });

  it("reveals the element when IntersectionObserver is not available", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Box />);

    expect(box()).toHaveStyle({ opacity: "1" });
  });

  it("shows the element without animation when Element.animate is not available", () => {
    uninstallAnimate();
    render(<Box />);
    intersect(box(), true);

    expect(box()).toHaveStyle({ opacity: "1" });
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

  it("calls onReveal once for each reveal under StrictMode", () => {
    const onReveal = vi.fn();
    render(
      <StrictMode>
        <Box when onReveal={onReveal} />
      </StrictMode>,
    );

    expect(onReveal.mock.calls).toEqual([[box()]]);
  });

  it("plays the entrance on a new element when `when` turns true as the old one unmounts", async () => {
    function Toggle({ show, when }: { show: boolean; when: boolean }) {
      const { getProps } = useReveal<HTMLDivElement>({ keyframes: defaultKeyframes, when });
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
      const { getProps } = useReveal<HTMLDivElement>({
        keyframes: defaultKeyframes,
        when: true,
        duration,
      });
      return show ? <div {...getProps({ "data-testid": "box" })} /> : null;
    }
    const { rerender } = render(<Late show={false} duration={100} />);
    rerender(<Late show duration={900} />);

    expect(animations).toHaveLength(1);
    expect(animations[0]?.options).toMatchObject({ duration: 900 });
  });

  it.each([
    ["useReveal in the viewport", useReveal, undefined],
    ["useCascade in the viewport", useCascade, undefined],
    ["useReveal with when", useReveal, true],
    ["useCascade with when", useCascade, true],
  ] as const)(
    "%s attaches an element mounted by a child after the hook's commit",
    async (_, useTarget, when) => {
      const onReveal = vi.fn();
      const Late = forwardRef<HTMLDivElement, object>(function Late(props, ref) {
        const [show, setShow] = useState(false);
        return (
          <>
            <button onClick={() => setShow(true)}>Show</button>
            {show && (
              <div {...props} ref={ref} data-testid="box">
                <span>one</span>
                <span>two</span>
              </div>
            )}
          </>
        );
      });
      function Parent() {
        const { getProps } = useTarget<HTMLDivElement>({ when, onReveal });
        return <Late {...getProps()} />;
      }
      const { unmount } = render(<Parent />);

      await act(async () => screen.getByRole("button", { name: "Show" }).click());

      if (when == null) {
        expect(observerOf(box())).toBeDefined();
        intersect(box(), true);
      } else expect(observerOf(box())).toBeUndefined();
      expect(onReveal).toHaveBeenCalledExactlyOnceWith(box());
      expect(animations.map(({ element }) => element)).toEqual(
        useTarget === useCascade ? Array.from(box().children) : [box()],
      );
      unmount();
      await act(async () => {});
      expect(runningAnimations()).toHaveLength(0);
    },
  );

  it("does not replay a finished entrance when Suspense in a child hides and shows the element", async () => {
    let resume = () => {};
    let done = false;
    function Pending({ wait }: { wait?: Promise<void> }) {
      if (wait && !done) throw wait;
      return null;
    }
    const Child = forwardRef<HTMLDivElement, object>(function Child(props, ref) {
      const [wait, setWait] = useState<Promise<void>>();
      return (
        <>
          <button onClick={() => setWait(new Promise((resolve) => (resume = resolve)))}>
            Suspend
          </button>
          <Suspense fallback={null}>
            <div {...props} ref={ref} data-testid="box" />
            <Pending wait={wait} />
          </Suspense>
        </>
      );
    });
    function Parent() {
      const { getProps } = useReveal<HTMLDivElement>({ when: true });
      return <Child {...getProps()} />;
    }
    render(<Parent />);
    await act(async () => {});
    const element = box();
    for (const animation of animations) animation.finish();

    await act(async () => screen.getByRole("button", { name: "Suspend" }).click());
    expect(element).not.toHaveAttribute("data-awesome-reveal-attached");
    await act(async () => {
      done = true;
      resume();
    });

    expect(box()).toBe(element);
    expect(element).toHaveAttribute("data-awesome-reveal-attached");
    expect(animations).toHaveLength(1);
  });

  it("does not animate a new element when `when` turns false as it mounts", () => {
    function Late({ show, when }: { show: boolean; when: boolean }) {
      const { getProps } = useReveal<HTMLDivElement>({ keyframes: defaultKeyframes, when });
      return show ? <div {...getProps({ "data-testid": "box" })} /> : null;
    }
    const { rerender } = render(<Late show={false} when />);
    rerender(<Late show when={false} />);

    expect(animations).toHaveLength(0);
    expect(box()).toHaveStyle({ opacity: "0" });
  });
});
