import { keyframes } from "@emotion/react";

/**
 * @see {@link https://github.com/animate-css/animate.css/blob/master/source/sliding_entrances/slideInUp.css}
 */
export const slideInUp = keyframes`
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`;
