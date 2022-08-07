import { keyframes } from "@emotion/react";

/**
 * @see {@link https://github.com/animate-css/animate.css/blob/master/source/rotating_exits/rotateOut.css}
 */
export const rotateOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    transform: rotate3d(0, 0, 1, 200deg);
    opacity: 0;
  }
`;
