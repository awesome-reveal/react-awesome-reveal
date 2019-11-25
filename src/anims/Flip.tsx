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
        [getFlipAnimationString(direction)]: inView,
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
