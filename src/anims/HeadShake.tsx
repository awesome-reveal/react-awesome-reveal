import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { CommonProps } from '../const';

export const HeadShake: React.FC<CommonProps> = ({
  children,
  delay = 0,
  speed,
  triggerOnce = false,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ triggerOnce });

  return (
    <div
      ref={ref}
      className={classNames('animated', className, speed, {
        headShake: inView,
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
