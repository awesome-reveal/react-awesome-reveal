import * as React from 'react';
import { Animated, AnimationString } from 'react-animated-css';
import { useInView } from 'react-intersection-observer';
import { Direction } from '../const';

interface ZoomOptions {
  direction?: Direction;
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
}

function getZoomInAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'zoomInUp';
    case 'left':
      return 'zoomInLeft';
    case 'bottom':
      return 'zoomInDown';
    case 'right':
      return 'zoomInRight';
    default:
      return 'zoomIn';
  }
}

function getZoomOutAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'zoomOutUp';
    case 'left':
      return 'zoomOutLeft';
    case 'bottom':
      return 'zoomOutDown';
    case 'right':
      return 'zoomOutRight';
    default:
      return 'zoomOut';
  }
}

export const Zoom: React.FC<ZoomOptions> = ({
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
        animationIn={getZoomInAnimationString(direction)}
        animationOut={getZoomOutAnimationString(direction)}
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
