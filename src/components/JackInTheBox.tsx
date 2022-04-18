import { jackInTheBox } from "../animations/specials";
import type { RevealProps } from "../Reveal";
import Reveal from "../Reveal";

export type JackInTheBoxProps = Omit<RevealProps, "keyframes" | "css">;

const JackInTheBox: React.FC<JackInTheBoxProps> = (props) => {
  return <Reveal keyframes={jackInTheBox} {...props} />;
};

export default JackInTheBox;
