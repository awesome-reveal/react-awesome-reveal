type CSSProperty = Exclude<
  {
    [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never;
  }[keyof CSSStyleDeclaration],
  "cssText" | number
>;

/**
 * One keyframe of a Web Animations API animation, with CSS properties in camelCase.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 */
export type RevealKeyframe = {
  offset?: number | null;
  easing?: string;
  composite?: CompositeOperationOrAuto;
} & { [P in CSSProperty]?: string | number | null } & {
  [P in `--${string}`]?: string | number | null;
};

/**
 * A function that returns new keyframes for the given options.
 */
export type KeyframesFactory<Options extends object = Record<string, never>> = (
  options?: Options,
) => RevealKeyframe[];
