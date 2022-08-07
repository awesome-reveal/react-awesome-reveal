import { useMemo } from "react";

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

function getStyles(reverse: boolean) {
  return reverse ? rollOut : rollIn;
}

export const Roll: React.FC<RollProps> = (props) => {
  const { reverse = false, ...rest } = props;

  const keyframes = useMemo(() => getStyles(reverse), [reverse]);

  return <Reveal keyframes={keyframes} {...rest} />;
};
