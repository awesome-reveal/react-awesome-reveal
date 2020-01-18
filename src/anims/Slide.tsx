import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface SlideOptions {
  direction?: Direction;
  reverse?: boolean;
}

function getSlideInAnimationString(direction: Direction): AnimationString {
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

function getSlideOutAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'slideOutDown';
    case 'left':
      return 'slideOutRight';
    case 'bottom':
      return 'slideOutUp';
    case 'right':
      return 'slideOutLeft';
    default:
      return 'slideOutRight';
  }
}

function getSlideAnimationString(
  direction: Direction,
  reverse: boolean
): AnimationString {
  return reverse
    ? getSlideOutAnimationString(direction)
    : getSlideInAnimationString(direction);
}

export const Slide: React.FC<SlideOptions & CommonProps> = ({
  direction,
  reverse = false,
  ...props
}) => (
  <Reveal animation={getSlideAnimationString(direction, reverse)} {...props} />
);
