import { defineKeyframes } from "../src/keyframes/define";
import { enter } from "../src/keyframes/enter";
import { blur, fade, scale, slide } from "../src/keyframes/presets";
import type { RevealKeyframe } from "../src/keyframes/types";

const factories: [string, () => RevealKeyframe[]][] = Object.entries({ fade, slide, scale, blur });
const all = factories.map(([name, factory]): [string, RevealKeyframe[]] => [name, factory()]);
const animated = new Set(["opacity", "transform", "filter"]);

test.each(factories)("%s returns new keyframes on each call", (_, factory) => {
  expect(factory()).not.toBe(factory());
  expect(factory()[0]).not.toBe(factory()[0]);
});

describe.each(all)("%s", (_, keyframes) => {
  it("animates only compositor-friendly properties", () => {
    const properties = new Set(keyframes.flatMap(Object.keys));
    properties.delete("easing");

    for (const property of properties) expect(animated).toContain(property);
  });

  // Without its own easing, a WAAPI keyframe eases linearly, unlike CSS keyframes.
  it("eases its first segment and ends at the element's own style", () => {
    expect(keyframes).toHaveLength(2);
    expect(keyframes[0]?.easing).toBeDefined();
    expect(keyframes[1]).toEqual({});
  });
});

describe("enter", () => {
  it("fades from transparent with an ease-out curve by default", () => {
    expect(enter()).toEqual([{ opacity: 0, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }, {}]);
  });

  it.each<[string, Parameters<typeof enter>[0], RevealKeyframe]>([
    ["fades by default", undefined, { opacity: 0 }],
    ["translates numbers in pixels", { x: -24, y: 16 }, { transform: "translate(-24px, 16px)" }],
    ["keeps strings as given", { y: "100%" }, { transform: "translate(0px, 100%)" }],
    ["rotates numbers in degrees", { rotate: -200 }, { transform: "rotate(-200deg)" }],
    [
      "orders translate, scale and rotate",
      { x: "-100%", scale: 0.5, rotate: -120 },
      { transform: "translate(-100%, 0px) scale(0.5) rotate(-120deg)" },
    ],
    ["blurs numbers in pixels", { blur: 8 }, { filter: "blur(8px)" }],
    ["sets the start opacity", { opacity: 1, x: "-100%" }, { opacity: 1 }],
    ["sets the easing", { easing: "linear" }, { easing: "linear" }],
  ])("%s", (_, options, expected) => {
    const [from, to] = enter(options);

    expect(from).toMatchObject(expected);
    expect(to).toEqual({});
  });
});

describe("presets", () => {
  it.each<[string, RevealKeyframe[], RevealKeyframe[]]>([
    ["fade", fade({ easing: "linear" }), enter({ easing: "linear" })],
    ["slide moves up 16px by default", slide(), enter({ y: 16 })],
    ["slide down", slide({ direction: "down" }), enter({ y: -16 })],
    ["slide left", slide({ direction: "left", distance: 24 }), enter({ x: 24 })],
    [
      "slide right with a string distance",
      slide({ direction: "right", distance: "2rem" }),
      enter({ x: "calc(-1 * 2rem)" }),
    ],
    ["slide without a fade", slide({ opacity: 1 }), enter({ y: 16, opacity: 1 })],
    ["scale", scale(), enter({ scale: 0.95 })],
    ["scale from a value", scale({ from: 0.5 }), enter({ scale: 0.5 })],
    ["blur", blur(), enter({ blur: 8 })],
    ["blur by an amount", blur({ amount: "1rem" }), enter({ blur: "1rem" })],
  ])("%s", (_, keyframes, expected) => {
    expect(keyframes).toEqual(expected);
  });
});

describe("defineKeyframes", () => {
  const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
    keyframe: (t, u) => ({ opacity: t, transform: `rotate(${u * turns * 360}deg)` }),
    steps: 4,
  }));

  it("samples the keyframe function from start to end", () => {
    expect(spin({ turns: 2 })).toEqual([
      { opacity: 0, transform: "rotate(720deg)" },
      { opacity: 0.25, transform: "rotate(540deg)" },
      { opacity: 0.5, transform: "rotate(360deg)" },
      { opacity: 0.75, transform: "rotate(180deg)" },
      { opacity: 1, transform: "rotate(0deg)" },
    ]);
  });

  it("passes empty options when it is called without options", () => {
    expect(spin()[0]).toEqual({ opacity: 0, transform: "rotate(360deg)" });
  });

  it("applies the easing to the progress", () => {
    const eased = defineKeyframes(() => ({
      keyframe: (t) => ({ opacity: t }),
      easing: (t) => t * t,
      steps: 2,
    }));

    expect(eased()).toEqual([{ opacity: 0 }, { opacity: 0.25 }, { opacity: 1 }]);
  });

  it("passes the remaining eased progress as the second argument", () => {
    const remaining = defineKeyframes(() => ({
      keyframe: (t, u) => ({ opacity: t + u, offset: u }),
      easing: (t) => t * t,
      steps: 2,
    }));

    expect(remaining()).toEqual([
      { opacity: 1, offset: 1 },
      { opacity: 1, offset: 0.75 },
      { opacity: 1, offset: 0 },
    ]);
  });

  it("takes 30 steps by default", () => {
    expect(defineKeyframes(() => ({ keyframe: (t) => ({ opacity: t }) }))()).toHaveLength(31);
  });
});
