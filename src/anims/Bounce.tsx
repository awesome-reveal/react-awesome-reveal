import * as React from 'react';
import { AnimationString, CommonProps, Direction } from '../const';
import { Reveal } from '../Reveal';

interface BounceOptions {
  direction?: Direction;
}

function getBounceAnimationString(direction: Direction): AnimationString {
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

export const Bounce: React.FC<BounceOptions & CommonProps> = ({
  direction,
  ...props
}) => <Reveal animation={getBounceAnimationString(direction)} {...props} />;
