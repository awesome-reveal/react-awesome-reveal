import * as React from 'react';
import { Animated, AnimationString } from 'react-animated-css';
import { useInView } from 'react-intersection-observer';
import { Direction, CommonProps } from '../const';

interface FadeOptions {
  direction?: Direction;
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
      return 'fadeOutUp';
    case 'left':
      return 'fadeOutLeft';
    case 'bottom':
      return 'fadeOutDown';
    case 'right':
      return 'fadeOutRight';
    default:
      return 'fadeOut';
  }
}

export const Fade: React.FC<FadeOptions & CommonProps> = ({
  children,
  direction,
  delay,
  duration,
  count = 1,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <div ref={ref}>
      <Animated
        animationIn={getFadeInAnimationString(direction)}
        animationOut={getFadeOutAnimationString(direction)}
        animationInDuration={duration}
        animationOutDuration={duration}
        animationInDelay={delay}
        isVisible={inView}
        className={className}
        style={{ ...style, animationIterationCount: count }}
      >
        {children}
      </Animated>
    </div>
  );
};
