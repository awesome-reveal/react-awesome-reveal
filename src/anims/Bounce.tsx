import * as React from 'react';
import { Animated, AnimationString } from 'react-animated-css';
import { useInView } from 'react-intersection-observer';
import { Direction } from 'const';

interface BounceOptions {
  direction?: Direction;
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
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
      return 'bounceOutUp';
    case 'left':
      return 'bounceOutLeft';
    case 'bottom':
      return 'bounceOutDown';
    case 'right':
      return 'bounceOutRight';
    default:
      return 'bounceOut';
  }
}

export const Bounce: React.FC<BounceOptions> = ({
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
        animationIn={getBounceInAnimationString(direction)}
        animationOut={getBounceOutAnimationString(direction)}
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
