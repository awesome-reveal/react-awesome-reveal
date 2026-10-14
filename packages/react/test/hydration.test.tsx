import { act } from "@testing-library/react";
import { type ReactElement, version } from "react";
import { hydrateRoot, type Root } from "react-dom/client";

import { animations } from "@awesome-reveal/test-utils/animate";

import { intersect } from "./intersect";
import { Cascade, Reveal } from "../src/Reveal";
import { useCascade } from "../src/useCascade";
import { type RevealOptions, useReveal } from "../src/useReveal";

function HookBox(options: RevealOptions) {
  const { getProps } = useReveal<HTMLDivElement>(options);
  return (
    <div {...getProps()}>
      <span>one</span>
    </div>
  );
}

function CascadeHookBox() {
  const { getProps } = useCascade<HTMLUListElement>();
  return (
    <ul {...getProps()}>
      <li>a</li>
      <li>b</li>
    </ul>
  );
}

let root: Root | undefined;

// The server markup is a literal, because React 18 warns when jsdom, which has a document, renders it.
// ssr.test.tsx checks the real server output.
async function hydrate(html: string, tree: ReactElement) {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  await act(async () => {
    root = hydrateRoot(container, tree);
  });
  return container.firstElementChild as HTMLElement;
}

// The setup fails the test on a hydration mismatch warning.
describe(`hydration (React ${version})`, () => {
  afterEach(async () => {
    await act(async () => root?.unmount());
    root = undefined;
    document.body.innerHTML = "";
  });

  it("hydrates Reveal hidden, then reveals it", async () => {
    const element = await hydrate('<div data-reveal="hidden">x</div>', <Reveal>x</Reveal>);

    expect(element).toHaveStyle({ opacity: "0" });
    expect(animations).toHaveLength(0);
    intersect(element, true);
    expect(element).not.toHaveAttribute("data-reveal");
    expect(element).toHaveStyle({ opacity: "1" });
    expect(animations).toHaveLength(1);
  });

  it("hydrates useReveal hidden, then reveals it", async () => {
    const element = await hydrate('<div data-reveal="hidden"><span>one</span></div>', <HookBox />);

    expect(element).toHaveStyle({ opacity: "0" });
    expect(animations).toHaveLength(0);
    intersect(element, true);
    expect(element).not.toHaveAttribute("data-reveal");
    expect(element).toHaveStyle({ opacity: "1" });
    expect(animations).toHaveLength(1);
  });

  it("hydrates Reveal with when hidden, then plays the entrance once", async () => {
    const element = await hydrate('<div data-reveal="hidden">x</div>', <Reveal when>x</Reveal>);

    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations.map((animation) => animation.element)).toEqual([element]);
  });

  it("hydrates useReveal with when hidden, then plays the entrance once", async () => {
    const element = await hydrate(
      '<div data-reveal="hidden"><span>one</span></div>',
      <HookBox when />,
    );

    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations.map((animation) => animation.element)).toEqual([element]);
  });

  const CascadeBox = () => (
    <Cascade as="ul">
      <li>a</li>
      <li>b</li>
    </Cascade>
  );

  it.each([
    ["Cascade", CascadeBox],
    ["useCascade", CascadeHookBox],
  ])("hydrates %s with hidden children, then reveals them in sequence", async (_, Box) => {
    const element = await hydrate('<ul data-reveal="cascade"><li>a</li><li>b</li></ul>', <Box />);
    const children = Array.from(element.children);

    expect(element).toHaveStyle({ opacity: "1" });
    expect(children[0]).toHaveStyle({ opacity: "0" });
    intersect(element, true);
    expect(element).not.toHaveAttribute("data-reveal");
    expect(children[0]).toHaveStyle({ opacity: "1" });
    expect(animations.map((animation) => animation.element)).toEqual(children);
  });
});
