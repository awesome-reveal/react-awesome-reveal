import * as React from "react";
import { Interpolation } from "@emotion/core";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import { hinge } from "../animations/specials";

type HingeProps = Omit<RevealProps, "keyframes">;

const Hinge: React.FC<HingeProps> = ({ css, ...rest }) => {
  const animationCss: Interpolation = { transformOrigin: "top left" };

  return <Reveal keyframes={hinge} css={[css, animationCss]} {...rest} />;
};

export default Hinge;
