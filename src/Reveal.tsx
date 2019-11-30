import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps } from './const';

import './animate.css';

interface RevealProps extends CommonProps {
  animation: AnimationString;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  animation,
  delay,
  duration,
  fraction,
  triggerOnce = false,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ threshold: fraction, triggerOnce });

  return (
    <div ref={ref}>
      <div
        className={classNames(
          'animated',
          {
            [animation]: inView,
            [`delay-${delay}`]: typeof delay === 'string',
            [`${duration}`]: typeof duration === 'string',
          },
          className
        )}
        style={{
          animationDelay: typeof delay === 'number' ? `${delay}ms` : undefined,
          animationDuration:
            typeof duration === 'number' ? `${duration}ms` : undefined,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};
