import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface SlideOptions {
  direction?: Direction;
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

export const Slide: React.FC<SlideOptions & CommonProps> = ({
  direction,
  ...props
}) => (
  <Reveal
    animationIn={getSlideInAnimationString(direction)}
    animationOut={getSlideOutAnimationString(direction)}
    {...props}
  />
);
