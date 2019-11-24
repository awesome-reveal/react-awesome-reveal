import * as React from 'react';
import { Animated, AnimationString } from 'react-animated-css';
import { useInView } from 'react-intersection-observer';
import { Direction } from '../const';

interface SlideOptions {
  direction?: Direction;
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
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

export const Slide: React.FC<SlideOptions> = ({
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
        animationIn={getSlideInAnimationString(direction)}
        animationOut={getSlideOutAnimationString(direction)}
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
