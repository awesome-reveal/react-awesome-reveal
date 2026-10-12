import { act } from "@testing-library/react";
import { type ReactElement, version } from "react";
import { hydrateRoot, type Root } from "react-dom/client";

import { animations } from "@awesome-reveal/test-utils/animate";

import { intersect } from "./intersect";
import { Reveal } from "../src/Reveal";
import { type RevealOptions, useReveal } from "../src/useReveal";

function HookBox(options: RevealOptions) {
  const { ref, style } = useReveal<HTMLDivElement>(options);
  return (
    <div ref={ref} style={style}>
      <span>one</span>
    </div>
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
    const element = await hydrate(
      '<div style="opacity:0" data-reveal="hidden">x</div>',
      <Reveal>x</Reveal>,
    );

    expect(element).toHaveStyle({ opacity: "0" });
    expect(animations).toHaveLength(0);
    intersect(element, true);
    expect(element.style.opacity).toBe("");
    expect(animations).toHaveLength(1);
  });

  it("hydrates useReveal hidden, then reveals it", async () => {
    const element = await hydrate('<div style="opacity:0"><span>one</span></div>', <HookBox />);

    expect(element).toHaveStyle({ opacity: "0" });
    expect(animations).toHaveLength(0);
    intersect(element, true);
    expect(element.style.opacity).toBe("");
    expect(animations).toHaveLength(1);
  });

  it("hydrates Reveal with when and plays the entrance once", async () => {
    const element = await hydrate("<div>x</div>", <Reveal when>x</Reveal>);

    expect(animations.map((animation) => animation.element)).toEqual([element]);
  });

  it("hydrates useReveal with when and plays the entrance once", async () => {
    const element = await hydrate("<div><span>one</span></div>", <HookBox when />);

    expect(animations.map((animation) => animation.element)).toEqual([element]);
  });
});
