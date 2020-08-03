import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import { hinge } from "../animations/specials";

type HingeProps = Omit<RevealProps, "keyframes">;

const Hinge: React.FC<HingeProps> = props => {
  return <Reveal keyframes={hinge} {...props} />;
};

export default Hinge;
