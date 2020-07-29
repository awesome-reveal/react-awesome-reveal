import { keyframes } from "@emotion/core";

/**
 * @see {@link https://github.com/animate-css/animate.css/blob/master/source/fading_exits/fadeOutLeft.css}
 */
const fadeOutLeft = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
`;

export default fadeOutLeft;
