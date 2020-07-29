import { keyframes } from "@emotion/core";

/**
 * @see {@link https://github.com/animate-css/animate.css/blob/master/source/fading_exits/fadeOutDown.css}
 */
const fadeOutDown = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
`;

export default fadeOutDown;
