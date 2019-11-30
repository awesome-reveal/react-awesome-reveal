import * as React from 'react';
import { AnimationString, CommonProps, FlipDirection } from '../const';
import { Reveal } from '../Reveal';

interface FlipOptions {
  direction?: FlipDirection;
}

function getFlipAnimationString(direction: FlipDirection): AnimationString {
  switch (direction) {
    case 'vertical':
      return 'flipInX';
    case 'horizontal':
      return 'flipInY';
    default:
      return 'flipInX';
  }
}

export const Flip: React.FC<FlipOptions & CommonProps> = ({
  children,
  direction,
  delay,
  duration,
  fraction,
  triggerOnce,
  className,
  style,
}) => (
  <Reveal
    children={children}
    animation={getFlipAnimationString(direction)}
    delay={delay}
    duration={duration}
    fraction={fraction}
    triggerOnce={triggerOnce}
    className={className}
    style={style}
  />
);
