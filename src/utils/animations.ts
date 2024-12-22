import { css, type Keyframes } from "@emotion/react";

import { fadeInLeft } from "../animations/fading_entrances";

export function getAnimationCss({
  duration = 1000,
  delay = 0,
  timingFunction = "ease",
  keyframes = fadeInLeft,
  iterationCount = 1,
}: {
  duration?: number;
  delay?: number;
  timingFunction?: string;
  keyframes?: Keyframes;
  iterationCount?: number;
}) {
  return css`
    animation-duration: ${duration}ms;
    animation-timing-function: ${timingFunction};
    animation-delay: ${delay}ms;
    animation-name: ${keyframes};
    animation-direction: normal;
    animation-fill-mode: both;
    animation-iteration-count: ${iterationCount};

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `;
}
