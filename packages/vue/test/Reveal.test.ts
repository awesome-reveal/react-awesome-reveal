import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, ref, Suspense, version } from "vue";

import { defaultKeyframes } from "@awesome-reveal/test-utils/entrance-fixtures";
import { Reveal } from "../src/Reveal";
import { animations, runningAnimations } from "@awesome-reveal/test-utils/animate";
import { observerOf } from "@awesome-reveal/test-utils/intersection-observer";

import RevealCard from "./fixtures/RevealCard.vue";
import { intersect } from "./intersect";

function mountReveal(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(Reveal, {
    props: { ...props },
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

    expect(element).toHaveStyle({ opacity: "1" });
    expect(element).not.toHaveAttribute("data-reveal");
    expect(animations[0]).toMatchObject({
      element,
      keyframes: defaultKeyframes,
      options: { duration: 600, delay: 0, fill: "backwards" },
    });
  });

  it("starts the animation and removes data-reveal in the task of the report", async () => {
    const { element } = mountReveal();
    let timerRan = false;
    setTimeout(() => (timerRan = true));
    await intersect(element, true);

    expect(timerRan).toBe(false);
    expect(animations).toHaveLength(1);
    expect(element).toHaveStyle({ opacity: "1" });
  });

  it("emits reveal with the element, and gives revealed to its slot", async () => {
    const wrapper = mount(Reveal, {
      props: { once: false },
      slots: { default: ({ revealed }: { revealed: boolean }) => String(revealed) },
      attachTo: document.body,
    });
    const element = wrapper.element as HTMLElement;
    expect(element).toHaveTextContent("false");

    await intersect(element, true);
    expect(element).toHaveTextContent("true");
    expect(wrapper.emitted("reveal")).toEqual([[element]]);
    await intersect(element, false);
    await intersect(element, true);
    expect(wrapper.emitted("reveal")).toHaveLength(2);
    wrapper.unmount();
  });

  it("plays the default keyframes without keyframes", async () => {
    const wrapper = mount(Reveal);
    await intersect(wrapper.element, true);

    expect(animations[0]?.keyframes).toEqual(defaultKeyframes);
  });

  it("passes threshold and duration to core", async () => {
    const { element } = mountReveal({ threshold: 0.5, duration: 300 });
    expect(observerOf(element)).toMatchObject({ thresholds: [0.5] });
    await intersect(element, true);
    expect(animations[0]?.options).toMatchObject({ duration: 300 });
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
    expect(element).toHaveStyle({ opacity: "1" });
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

  it("plays after a pending Suspense resolves, not before", async () => {
    let resolve!: () => void;
    const Slow = defineComponent(async () => {
      await new Promise<void>((done) => (resolve = done));
      return () => h("p");
    });
    mount(
      {
        render: () =>
          h(Suspense, null, { default: () => h("div", [h(Reveal, { when: true }), h(Slow)]) }),
      },
      { attachTo: document.body },
    );
    await flushPromises();
    expect(animations).toHaveLength(0);

    resolve();
    await flushPromises();
    expect(animations).toHaveLength(1);
  });

  it("plays with the latest options when a prop changes while Suspense is pending", async () => {
    let resolve!: () => void;
    const Slow = defineComponent(async () => {
      await new Promise<void>((done) => (resolve = done));
      return () => h("p");
    });
    const duration = ref(100);
    mount(
      {
        render: () =>
          h(Suspense, null, {
            default: () => h("div", [h(Reveal, { when: true, duration: duration.value }), h(Slow)]),
          }),
      },
      { attachTo: document.body },
    );
    await flushPromises();
    duration.value = 900;
    await flushPromises();
    resolve();
    await flushPromises();

    expect(animations).toHaveLength(1);
    expect(animations[0]?.options).toMatchObject({ duration: 900 });
  });

  it("keeps the given style, which shows its opacity after the reveal", async () => {
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
    expect(animations[0]?.keyframes).toEqual(defaultKeyframes);
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

    expect(element).toHaveStyle({ opacity: "1" });
    expect(animations).toHaveLength(1);
  });
});
