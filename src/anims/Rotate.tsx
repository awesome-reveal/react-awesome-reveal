import * as React from 'react';
import { Animated, AnimationString } from 'react-animated-css';
import { useInView } from 'react-intersection-observer';
import { RotateDirection } from '../const';

interface RotateOptions {
  direction?: RotateDirection;
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
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
      return 'rotateOutUpLeft';
    case 'top-right':
      return 'rotateOutUpRight';
    case 'bottom-left':
      return 'rotateOutDownLeft';
    case 'bottom-right':
      return 'rotateOutDownRight';
    default:
      return 'rotateOut';
  }
}

export const Rotate: React.FC<RotateOptions> = ({
  children,
  direction,
  delay,
  duration,
  style,
}) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <div ref={ref}>
      <Animated
        animationIn={getRotateInAnimationString(direction)}
        animationOut={getRotateOutAnimationString(direction)}
        animationInDuration={duration}
        animationOutDuration={duration}
        animationInDelay={delay}
        isVisible={inView}
        style={style}
      >
        {children}
      </Animated>
    </div>
  );
};
