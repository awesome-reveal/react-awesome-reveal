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
  direction,
  ...props
}) => <Reveal animation={getRotateAnimationString(direction)} {...props} />;
