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
        [getSlideAnimationString(direction)]: inView,
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
