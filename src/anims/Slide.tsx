import * as React from 'react';
import { Animated, AnimationString } from 'react-animated-css';
import { useInView } from 'react-intersection-observer';
import { Direction, CommonProps } from '../const';

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
      return 'slideOutUp';
    case 'left':
      return 'slideOutLeft';
    case 'bottom':
      return 'slideOutDown';
    case 'right':
      return 'slideOutRight';
    default:
      return 'slideOutRight';
  }
}

export const Slide: React.FC<SlideOptions & CommonProps> = ({
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
        animationIn={getSlideInAnimationString(direction)}
        animationOut={getSlideOutAnimationString(direction)}
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
