import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps, RotateDirection } from '../const';

interface RotateOptions {
  direction?: RotateDirection;
}

function getRotateAnimationString(direction: RotateDirection): AnimationString {
  switch (direction) {
    case 'top-left':
      return 'rotateInUpLeft';
    case 'top-right':
      return 'rotateInUpRight';
    case 'bottom-left':
      return 'rotateInDownLeft';
    case 'bottom-right':
      return 'rotateInDownRight';
    default:
      return 'rotateIn';
  }
}

export const Rotate: React.FC<RotateOptions & CommonProps> = ({
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
        [getRotateAnimationString(direction)]: inView,
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
