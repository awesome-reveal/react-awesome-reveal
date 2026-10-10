import type { CSSProperties } from "react";

import { hinge } from "../animations/specials/index.js";
import { Reveal, type RevealProps } from "../Reveal.js";

export type HingeProps = Omit<RevealProps, "keyframes">;

const animationCss: CSSProperties = {
  transformOrigin: "top left",
};

export const Hinge: React.FC<HingeProps> = (props) => {
  const { style, ...rest } = props;

  return <Reveal keyframes={hinge} style={Object.assign({}, style, animationCss)} {...rest} />;
};
