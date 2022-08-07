import { keyframes } from "@emotion/react";

/**
 * @see {@link https://github.com/animate-css/animate.css/blob/master/source/flippers/flipOutX.css}
 */
export const flipOutX = keyframes`
  from {
    transform: perspective(400px);
  }

  30% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }

  to {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
`;
