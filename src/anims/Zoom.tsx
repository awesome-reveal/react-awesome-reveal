import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps, Direction } from '../const';

interface ZoomOptions {
  direction?: Direction;
}

function getZoomAnimationString(direction: Direction): AnimationString {
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

export const Zoom: React.FC<ZoomOptions & CommonProps> = ({
  children,
  direction,
  delay = 0,
  duration = 1000,
  count = 1,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <div
      ref={ref}
      className={classNames('animated', className, {
        [getZoomAnimationString(direction)]: inView,
      })}
      style={{
        ...style,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationIterationCount: count,
        visibility: inView ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  );
};
