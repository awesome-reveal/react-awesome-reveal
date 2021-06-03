import { Interpolation, Theme } from "@emotion/react";

import { hinge } from "../animations/specials";
import Reveal, { RevealProps } from "../Reveal";

type HingeProps = Omit<RevealProps, "keyframes" | "css">;

const Hinge: React.FC<HingeProps> = (props) => {
  const animationCss: Interpolation<Theme> = { transformOrigin: "top left" };

  return <Reveal keyframes={hinge} css={animationCss} {...props} />;
};

export default Hinge;
