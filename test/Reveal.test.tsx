import { keyframes } from "@emotion/react";
import { render, screen } from "@testing-library/react";
import { Fragment, type ReactNode, version } from "react";
import {
  intersectionMockInstance,
  mockAllIsIntersecting,
} from "react-intersection-observer/test-utils";

import { fadeInLeft } from "../src/animations/fading_entrances";
import { Reveal } from "../src/Reveal";
import { classesOf, renderInView, wrapperOf } from "./helpers";

const customKeyframes = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// One entry for each code path that creates its own observer.
const observedChildren: [string, ReactNode, () => HTMLElement][] = [
  ["an element", <p>child</p>, () => wrapperOf("child")],
  [
    "a fragment",
    <>
      <p>child</p>
    </>,
    () => wrapperOf("child"),
  ],
  ["text", "child", () => screen.getByText("child")],
  [
    "an li",
    <ul>
      <li>child</li>
    </ul>,
    () => screen.getByText("child"),
  ],
];

describe(`Reveal (React ${version})`, () => {
  describe("children", () => {
    it.each([
      ["null", null],
      ["undefined", undefined],
    ])("renders nothing for %s children", (_, children) => {
      const { container } = render(<Reveal>{children}</Reveal>);

      expect(container).toBeEmptyDOMElement();
    });

    // `false` from `{condition && <Child />}` is rendered as the text "false".
    it.fails("renders nothing for boolean children", () => {
      const { container } = render(<Reveal>{false}</Reveal>);

      expect(container).toBeEmptyDOMElement();
    });

    it("wraps a string in one hidden container", () => {
      const { container } = render(<Reveal>hello</Reveal>);

      const wrapper = container.firstElementChild as HTMLElement;
      expect(container.children).toHaveLength(1);
      expect(wrapper).toHaveTextContent("hello");
      expect(wrapper).toHaveStyle({ opacity: "0" });
    });

    it("renders a number as text", () => {
      const { container } = render(<Reveal>{42}</Reveal>);

      expect(container.firstElementChild).toHaveTextContent("42");
    });

    it("wraps a fragment in one hidden container", () => {
      const { container } = render(
        <Reveal>
          <Fragment>
            <p>one</p>
            <p>two</p>
          </Fragment>
        </Reveal>,
      );

      const wrapper = container.firstElementChild as HTMLElement;
      expect(container.children).toHaveLength(1);
      expect(wrapper).toContainElement(screen.getByText("one"));
      expect(wrapper).toContainElement(screen.getByText("two"));
      expect(wrapper).toHaveStyle({ opacity: "0" });
    });

    it("wraps each element in its own container", () => {
      const { container } = render(
        <Reveal>
          <p>one</p>
          <span>two</span>
        </Reveal>,
      );

      expect(container.children).toHaveLength(2);
      expect(container.children[0]).toContainElement(screen.getByText("one"));
      expect(container.children[1]).toContainElement(screen.getByText("two"));
    });

    it("drops text nodes that are mixed with elements", () => {
      const { container } = render(
        <Reveal>
          <p>element</p>
          text
        </Reveal>,
      );

      expect(container.children).toHaveLength(1);
      expect(container).not.toHaveTextContent("text");
    });

    it("keeps the props of element children", () => {
      render(
        <Reveal>
          <a href="/target" title="link">
            link
          </a>
        </Reveal>,
      );

      expect(screen.getByText("link")).toHaveAttribute("href", "/target");
      expect(screen.getByText("link")).toHaveAttribute("title", "link");
    });

    // cx(undefined, undefined) returns "", so React writes class="".
    it.fails("does not add an empty class attribute to children", () => {
      render(
        <Reveal>
          <p>child</p>
        </Reveal>,
      );

      expect(screen.getByText("child")).not.toHaveAttribute("class");
    });

    it.each(["ul", "ol"] as const)("animates each li of a %s, not the list", (List) => {
      render(
        <Reveal>
          <List>
            <li>one</li>
            <li>two</li>
          </List>
        </Reveal>,
      );

      const list = screen.getByRole("list");
      const items = screen.getAllByRole("listitem");
      expect(list.tagName).toBe(List.toUpperCase());
      expect(list).not.toHaveStyle({ opacity: "0" });
      expect(items.map((item) => item.parentElement)).toEqual([list, list]);
      for (const item of items) expect(item).toHaveStyle({ opacity: "0" });

      mockAllIsIntersecting(true);

      for (const item of items) {
        expect(item).not.toHaveStyle({ opacity: "0" });
        expect(item).toHaveStyle({ animationName: fadeInLeft.name });
      }
      expect(list).toHaveStyle({ animationName: "none" });
    });
  });

  describe("visibility", () => {
    it("hides elements before they are in view, then animates them", () => {
      render(
        <Reveal>
          <p>child</p>
        </Reveal>,
      );
      const wrapper = wrapperOf("child");

      expect(wrapper).toHaveStyle({ opacity: "0" });
      expect(wrapper).toHaveStyle({ animationName: "none" });

      mockAllIsIntersecting(true);

      expect(wrapper).not.toHaveStyle({ opacity: "0" });
      expect(wrapper).toHaveStyle({ animationName: fadeInLeft.name });
    });

    it("hides elements again when they leave the viewport", () => {
      render(
        <Reveal>
          <p>child</p>
        </Reveal>,
      );
      const wrapper = wrapperOf("child");

      mockAllIsIntersecting(true);
      mockAllIsIntersecting(false);

      expect(wrapper).toHaveStyle({ opacity: "0" });
      expect(wrapper).toHaveStyle({ animationName: "none" });
    });

    it("uses custom keyframes", () => {
      const wrapper = renderInView(
        <Reveal keyframes={customKeyframes}>
          <p>child</p>
        </Reveal>,
      );

      expect(wrapper).toHaveStyle({ animationName: customKeyframes.name });
    });

    it("animates every character of cascaded text when in view", () => {
      const { container } = render(<Reveal cascade>ab</Reveal>);
      const spans = [...container.querySelectorAll("span")];

      for (const span of spans) expect(span).toHaveStyle({ animationName: "none" });

      mockAllIsIntersecting(true);

      for (const span of spans) expect(span).toHaveStyle({ animationName: fadeInLeft.name });
    });

    // Only the spans get the animation, so the text shows until it enters the viewport.
    it.fails("hides cascaded text before it is in view", () => {
      const { container } = render(<Reveal cascade>ab</Reveal>);

      expect(container.firstElementChild).toHaveStyle({ opacity: "0" });
    });
  });

  describe("timing", () => {
    it("sets the duration and the default timing rules", () => {
      const wrapper = renderInView(
        <Reveal duration={400}>
          <p>child</p>
        </Reveal>,
      );

      expect(wrapper).toHaveStyle({
        animationDuration: "400ms",
        animationTimingFunction: "ease",
        animationFillMode: "both",
        animationIterationCount: "1",
      });
    });

    it("uses a duration of 1000ms by default", () => {
      const wrapper = renderInView(
        <Reveal>
          <p>child</p>
        </Reveal>,
      );

      expect(wrapper).toHaveStyle({ animationDuration: "1000ms" });
    });

    it("gives every element the same delay without cascade", () => {
      render(
        <Reveal delay={150}>
          <p>a</p>
          <p>b</p>
        </Reveal>,
      );

      expect(["a", "b"].map((text) => wrapperOf(text).style.animationDelay)).toEqual([
        "150ms",
        "150ms",
      ]);
    });

    it("staggers elements with cascade, delay, duration and damping", () => {
      render(
        <Reveal cascade delay={100} duration={400} damping={0.25}>
          <p>a</p>
          <p>b</p>
          <p>c</p>
        </Reveal>,
      );

      expect(["a", "b", "c"].map((text) => wrapperOf(text).style.animationDelay)).toEqual([
        "100ms",
        "200ms",
        "300ms",
      ]);
    });

    it("uses a damping of 0.5 by default", () => {
      render(
        <Reveal cascade>
          <p>a</p>
          <p>b</p>
        </Reveal>,
      );

      expect(wrapperOf("b").style.animationDelay).toBe("500ms");
    });

    it("splits cascaded text into one span per character with staggered delays", () => {
      const { container } = render(
        <Reveal cascade delay={50} duration={100} damping={1}>
          {"a c"}
        </Reveal>,
      );

      const wrapper = container.firstElementChild as HTMLElement;
      const spans = [...wrapper.querySelectorAll("span")];
      expect(wrapper).toHaveStyle({ display: "inline-block", whiteSpace: "pre" });
      expect(spans.map((span) => span.textContent)).toEqual(["a", " ", "c"]);
      expect(spans.map((span) => span.style.animationDelay)).toEqual(["50ms", "150ms", "250ms"]);
    });

    it("staggers li elements with cascade", () => {
      render(
        <Reveal cascade delay={10} duration={100} damping={0.5}>
          <ul>
            <li>a</li>
            <li>b</li>
          </ul>
        </Reveal>,
      );

      expect(screen.getAllByRole("listitem").map((item) => item.style.animationDelay)).toEqual([
        "10ms",
        "60ms",
      ]);
    });
  });

  describe("observer options", () => {
    it.each(observedChildren)(
      "passes fraction to the observer of %s as threshold",
      (_, children, getObserved) => {
        render(<Reveal fraction={0.5}>{children}</Reveal>);

        expect(intersectionMockInstance(getObserved()).thresholds).toEqual([0.5]);
      },
    );

    it("passes fraction to the observer of cascaded text as threshold", () => {
      render(
        <Reveal cascade fraction={0.5}>
          ab
        </Reveal>,
      );

      expect(intersectionMockInstance(wrapperOf("a")).thresholds).toEqual([0.5]);
    });

    it("uses a threshold of 0 by default", () => {
      render(
        <Reveal>
          <p>child</p>
        </Reveal>,
      );

      expect(intersectionMockInstance(wrapperOf("child")).thresholds).toEqual([0]);
    });

    it("shows the element only when the visible ratio reaches fraction", () => {
      render(
        <Reveal fraction={0.5}>
          <p>child</p>
        </Reveal>,
      );
      const wrapper = wrapperOf("child");

      mockAllIsIntersecting(0.25);
      expect(wrapper).toHaveStyle({ opacity: "0" });

      mockAllIsIntersecting(0.5);
      expect(wrapper).not.toHaveStyle({ opacity: "0" });
    });

    it.each(observedChildren)(
      "keeps %s visible after it leaves the viewport with triggerOnce",
      (_, children, getObserved) => {
        render(<Reveal triggerOnce>{children}</Reveal>);

        mockAllIsIntersecting(true);
        mockAllIsIntersecting(false);

        expect(getObserved()).not.toHaveStyle({ opacity: "0" });
        expect(getObserved()).toHaveStyle({ animationName: fadeInLeft.name });
      },
    );

    it("keeps cascaded text animated after it leaves the viewport with triggerOnce", () => {
      render(
        <Reveal cascade triggerOnce>
          ab
        </Reveal>,
      );

      mockAllIsIntersecting(true);
      mockAllIsIntersecting(false);

      expect(screen.getByText("a")).toHaveStyle({ animationName: fadeInLeft.name });
    });
  });

  describe("class names and styles", () => {
    it("merges className, style, childClassName and childStyle for elements", () => {
      render(
        <Reveal
          className="container"
          style={{ padding: "1px", opacity: 0.5 }}
          childClassName="child"
          childStyle={{ color: "rgb(255, 0, 0)", margin: "1px" }}
        >
          <p className="own" style={{ margin: "2px" }}>
            child
          </p>
        </Reveal>,
      );
      const child = screen.getByText("child");
      const wrapper = child.parentElement!;

      expect(classesOf(wrapper)).toEqual(["container"]);
      expect(wrapper).toHaveStyle({ padding: "1px", opacity: "0" });
      expect(classesOf(child)).toEqual(["child", "own"]);
      expect(child).toHaveStyle({ color: "rgb(255, 0, 0)", margin: "2px" });

      mockAllIsIntersecting(true);

      expect(wrapper).toHaveStyle({ opacity: "0.5" });
      expect(wrapper.className).toMatch(/^container css-/);
    });

    it("applies className and style to the container of text and fragments", () => {
      render(
        <>
          <Reveal className="text" style={{ padding: "1px" }}>
            text
          </Reveal>
          <Reveal className="fragment" style={{ padding: "2px" }}>
            <>
              <p>fragment</p>
            </>
          </Reveal>
          <Reveal cascade className="cascade" style={{ padding: "3px", display: "block" }}>
            ab
          </Reveal>
        </>,
      );

      expect(screen.getByText("text")).toHaveClass("text");
      expect(screen.getByText("text")).toHaveStyle({ padding: "1px" });
      expect(wrapperOf("fragment")).toHaveClass("fragment");
      expect(wrapperOf("fragment")).toHaveStyle({ padding: "2px" });
      expect(classesOf(wrapperOf("a"))).toEqual(["cascade"]);
      expect(wrapperOf("a")).toHaveStyle({ padding: "3px", display: "inline-block" });
    });

    it("merges className and style into lists, and childClassName and childStyle into li", () => {
      render(
        <Reveal
          className="container"
          style={{ padding: "1px" }}
          childClassName="child"
          childStyle={{ color: "rgb(255, 0, 0)", margin: "1px" }}
        >
          <ul className="list" style={{ margin: "0px" }}>
            <li>a</li>
            <li className="own" style={{ margin: "2px" }}>
              b
            </li>
          </ul>
        </Reveal>,
      );
      const list = screen.getByRole("list");
      const [first, second] = screen.getAllByRole("listitem");

      expect(classesOf(list)).toEqual(["container", "list"]);
      expect(list).toHaveStyle({ padding: "1px", margin: "0px" });
      expect(classesOf(first)).toEqual(["child"]);
      expect(first).toHaveStyle({ color: "rgb(255, 0, 0)", margin: "1px", opacity: "0" });
      expect(classesOf(second)).toEqual(["child", "own"]);
      expect(second).toHaveStyle({ color: "rgb(255, 0, 0)", margin: "2px" });
    });
  });

  describe("onVisibilityChange", () => {
    it.each(observedChildren)(
      "reports enter and leave changes of %s with the entry",
      (_, children) => {
        const onVisibilityChange = vi.fn();
        render(<Reveal onVisibilityChange={onVisibilityChange}>{children}</Reveal>);

        mockAllIsIntersecting(false);
        expect(onVisibilityChange).not.toHaveBeenCalled();

        mockAllIsIntersecting(true);
        mockAllIsIntersecting(false);

        expect(onVisibilityChange).toHaveBeenCalledTimes(2);
        expect(onVisibilityChange).toHaveBeenNthCalledWith(
          1,
          true,
          expect.objectContaining({ isIntersecting: true }),
        );
        expect(onVisibilityChange).toHaveBeenNthCalledWith(
          2,
          false,
          expect.objectContaining({ isIntersecting: false }),
        );
      },
    );

    it("is called once for each animated element", () => {
      const onVisibilityChange = vi.fn();
      render(
        <Reveal onVisibilityChange={onVisibilityChange}>
          <p>a</p>
          <p>b</p>
        </Reveal>,
      );

      mockAllIsIntersecting(true);

      expect(onVisibilityChange).toHaveBeenCalledTimes(2);
    });
  });

  it("disables the animation when the user prefers reduced motion", () => {
    const wrapper = renderInView(
      <Reveal>
        <p>child</p>
      </Reveal>,
    );
    const emotionClass = [...wrapper.classList].find((name) => name.startsWith("css-"));
    // jsdom does not evaluate media queries, so check the rule Emotion injected.
    const css = [...document.querySelectorAll("style")].map((style) => style.textContent).join("");

    expect(css).toMatch(
      new RegExp(
        `@media \\(prefers-reduced-motion: reduce\\)\\{\\.${emotionClass}\\{[^}]*animation:none;\\}\\}`,
      ),
    );
  });
});
