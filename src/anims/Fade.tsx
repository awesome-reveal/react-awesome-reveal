import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface FadeOptions {
  direction?: Direction;
}

function getFadeAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'fadeInUp';
    case 'left':
      return 'fadeInLeft';
    case 'bottom':
      return 'fadeInDown';
    case 'right':
      return 'fadeInRight';
    default:
      return 'fadeIn';
  }
}

export const Fade: React.FC<FadeOptions & CommonProps> = ({
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
    animation={getFadeAnimationString(direction)}
    delay={delay}
    fraction={fraction}
    speed={speed}
    triggerOnce={triggerOnce}
    className={className}
    style={style}
  />
);
