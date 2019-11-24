import * as React from 'react';
import { Animated, AnimationString } from 'react-animated-css';
import { useInView } from 'react-intersection-observer';
import { Direction } from '../const';

interface FadeOptions {
  direction?: Direction;
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
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

export const Fade: React.FC<FadeOptions> = ({
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
        animationIn={getFadeInAnimationString(direction)}
        animationOut={getFadeOutAnimationString(direction)}
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
