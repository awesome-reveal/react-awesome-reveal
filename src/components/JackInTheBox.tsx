import { jackInTheBox } from "../animations/specials/index.js";
import { Reveal, type RevealProps } from "../Reveal.js";

export type JackInTheBoxProps = Omit<RevealProps, "keyframes">;

export const JackInTheBox: React.FC<JackInTheBoxProps> = (props) => {
  return <Reveal keyframes={jackInTheBox} {...props} />;
};
