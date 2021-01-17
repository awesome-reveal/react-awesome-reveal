import * as React from "react";

import Reveal, { RevealProps } from "../Reveal";
import { rollIn, rollOut } from "../animations/specials";

interface RollProps extends Omit<RevealProps, "keyframes"> {
  /**
   * Specifies if the animation should make element(s) disappear.
   * @default false
   */
  reverse?: boolean;
}

function getRollKeyframes(reverse: boolean) {
  return reverse ? rollOut : rollIn;
}

const Roll: React.FC<RollProps> = ({ reverse = false, ...rest }) => {
  return <Reveal keyframes={getRollKeyframes(reverse)} {...rest} />;
};

export default Roll;
