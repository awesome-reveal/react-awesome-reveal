import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps, Direction } from '../const';

interface FadeOptions {
  direction?: Direction;
}

function getFadeAnimationString(direction: Direction): AnimationString {
  switch (direction) {
    case 'top':
      return 'fadeInUp';
    case 'left':
      return 'fadeInLeft';
    case 'bottom':
      return 'fadeInDown';
    case 'right':
      return 'fadeInRight';
    default:
      return 'fadeIn';
  }
}

export const Fade: React.FC<FadeOptions & CommonProps> = ({
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
        [getFadeAnimationString(direction)]: inView,
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
