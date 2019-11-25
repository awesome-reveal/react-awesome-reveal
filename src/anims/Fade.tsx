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
        [getFadeAnimationString(direction)]: inView,
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
