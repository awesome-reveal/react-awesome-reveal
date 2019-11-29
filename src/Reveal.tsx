import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps } from './const';

interface RevealProps extends CommonProps {
  animation: AnimationString;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  animation,
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
        [animation]: inView,
        [`delay-${delay}`]: typeof delay === 'string',
        [`${speed}`]: typeof speed === 'string',
      })}
      style={{
        ...style,
        animationDelay: typeof delay === 'number' ? `${delay}ms` : undefined,
        animationDuration: typeof speed === 'number' ? `${speed}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
};
