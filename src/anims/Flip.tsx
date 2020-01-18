import * as React from 'react';
import { AnimationString, CommonProps, FlipDirection } from '../const';
import { Reveal } from '../Reveal';

interface FlipOptions {
  direction?: FlipDirection;
  reverse?: boolean;
}

function getFlipInAnimationString(direction: FlipDirection): AnimationString {
  switch (direction) {
    case 'vertical':
      return 'flipInX';
    case 'horizontal':
      return 'flipInY';
    default:
      return 'flipInX';
  }
}

function getFlipOutAnimationString(direction: FlipDirection): AnimationString {
  switch (direction) {
    case 'vertical':
      return 'flipOutX';
    case 'horizontal':
      return 'flipOutY';
    default:
      return 'flipOutX';
  }
}

function getFlipAnimationString(
  direction: FlipDirection,
  reverse: boolean
): AnimationString {
  return reverse
    ? getFlipOutAnimationString(direction)
    : getFlipInAnimationString(direction);
}

export const Flip: React.FC<FlipOptions & CommonProps> = ({
  direction,
  reverse = false,
  ...props
}) => (
  <Reveal animation={getFlipAnimationString(direction, reverse)} {...props} />
);
