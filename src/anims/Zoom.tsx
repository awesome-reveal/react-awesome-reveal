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
  delay,
  fraction,
  speed,
  triggerOnce = false,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ threshold: fraction, triggerOnce });

  return (
    <div
      ref={ref}
      className={classNames('animated', className, {
        [getZoomAnimationString(direction)]: inView,
        [`delay-${delay}`]: typeof delay === 'string',
        [`${speed}`]: typeof speed === 'string',
      })}
      style={{
        ...style,
        animationDelay: typeof delay === 'number' ? `${delay}ms` : undefined,
        animationDuration: typeof speed === 'number' ? `${speed}ms` : undefined,
        visibility: inView ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  );
};
