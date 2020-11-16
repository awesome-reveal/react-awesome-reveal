import { keyframes } from "@emotion/react";

/**
 * @see {@link https://github.com/animate-css/animate.css/blob/master/source/sliding_entrances/slideInLeft.css}
 */
const slideInLeft = keyframes`
  from {
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`;

export default slideInLeft;
