import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import { hinge } from "../animations/specials";

type HingeProps = Omit<RevealProps, "animation">;

const Hinge: React.FC<HingeProps> = props => {
  return <Reveal animation={hinge} {...props} />;
};

export default Hinge;
