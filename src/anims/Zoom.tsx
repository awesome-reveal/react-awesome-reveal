import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface ZoomOptions {
  direction?: Direction;
}

function getZoomAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'zoomInUp';
    case 'left':
      return 'zoomInLeft';
    case 'bottom':
      return 'zoomInDown';
    case 'right':
      return 'zoomInRight';
    default:
      return 'zoomIn';
  }
}

export const Zoom: React.FC<ZoomOptions & CommonProps> = ({
  children,
  direction,
  delay,
  fraction,
  speed,
  triggerOnce,
  className,
  style,
}) => (
  <Reveal
    children={children}
    animation={getZoomAnimationString(direction)}
    delay={delay}
    fraction={fraction}
    speed={speed}
    triggerOnce={triggerOnce}
    className={className}
    style={style}
  />
);
