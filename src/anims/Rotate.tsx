import * as React from 'react';
import { AnimationString, CommonProps, RotateDirection } from '../const';
import { Reveal } from '../Reveal';

interface RotateOptions {
  direction?: RotateDirection;
}

function getRotateInAnimationString(
  direction: RotateDirection
): AnimationString {
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

function getRotateOutAnimationString(
  direction: RotateDirection
): AnimationString {
  switch (direction) {
    case 'top-left':
      return 'rotateOutDownRight';
    case 'top-right':
      return 'rotateOutDownLeft';
    case 'bottom-left':
      return 'rotateOutUpRight';
    case 'bottom-right':
      return 'rotateOutUpLeft';
    default:
      return 'rotateOut';
  }
}

export const Rotate: React.FC<RotateOptions & CommonProps> = ({
  direction,
  ...props
}) => (
  <Reveal
    animationIn={getRotateInAnimationString(direction)}
    animationOut={getRotateOutAnimationString(direction)}
    {...props}
  />
);
