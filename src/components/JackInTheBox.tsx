import * as React from "react";
import { Reveal, RevealProps } from "../Reveal";

// Animations
import { jackInTheBox } from "../animations/specials";

type JackInTheBoxProps = Omit<RevealProps, "keyframes">;

const JackInTheBox: React.FC<JackInTheBoxProps> = props => {
  return <Reveal keyframes={jackInTheBox} {...props} />;
};

export default JackInTheBox;
