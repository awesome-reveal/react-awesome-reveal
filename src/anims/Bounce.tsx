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
        [getBounceAnimationString(direction)]: inView,
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
