import { mount } from "@vue/test-utils";
import { h, version } from "vue";

import { fade, slide } from "../src/keyframes";
import { Reveal } from "../src/Reveal";
import { animations, runningAnimations } from "@awesome-reveal/test-utils/animate";
import { observerOf } from "@awesome-reveal/test-utils/intersection-observer";

import RevealCard from "./fixtures/RevealCard.vue";
import { intersect } from "./intersect";

function mountReveal(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(Reveal, {
    props: { keyframes: fade(), ...props },
    attrs,
    slots: { default: () => [h("span", "one"), h("span", "two")] },
    // jsdom does not update the computed style of a detached element.
    attachTo: document.body,
  });
  return { wrapper, element: wrapper.element as HTMLElement };
}

describe(`Reveal (Vue ${version})`, () => {
  it("renders one hidden div around its slot", () => {
    const { element } = mountReveal();

    expect(element.tagName).toBe("DIV");
    expect(element).toHaveTextContent("onetwo");
    expect(element).toHaveStyle({ opacity: "0" });
    expect(element).toHaveAttribute("data-reveal", "hidden");
  });

  it("reveals and animates when it enters the viewport", async () => {
    const { element } = mountReveal();
    await intersect(element, true);

    expect(element.style.opacity).toBe("");
    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations[0]).toMatchObject({
      element,
      keyframes: fade(),
      options: { duration: 600, delay: 0, fill: "backwards" },
    });
  });

  it("starts the animation after the patch that removes the hidden style", async () => {
    const opacities: string[] = [];
    const animate = Element.prototype.animate;
    vi.spyOn(Element.prototype, "animate").mockImplementation(function (
      this: HTMLElement,
      ...args
    ) {
      opacities.push(this.style.opacity);
      return animate.apply(this, args);
    });
    const { element } = mountReveal();
    await intersect(element, true);

    expect(opacities).toEqual([""]);
  });

  it("plays the default keyframes without keyframes", async () => {
    const wrapper = mount(Reveal);
    await intersect(wrapper.element, true);

    expect(animations[0]?.keyframes).toEqual(slide());
  });

  it("passes the options to the observer and the animation", async () => {
    const { element } = mountReveal({
      threshold: 0.5,
      rootMargin: "10px",
      duration: 300,
      stagger: 50,
    });

    expect(observerOf(element)).toMatchObject({ thresholds: [0.5], rootMargin: "10px" });
    await intersect(element, true);
    expect(animations.map(({ element }) => element.textContent)).toEqual(["one", "two"]);
    expect(animations[1]?.options).toEqual({ duration: 300, delay: 50, fill: "backwards" });
  });

  it("stays revealed without once, because an absent Boolean prop is not false", async () => {
    const { element } = mountReveal();
    await intersect(element, true);

    expect(observerOf(element)).toBeUndefined();
  });

  it("hides the element again when it leaves the viewport and once is false", async () => {
    const { element } = mountReveal({ once: false });
    await intersect(element, true);
    await intersect(element, false);

    expect(element).toHaveStyle({ opacity: "0" });
    expect(runningAnimations()).toHaveLength(0);

    await intersect(element, true);
    expect(animations).toHaveLength(2);
  });

  it("follows `when` and does not observe the viewport", async () => {
    const { wrapper, element } = mountReveal({ when: false });

    expect(observerOf(element)).toBeUndefined();
    expect(element).toHaveStyle({ opacity: "0" });

    await wrapper.setProps({ when: true });
    expect(element.style.opacity).toBe("");
    expect(animations).toHaveLength(1);
  });

  it("applies option changes to the next reveal without replaying", async () => {
    const { wrapper, element } = mountReveal({ once: false, duration: 300 });
    await intersect(element, true);
    await wrapper.setProps({ duration: 400 });

    expect(animations).toHaveLength(1);

    await intersect(element, false);
    await intersect(element, true);
    expect(animations[1]?.options).toMatchObject({ duration: 400 });
  });

  it("renders the tag given by `as` and passes attributes through", () => {
    const { element } = mountReveal({ as: "a" }, { href: "/docs", class: "link" });

    expect(element.tagName).toBe("A");
    expect(element).toHaveAttribute("href", "/docs");
    expect(element).toHaveClass("link", { exact: true });
  });

  it("does not replay the animation when `as` changes after the reveal", async () => {
    const { wrapper, element } = mountReveal();
    await intersect(element, true);
    await wrapper.setProps({ as: "section" });

    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.element).not.toHaveAttribute("data-reveal");
    expect(animations).toHaveLength(1);
  });

  it("merges the hidden style into the given style and restores it when revealed", async () => {
    const { element } = mountReveal({}, { style: { color: "red", opacity: 0.5 } });

    expect(element).toHaveStyle({ color: "rgb(255, 0, 0)", opacity: "0" });

    await intersect(element, true);
    expect(element).toHaveStyle({ color: "rgb(255, 0, 0)", opacity: "0.5" });
  });

  it("works in a template", async () => {
    const wrapper = mount(RevealCard);
    const element = wrapper.get("section").element;
    await intersect(element, true);

    expect(element).toHaveStyle({ color: "rgb(255, 0, 0)" });
    expect(animations[0]?.keyframes).toEqual(slide());
  });

  it("stops the observation and the animation on unmount", async () => {
    const { wrapper, element } = mountReveal({ once: false });
    await intersect(element, true);
    wrapper.unmount();

    expect(observerOf(element)).toBeUndefined();
    expect(runningAnimations()).toHaveLength(0);
  });

  it("reveals at once without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { element } = mountReveal();
    await Promise.resolve();

    expect(element.style.opacity).toBe("");
    expect(animations).toHaveLength(1);
  });
});
