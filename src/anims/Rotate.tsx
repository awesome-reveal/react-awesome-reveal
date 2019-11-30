import * as React from 'react';
import { AnimationString, CommonProps, RotateDirection } from '../const';
import { Reveal } from '../Reveal';

interface RotateOptions {
  direction?: RotateDirection;
}

function getRotateAnimationString(direction: RotateDirection): AnimationString {
  switch (direction) {
    case 'top-left':
      return 'rotateInUpLeft';
    case 'top-right':
      return 'rotateInUpRight';
    case 'bottom-left':
      return 'rotateInDownLeft';
    case 'bottom-right':
      return 'rotateInDownRight';
    default:
      return 'rotateIn';
  }
}

export const Rotate: React.FC<RotateOptions & CommonProps> = ({
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
    animation={getRotateAnimationString(direction)}
    delay={delay}
    duration={duration}
    fraction={fraction}
    triggerOnce={triggerOnce}
    className={className}
    style={style}
  />
);
