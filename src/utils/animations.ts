import { css } from "@emotion/core";

// Animations
import fadeInUp from "../animations/fading_entrances/fadeInUp";

export function getAnimationCss({
  duration = 1000,
  delay = 0,
  timingFunction = "ease",
  animation = fadeInUp,
  iterationCount = 1
}) {
  return css`
    animation-duration: ${duration}ms;
    animation-timing-function: ${timingFunction};
    animation-delay: ${delay}ms;
    animation-name: ${animation};
    animation-direction: normal;
    animation-fill-mode: both;
    animation-iteration-count: ${iterationCount};
  `;
}
