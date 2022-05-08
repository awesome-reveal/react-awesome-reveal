import { css } from "@emotion/react";

import fadeInLeft from "../animations/fading_entrances/fadeInLeft";

export function getAnimationCss({
  duration = 1000,
  delay = 0,
  timingFunction = "ease",
  keyframes = fadeInLeft,
  iterationCount = 1,
}) {
  return css({
    animationDuration: `${duration}ms`,
    animationTimingFunction: timingFunction,
    animationDelay: `${delay}ms`,
    animationName: keyframes,
    animationDirection: "normal",
    animationFillMode: "both",
    animationIterationCount: iterationCount,
  });
}
