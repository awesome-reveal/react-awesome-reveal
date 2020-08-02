import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import { jackInTheBox } from "../animations/specials";

type JackInTheBoxProps = Omit<RevealProps, "animation">;

const JackInTheBox: React.FC<JackInTheBoxProps> = props => {
  return <Reveal animation={jackInTheBox} {...props} />;
};

export default JackInTheBox;
