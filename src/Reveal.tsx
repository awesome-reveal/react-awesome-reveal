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
  chain = false,
  animation,
  delay = 0,
  duration = 1000,
  fraction = 0,
  triggerOnce = false,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ threshold: fraction, triggerOnce });

  return (
    <div
      ref={ref}
      className={className}
      style={{ visibility: inView ? 'visible' : 'hidden', ...style }}
    >
      {React.Children.map(children, (child, index) => {
        return (
          <div
            className={classNames('animated', {
              [animation]: inView,
            })}
            style={{
              animationDelay: chain ? `${index * duration}ms` : `${delay}ms`,
              animationDuration: `${duration}ms`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
