import { mount } from "@vue/test-utils";
import { h, nextTick, reactive, ref, version, withDirectives } from "vue";

import { slide } from "../src/keyframes";
import { vReveal } from "../src/vReveal";
import { animations, runningAnimations } from "@awesome-reveal/test-utils/animate";
import { observerOf } from "@awesome-reveal/test-utils/intersection-observer";

import DirectiveBox from "./fixtures/DirectiveBox.vue";
import { intersect } from "./intersect";

function mountBox(options?: object, color?: string) {
  const wrapper = mount(DirectiveBox, {
    props: { options: { keyframes: slide(), ...options }, color },
    attachTo: document.body,
  });
  return { wrapper, element: wrapper.element as HTMLElement };
}

describe(`v-reveal (Vue ${version})`, () => {
  it("hides the element until it enters the viewport", () => {
    const { element } = mountBox();

    expect(element).toHaveStyle({ opacity: "0" });
    expect(element).toHaveAttribute("data-reveal", "hidden");
    expect(animations).toHaveLength(0);
  });

  it("reveals and animates the element when it enters the viewport", async () => {
    const { element } = mountBox();
    await intersect(element, true);

    expect(element.style.opacity).toBe("");
    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations[0]).toMatchObject({
      element,
      keyframes: slide(),
      options: { duration: 600, delay: 0, fill: "backwards" },
    });
  });

  it("plays the default keyframes without a value", async () => {
    const wrapper = mount(DirectiveBox);
    await intersect(wrapper.element, true);

    expect(animations[0]?.keyframes).toEqual(slide());
  });

  it("passes the options to the observer and the animation", async () => {
    const { element } = mountBox({ threshold: 0.5, rootMargin: "10px", delay: 100, stagger: 50 });

    expect(observerOf(element)).toMatchObject({ thresholds: [0.5], rootMargin: "10px" });
    await intersect(element, true);
    expect(animations.map(({ element }) => element.textContent)).toEqual(["a", "b"]);
    expect(animations.map(({ options }) => (options as KeyframeAnimationOptions).delay)).toEqual([
      100, 150,
    ]);
  });

  it("hides the element again when it leaves the viewport and once is false", async () => {
    const { element } = mountBox({ once: false });
    await intersect(element, true);
    await intersect(element, false);

    expect(element).toHaveStyle({ opacity: "0" });
    expect(runningAnimations()).toHaveLength(0);
  });

  it("follows `when` and does not observe the viewport", async () => {
    const { wrapper, element } = mountBox({ when: false });

    expect(observerOf(element)).toBeUndefined();
    expect(element).toHaveStyle({ opacity: "0" });

    await wrapper.setProps({ options: { keyframes: slide(), when: true } });
    expect(element.style.opacity).toBe("");
    expect(animations).toHaveLength(1);
  });

  it("follows a reactive options object that changes in place", async () => {
    const options = reactive({ when: false });
    const wrapper = mount(DirectiveBox, { props: { options }, attachTo: document.body });
    options.when = true;
    await nextTick();

    expect(wrapper.element).not.toHaveAttribute("data-reveal");
    expect(animations).toHaveLength(1);
  });

  it("applies option changes to the next reveal", async () => {
    const { wrapper, element } = mountBox({ duration: 300 });
    await wrapper.setProps({ options: { duration: 400 } });
    await intersect(element, true);

    expect(animations[0]?.options).toMatchObject({ duration: 400 });
  });

  it("keeps the element hidden when a patch replaces its style", async () => {
    const { wrapper, element } = mountBox({}, "red");
    await wrapper.setProps({ color: "blue" });

    expect(element).toHaveStyle({ color: "rgb(0, 0, 255)", opacity: "0" });
  });

  it("starts a new reveal when Vue replaces the element", async () => {
    const tag = ref("div");
    const wrapper = mount(
      { render: () => withDirectives(h(tag.value, { key: tag.value }), [[vReveal, {}]]) },
      { attachTo: document.body },
    );
    await intersect(wrapper.element, true);
    tag.value = "section";
    await nextTick();

    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.element).toHaveAttribute("data-reveal", "hidden");
    expect(observerOf(wrapper.element)).toBeDefined();
  });

  it("stops the observation and the animation on unmount", async () => {
    const { wrapper, element } = mountBox({ once: false });
    await intersect(element, true);
    wrapper.unmount();

    expect(observerOf(element)).toBeUndefined();
    expect(runningAnimations()).toHaveLength(0);
  });
});
