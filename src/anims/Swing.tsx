import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { CommonProps } from '../const';

export const Swing: React.FC<CommonProps> = ({
  children,
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
        swing: inView,
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
