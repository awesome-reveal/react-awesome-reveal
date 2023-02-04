import type { CSSProperties } from "react";

import { hinge } from "../animations/specials";
import { Reveal, type RevealProps } from "../Reveal";

export type HingeProps = Omit<RevealProps, "keyframes">;

const animationCss: CSSProperties = {
  transformOrigin: "top left",
};

export const Hinge: React.FC<HingeProps> = (props) => {
  const { style, ...rest } = props;

  return (
    <Reveal
      keyframes={hinge}
      style={Object.assign({}, style, animationCss)}
      {...rest}
    />
  );
};
