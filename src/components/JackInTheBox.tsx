import { jackInTheBox } from "../animations/specials";
import Reveal, { RevealProps } from "../Reveal";

export type JackInTheBoxProps = Omit<RevealProps, "keyframes" | "css">;

const JackInTheBox: React.FC<JackInTheBoxProps> = (props) => {
  return <Reveal keyframes={jackInTheBox} {...props} />;
};

export default JackInTheBox;
