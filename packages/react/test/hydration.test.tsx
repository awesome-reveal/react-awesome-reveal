import { act } from "@testing-library/react";
import { type ReactElement, version } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";

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

async function hydrate(tree: ReactElement) {
  const container = document.createElement("div");
  container.innerHTML = renderToString(tree);
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

  it.each([
    ["Reveal", () => <Reveal>x</Reveal>],
    ["useReveal", () => <HookBox />],
  ])("hydrates %s hidden, then reveals it", async (_name, tree) => {
    const element = await hydrate(tree());

    expect(element).toHaveStyle({ opacity: "0" });
    expect(animations).toHaveLength(0);
    intersect(element, true);
    expect(element.style.opacity).toBe("");
    expect(animations).toHaveLength(1);
  });

  it.each([
    ["Reveal", () => <Reveal when>x</Reveal>],
    ["useReveal", () => <HookBox when />],
  ])("hydrates %s with when and plays the entrance once", async (_name, tree) => {
    const element = await hydrate(tree());

    expect(element.style.opacity).toBe("");
    expect(animations.map((animation) => animation.element)).toEqual([element]);
  });
});
