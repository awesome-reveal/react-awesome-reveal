import { useMemo } from "react";

import { rollIn, rollOut } from "../animations/specials";
import { Reveal, type RevealProps } from "../Reveal";

export interface RollProps extends Omit<RevealProps, "keyframes"> {
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getStyles(reverse: boolean) {
  return reverse ? rollOut : rollIn;
}

export const Roll: React.FC<RollProps> = (props) => {
  const { reverse = false, ...rest } = props;

  const keyframes = useMemo(() => getStyles(reverse), [reverse]);

  return <Reveal keyframes={keyframes} {...rest} />;
};
