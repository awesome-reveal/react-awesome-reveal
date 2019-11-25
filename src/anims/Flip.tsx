import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps, FlipDirection } from '../const';

interface FlipOptions {
  direction?: FlipDirection;
}

function getFlipAnimationString(direction: FlipDirection): AnimationString {
  switch (direction) {
    case 'vertical':
      return 'flipInX';
    case 'horizontal':
      return 'flipInY';
    default:
      return 'flipInX';
  }
}

export const Flip: React.FC<FlipOptions & CommonProps> = ({
  children,
  direction,
  delay = 0,
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
      className={classNames('animated', className, speed, {
        [getFlipAnimationString(direction)]: inView,
      })}
      style={{
        ...style,
        animationDelay: `${delay}ms`,
        visibility: inView ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  );
};
