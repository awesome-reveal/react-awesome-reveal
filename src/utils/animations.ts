import { css } from "@emotion/core";

// Animations
import fadeInLeft from "../animations/fading_entrances/fadeInLeft";

export function getAnimationCss({
  duration = 1000,
  delay = 0,
  timingFunction = "ease",
  keyframes = fadeInLeft,
  iterationCount = 1
}) {
  return css`
    animation-duration: ${duration}ms;
    animation-timing-function: ${timingFunction};
    animation-delay: ${delay}ms;
    animation-name: ${keyframes};
    animation-direction: normal;
    animation-fill-mode: both;
    animation-iteration-count: ${iterationCount};
  `;
}
