import { css } from "@emotion/react";

import { hinge } from "../animations/specials";
import type { RevealProps } from "../Reveal";
import { Reveal } from "../Reveal";

export type HingeProps = Omit<RevealProps, "keyframes" | "css">;

const animationCss = css`
  transform-origin: top left;
`;

export const Hinge: React.FC<HingeProps> = (props) => {
  return <Reveal css={animationCss} keyframes={hinge} {...props} />;
};
