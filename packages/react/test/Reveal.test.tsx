import { render, screen } from "@testing-library/react";
import { createRef, version } from "react";

import { fade, slide } from "../src/keyframes";
import { Reveal } from "../src/Reveal";
import { animations } from "@awesome-reveal/test-utils/animate";
import { intersect } from "./intersect";

describe(`Reveal (React ${version})`, () => {
  it("renders one hidden div around its children", () => {
    const { container } = render(
      <Reveal keyframes={fade()}>
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
    const { container } = render(<Reveal keyframes={fade()}>child</Reveal>);
    const element = container.firstElementChild as HTMLElement;
    intersect(element, true);

    expect(element.style.opacity).toBe("");
    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations[0]?.element).toBe(element);
  });

  it("plays the default keyframes without keyframes", () => {
    const { container } = render(<Reveal>child</Reveal>);
    intersect(container.firstElementChild!, true);

    expect(animations[0]?.keyframes).toEqual(slide());
  });

  it("renders the tag given by `as`", () => {
    render(
      <Reveal as="ul" keyframes={fade()} stagger={80}>
        <li>one</li>
        <li>two</li>
      </Reveal>,
    );
    const list = screen.getByRole("list");
    intersect(list, true);

    expect(animations.map(({ element }) => element.tagName)).toEqual(["LI", "LI"]);
  });

  it("passes HTML attributes through", () => {
    render(<Reveal as="a" keyframes={fade()} href="/docs" className="link" aria-label="Docs" />);

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByRole("link")).toHaveClass("link", { exact: true });
  });

  it("merges the hidden style into the given style and restores it when revealed", () => {
    const { container } = render(
      <Reveal keyframes={fade()} style={{ color: "red", opacity: 0.5 }}>
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
      <Reveal keyframes={fade()}>
        <span ref={ref} className="child">
          child
        </span>
      </Reveal>,
    );

    expect(ref.current).toBe(screen.getByText("child"));
    expect(ref.current).toHaveClass("child", { exact: true });
  });

  it("renders no text for boolean children", () => {
    const { container } = render(<Reveal keyframes={fade()}>{false}</Reveal>);

    expect(container).toHaveTextContent("");
  });

  it("keeps staggered children hidden before it is in view", () => {
    const { container } = render(
      <Reveal keyframes={fade()} stagger={50}>
        <span>a</span>
        <span>b</span>
      </Reveal>,
    );

    expect(container.firstElementChild).toHaveStyle({ opacity: "0" });
    expect(animations).toHaveLength(0);
  });

  describe("ref", () => {
    it("sets an object ref and still reveals the element", () => {
      const ref = createRef<HTMLDivElement>();
      const { unmount } = render(<Reveal keyframes={fade()} ref={ref} />);
      const element = ref.current!;

      expect(element.tagName).toBe("DIV");
      intersect(element, true);
      expect(animations[0]?.element).toBe(element);

      unmount();
      expect(ref.current).toBeNull();
    });

    it("calls a callback ref with the element, then with null", () => {
      const ref = vi.fn();
      const { container, unmount } = render(<Reveal as="section" keyframes={fade()} ref={ref} />);
      const element = container.firstElementChild;

      intersect(element!, true);
      unmount();

      expect(ref.mock.calls).toEqual([[element], [null]]);
      expect(animations[0]?.element).toBe(element);
    });

    it("keeps the same ref callback across renders with the same ref", () => {
      const ref = vi.fn();
      const { rerender } = render(<Reveal keyframes={fade()} ref={ref} className="a" />);
      rerender(<Reveal keyframes={fade()} ref={ref} className="b" />);

      expect(ref).toHaveBeenCalledTimes(1);
    });

    // React 18 does not support cleanup functions from callback refs.
    it.runIf(version.startsWith("19."))("runs the cleanup that a callback ref returns", () => {
      const cleanup = vi.fn();
      const ref = vi.fn(() => cleanup);
      const { container, unmount } = render(<Reveal keyframes={fade()} ref={ref} />);
      const element = container.firstElementChild!;

      unmount();

      expect(ref.mock.calls).toEqual([[element]]);
      expect(cleanup).toHaveBeenCalledOnce();
    });
  });
});
