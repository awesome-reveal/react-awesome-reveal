import * as React from 'react';
import { AnimationString, CommonProps, RotateDirection } from '../const';
import { Reveal } from '../Reveal';

interface RotateOptions {
  direction?: RotateDirection;
  reverse?: boolean;
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

function getRotateAnimationString(
  direction: RotateDirection,
  reverse: boolean
): AnimationString {
  return reverse
    ? getRotateOutAnimationString(direction)
    : getRotateInAnimationString(direction);
}

export const Rotate: React.FC<RotateOptions & CommonProps> = ({
  direction,
  reverse = false,
  ...props
}) => (
  <Reveal animation={getRotateAnimationString(direction, reverse)} {...props} />
);
