import { render, screen } from "@testing-library/react";
import { createRef, version } from "react";

import { fadeKeyframes, defaultKeyframes } from "@awesome-reveal/test-utils/entrance-fixtures";
import { Reveal } from "../src/Reveal";
import { animations } from "@awesome-reveal/test-utils/animate";
import { intersect } from "./intersect";

describe(`Reveal (React ${version})`, () => {
  it("renders one hidden div around its children", () => {
    const { container } = render(
      <Reveal keyframes={fadeKeyframes}>
        <p>one</p>
        text
        <p>two</p>
      </Reveal>,
    );

    const element = container.firstElementChild as HTMLElement;
    expect(container.children).toHaveLength(1);
    expect(element.tagName).toBe("DIV");
    expect(element).toHaveTextContent("onetexttwo");
    expect(element).toHaveStyle({ opacity: "0" });
    expect(element).toHaveAttribute("data-reveal", "hidden");
    expect(element).not.toHaveAttribute("class");
  });

  it("reveals and animates when it enters the viewport", () => {
    const { container } = render(<Reveal keyframes={fadeKeyframes}>child</Reveal>);
    const element = container.firstElementChild as HTMLElement;
    intersect(element, true);

    expect(element).toHaveStyle({ opacity: "1" });
    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations[0]?.element).toBe(element);
  });

  it("plays the default keyframes without keyframes", () => {
    const { container } = render(<Reveal>child</Reveal>);
    intersect(container.firstElementChild!, true);

    expect(animations[0]?.keyframes).toEqual(defaultKeyframes);
  });

  it("renders the tag given by `as`", () => {
    render(
      <Reveal as="ul" keyframes={fadeKeyframes}>
        <li>one</li>
        <li>two</li>
      </Reveal>,
    );
    const list = screen.getByRole("list");
    intersect(list, true);

    expect(animations.map(({ element }) => element.tagName)).toEqual(["UL"]);
  });

  it("passes HTML attributes through", () => {
    render(
      <Reveal as="a" keyframes={fadeKeyframes} href="/docs" className="link" aria-label="Docs" />,
    );

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link")).toHaveClass("link", { exact: true });
  });

  it("hides an element with its own style, and keeps that style when revealed", () => {
    const { container } = render(
      <Reveal keyframes={fadeKeyframes} style={{ color: "red", opacity: 0.5 }}>
        child
      </Reveal>,
    );
    const element = container.firstElementChild as HTMLElement;

    expect(element).toHaveStyle({ color: "rgb(255, 0, 0)", opacity: "0" });

    intersect(element, true);
    expect(element).toHaveStyle({ color: "rgb(255, 0, 0)", opacity: "0.5" });
  });

  it("leaves children and their refs untouched", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Reveal keyframes={fadeKeyframes}>
        <span ref={ref} className="child">
          child
        </span>
      </Reveal>,
    );

    expect(ref.current).toBe(screen.getByText("child"));
    expect(ref.current).toHaveClass("child", { exact: true });
  });

  it("renders no text for boolean children", () => {
    const { container } = render(<Reveal keyframes={fadeKeyframes}>{false}</Reveal>);

    expect(container).toHaveTextContent("");
  });

  describe("ref", () => {
    it("sets an object ref and still reveals the element", () => {
      const ref = createRef<HTMLDivElement>();
      const { unmount } = render(<Reveal keyframes={fadeKeyframes} ref={ref} />);
      const element = ref.current!;

      expect(element.tagName).toBe("DIV");
      intersect(element, true);
      expect(animations[0]?.element).toBe(element);

      unmount();
      expect(ref.current).toBeNull();
    });

    it("calls a callback ref with the element, then with null", () => {
      const ref = vi.fn();
      const { container, unmount } = render(
        <Reveal as="section" keyframes={fadeKeyframes} ref={ref} />,
      );
      const element = container.firstElementChild;

      intersect(element!, true);
      unmount();

      expect(ref.mock.calls).toEqual([[element], [null]]);
      expect(animations[0]?.element).toBe(element);
    });

    it("keeps the same ref callback across renders with the same ref", () => {
      const ref = vi.fn();
      const { rerender } = render(<Reveal keyframes={fadeKeyframes} ref={ref} className="a" />);
      rerender(<Reveal keyframes={fadeKeyframes} ref={ref} className="b" />);

      expect(ref).toHaveBeenCalledTimes(1);
    });

    it("does not replay the animation when the callback ref changes on each render", () => {
      const { container, rerender } = render(<Reveal keyframes={fadeKeyframes} ref={() => {}} />);
      intersect(container.firstElementChild!, true);
      rerender(<Reveal keyframes={fadeKeyframes} ref={() => {}} />);
      rerender(<Reveal keyframes={fadeKeyframes} ref={() => {}} />);

      expect(animations).toHaveLength(1);
    });

    // React 18 does not support cleanup functions from callback refs.
    it.runIf(version.startsWith("19."))("runs the cleanup that a callback ref returns", () => {
      const cleanup = vi.fn();
      const ref = vi.fn(() => cleanup);
      const { container, unmount } = render(<Reveal keyframes={fadeKeyframes} ref={ref} />);
      const element = container.firstElementChild!;

      unmount();

      expect(ref.mock.calls).toEqual([[element]]);
      expect(cleanup).toHaveBeenCalledOnce();
    });
  });
});
