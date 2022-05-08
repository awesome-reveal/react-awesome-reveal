import { rollIn, rollOut } from "../animations/specials";
import type { RevealProps } from "../Reveal";
import { Reveal } from "../Reveal";

export interface RollProps extends Omit<RevealProps, "keyframes" | "css"> {
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getRollKeyframes(reverse: boolean) {
  return reverse ? rollOut : rollIn;
}

export const Roll: React.FC<RollProps> = ({
  reverse = false,
  ...otherProps
}) => {
  return <Reveal keyframes={getRollKeyframes(reverse)} {...otherProps} />;
};
