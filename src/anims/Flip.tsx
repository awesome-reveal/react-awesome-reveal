import * as React from 'react';
import { AnimationString, CommonProps, FlipDirection } from '../const';
import { Reveal } from '../Reveal';

interface FlipOptions {
  direction?: FlipDirection;
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

export const Flip: React.FC<FlipOptions & CommonProps> = ({
  direction,
  ...props
}) => (
  <Reveal
    animationIn={getFlipInAnimationString(direction)}
    animationOut={getFlipOutAnimationString(direction)}
    {...props}
  />
);
