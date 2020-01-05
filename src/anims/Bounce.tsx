import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface BounceOptions {
  direction?: Direction;
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

export const Bounce: React.FC<BounceOptions & CommonProps> = ({
  direction,
  ...props
}) => (
  <Reveal
    animationIn={getBounceInAnimationString(direction)}
    animationOut={getBounceOutAnimationString(direction)}
    {...props}
  />
);
