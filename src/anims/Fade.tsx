import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface FadeOptions {
  direction?: Direction;
  reverse?: boolean;
}

function getFadeInAnimationString(direction: Direction): AnimationString {
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

function getFadeOutAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'fadeOutDown';
    case 'left':
      return 'fadeOutRight';
    case 'bottom':
      return 'fadeOutUp';
    case 'right':
      return 'fadeOutLeft';
    default:
      return 'fadeOut';
  }
}

function getFadeAnimationString(
  direction: Direction,
  reverse: boolean
): AnimationString {
  return reverse
    ? getFadeOutAnimationString(direction)
    : getFadeInAnimationString(direction);
}

export const Fade: React.FC<FadeOptions & CommonProps> = ({
  direction,
  reverse = false,
  ...props
}) => (
  <Reveal animation={getFadeAnimationString(direction, reverse)} {...props} />
);
