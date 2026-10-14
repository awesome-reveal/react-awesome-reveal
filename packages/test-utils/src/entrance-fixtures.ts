const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

export const fadeKeyframes: Keyframe[] = [
  { offset: 0, easing, opacity: 0 },
  { offset: 1, composite: "add", opacity: 0 },
];
export const defaultKeyframes: Keyframe[] = [
  { offset: 0, easing, opacity: 0 },
  { offset: 0, composite: "add", translate: "0px 0px" },
  { offset: 1e-6, easing, composite: "add", translate: "0px 24px" },
  { offset: 1, composite: "add", opacity: 0, translate: "0px 0px" },
];
