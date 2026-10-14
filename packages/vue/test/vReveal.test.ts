import { mount } from "@vue/test-utils";
import { nextTick, reactive, type StyleValue, version } from "vue";

import { defaultKeyframes } from "@awesome-reveal/test-utils/entrance-fixtures";
import { animations, runningAnimations } from "@awesome-reveal/test-utils/animate";
import { observerOf } from "@awesome-reveal/test-utils/intersection-observer";

import DirectiveBox from "./fixtures/DirectiveBox.vue";
import { intersect } from "./intersect";

function mountBox(options?: object, color?: string, style?: StyleValue) {
  const wrapper = mount(DirectiveBox, {
    props: { options: { ...options }, color },
    attrs: { style },
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

    expect(element).toHaveStyle({ opacity: "1" });
    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations[0]).toMatchObject({
      element,
      keyframes: defaultKeyframes,
      options: { duration: 600, delay: 0, fill: "backwards" },
    });
  });

  it("plays the default keyframes without a value", async () => {
    const wrapper = mount(DirectiveBox);
    await intersect(wrapper.element, true);

    expect(animations[0]?.keyframes).toEqual(defaultKeyframes);
  });

  it("passes threshold and duration to core", async () => {
    const { element } = mountBox({ threshold: 0.5, duration: 300 });
    expect(observerOf(element)).toMatchObject({ thresholds: [0.5] });
    await intersect(element, true);
    expect(animations[0]?.options).toMatchObject({ duration: 300 });
  });

  it("follows `when` and does not observe the viewport", async () => {
    const { wrapper, element } = mountBox({ when: false });

    expect(observerOf(element)).toBeUndefined();
    expect(element).toHaveStyle({ opacity: "0" });

    await wrapper.setProps({ options: { keyframes: defaultKeyframes, when: true } });
    expect(element).toHaveStyle({ opacity: "1" });
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

  it.each([
    ["an object", { opacity: 0.5 }, { opacity: 0.8 }],
    ["a string", "opacity: 0.5", "color: red; opacity: 0.8"],
  ])("keeps the latest opacity of %s style binding", async (_, first, second) => {
    const { wrapper, element } = mountBox({}, undefined, first);
    await wrapper.setProps({ style: second });

    expect(element).toHaveStyle({ opacity: "0" });
    expect(element).toHaveAttribute("data-reveal", "hidden");
    await intersect(element, true);
    expect(element.style.opacity).toBe("0.8");
  });

  it("stops the observation and the animation on unmount", async () => {
    const { wrapper, element } = mountBox();
    await intersect(element, true);
    wrapper.unmount();

    expect(observerOf(element)).toBeUndefined();
    expect(runningAnimations()).toHaveLength(0);
  });
});
