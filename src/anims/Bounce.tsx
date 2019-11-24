import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps, Direction } from '../const';

interface BounceOptions {
  direction?: Direction;
}

function getBounceAnimationString(direction: Direction): AnimationString {
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

export const Bounce: React.FC<BounceOptions & CommonProps> = ({
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
        [getBounceAnimationString(direction)]: inView,
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
