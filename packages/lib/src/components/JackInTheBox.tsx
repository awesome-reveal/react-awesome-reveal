import { jackInTheBox } from "../animations/specials";
import { type RevealProps, Reveal } from "../Reveal";

export type JackInTheBoxProps = Omit<RevealProps, "keyframes">;

export const JackInTheBox: React.FC<JackInTheBoxProps> = (props) => {
  return <Reveal keyframes={jackInTheBox} {...props} />;
};
