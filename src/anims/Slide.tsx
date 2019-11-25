import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface SlideOptions {
  direction?: Direction;
}

function getSlideAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'slideInUp';
    case 'left':
      return 'slideInLeft';
    case 'bottom':
      return 'slideInDown';
    case 'right':
      return 'slideInRight';
    default:
      return 'slideInLeft';
  }
}

export const Slide: React.FC<SlideOptions & CommonProps> = ({
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
    animation={getSlideAnimationString(direction)}
    delay={delay}
    fraction={fraction}
    speed={speed}
    triggerOnce={triggerOnce}
    className={className}
    style={style}
  />
);
