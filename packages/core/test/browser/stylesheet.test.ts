import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createCascade, createReveal, type RevealStore } from "../../src/adapter";
import css from "../../../react/src/reveal.css?raw";
import { settle } from "./helpers";

const opacity = (element: Element) => getComputedStyle(element).opacity;
const hold = (element: Element) =>
  element
    .getAnimations()
    .find((animation) => (animation as CSSAnimation).animationName === "awesome-reveal-hold");

let stores: RevealStore[];

function bind(store: RevealStore, element: HTMLElement, value: string) {
  stores.push(store);
  store.subscribe((revealed) =>
    revealed
      ? element.removeAttribute("data-awesome-reveal")
      : element.setAttribute("data-awesome-reveal", value),
  );
  store.attach(element);
}

beforeEach(() => {
  stores = [];
  document.head.insertAdjacentHTML("beforeend", `<style id="reveal-css">${css}</style>`);
});
afterEach(() => {
  for (const store of stores) store.attach(null);
  document.getElementById("reveal-css")?.remove();
  document.body.innerHTML = "";
});

describe("reveal.css", () => {
  it("hides server markup for a short time, so content that no script attaches shows", () => {
    document.body.innerHTML = `<div id="target" data-awesome-reveal="hidden">a</div>`;
    const target = document.getElementById("target")!;
    expect(opacity(target)).toBe("0");
    hold(target)!.finish();
    expect(opacity(target)).toBe("1");
  });

  it("keeps an attached element hidden after the hold, until it reveals", async () => {
    document.body.innerHTML = `<div id="target" data-awesome-reveal="hidden" style="opacity: 0.5">a</div>`;
    const target = document.getElementById("target")!;
    const store = createReveal({ when: false, duration: 1 });
    bind(store, target, "hidden");
    hold(target)!.finish();
    expect(opacity(target)).toBe("0");
    store.setOptions({ when: true, duration: 1 });
    expect(hold(target)).toBeUndefined();
    await Promise.all(target.getAnimations().map((animation) => animation.finished));
    expect(opacity(target)).toBe("0.5");
  });

  it("shows the element again after a detach and the hold", () => {
    document.body.innerHTML = `<div id="target" data-awesome-reveal="hidden">a</div>`;
    const target = document.getElementById("target")!;
    const store = createReveal({ when: false });
    bind(store, target, "hidden");
    hold(target)!.finish();
    store.attach(null);
    expect(opacity(target)).toBe("1");
  });

  it("keeps a child that renders after the attach hidden in an attached cascade", async () => {
    document.body.innerHTML = `<ul id="list" data-awesome-reveal="cascade"><li>a</li></ul>`;
    const list = document.getElementById("list")!;
    bind(createCascade({ when: false }) as RevealStore, list, "cascade");
    const late = list.appendChild(document.createElement("li"));
    hold(late)!.finish();
    await settle();
    expect(opacity(late)).toBe("0");
  });
});
