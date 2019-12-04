import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps } from './const';

import './animate.css';

interface RevealProps extends CommonProps {
  animation: AnimationString;
}

export const Reveal: React.FC<RevealProps> = ({
  chain = false,
  animation,
  damping = 0.5,
  delay = 0,
  duration = 1000,
  fraction = 0,
  triggerOnce = false,
  wrapperAs = 'div',
  children,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ threshold: fraction, triggerOnce });

  return React.createElement(
    wrapperAs,
    {
      ref,
      className,
      style: { visibility: inView ? 'visible' : 'hidden', ...style },
    },
    React.Children.map(children, (child, index) => {
      const childElement = child as React.ReactElement;

      const classes = [
        'animated',
        {
          [animation]: inView,
        },
      ];

      const style = {
        animationDelay: chain
          ? `${index * duration * damping}ms`
          : `${delay}ms`,
        animationDuration: `${duration}ms`,
      };

      return typeof childElement === 'string' ? (
        chain ? (
          (childElement as string).split('').map((char, position) => (
            <span
              key={position}
              className={classNames(...classes)}
              style={{
                animationDelay: `${position * duration * damping}ms`,
                animationDuration: `${duration}ms`,
                display: 'inline-block',
                whiteSpace: 'pre',
              }}
            >
              {char}
            </span>
          ))
        ) : (
          <div className={classNames(classes)} style={style}>
            {childElement}
          </div>
        )
      ) : (
        React.cloneElement(childElement, {
          className: classNames(...classes, childElement.props.className),
          style: {
            ...style,
            ...childElement.props.style,
          },
        })
      );
    })
  );
};
