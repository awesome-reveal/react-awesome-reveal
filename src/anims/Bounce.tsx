import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface BounceOptions {
  direction?: Direction;
  reverse?: boolean;
}

function getBounceInAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'bounceInUp';
    case 'left':
      return 'bounceInLeft';
    case 'bottom':
      return 'bounceInDown';
    case 'right':
      return 'bounceInRight';
    default:
      return 'bounceIn';
  }
}

function getBounceOutAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'bounceOutDown';
    case 'left':
      return 'bounceOutRight';
    case 'bottom':
      return 'bounceOutUp';
    case 'right':
      return 'bounceOutLeft';
    default:
      return 'bounceOut';
  }
}

function getBounceAnimationString(
  direction: Direction,
  reverse: boolean
): AnimationString {
  return reverse
    ? getBounceOutAnimationString(direction)
    : getBounceInAnimationString(direction);
}

export const Bounce: React.FC<BounceOptions & CommonProps> = ({
  direction,
  reverse = false,
  ...props
}) => (
  <Reveal animation={getBounceAnimationString(direction, reverse)} {...props} />
);
