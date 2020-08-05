import { keyframes } from "@emotion/core";

/**
 * @see {@link https://github.com/animate-css/animate.css/blob/master/source/rotating_exits/rotateOutDownRight.css}
 */
const rotateOutDownRight = keyframes`
  from {
    opacity: 1;
  }

  to {
    transform: rotate3d(0, 0, 1, -45deg);
    opacity: 0;
  }
`;

export default rotateOutDownRight;
