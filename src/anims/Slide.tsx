import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps, Direction } from '../const';

interface SlideOptions {
  direction?: Direction;
}

function getSlideAnimationString(direction: Direction): AnimationString {
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

export const Slide: React.FC<SlideOptions & CommonProps> = ({
  children,
  direction,
  delay = 0,
  duration = 1000,
  triggerOnce = false,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ triggerOnce });

  return (
    <div
      ref={ref}
      className={classNames('animated', className, {
        [getSlideAnimationString(direction)]: inView,
      })}
      style={{
        ...style,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        visibility: inView ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  );
};
