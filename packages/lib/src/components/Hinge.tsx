import type { Interpolation, Theme } from "@emotion/react";

import { hinge } from "../animations/specials";
import type { RevealProps } from "../Reveal";
import { Reveal } from "../Reveal";

export type HingeProps = Omit<RevealProps, "keyframes" | "css">;

export const Hinge: React.FC<HingeProps> = (props) => {
  const animationCss: Interpolation<Theme> = { transformOrigin: "top left" };

  return <Reveal keyframes={hinge} css={animationCss} {...props} />;
};
