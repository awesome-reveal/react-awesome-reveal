import * as React from 'react';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationString, CommonProps } from './const';

import './animate.css';

interface RevealProps extends CommonProps {
  animationIn: AnimationString;
  animationOut?: AnimationString;
}

let renderCountBecauseOfWhenChanged = -1;

export const Reveal: React.FC<RevealProps> = ({
  animationIn,
  animationOut,
  cascade = false,
  damping = 0.5,
  delay = 0,
  duration = 1000,
  fraction = 0,
  triggerOnce = false,
  when,
  children,
  className,
  style,
}) => {
  const [ref, inView] = useInView({ threshold: fraction, triggerOnce });

  React.useEffect(() => {
    if (typeof when === 'boolean') {
      renderCountBecauseOfWhenChanged++;
    }
  }, [when]);

  function makeAnimated(nodes: React.ReactNode): React.ReactNode {
    if (!nodes) {
      return null;
    }

    if (typeof nodes === 'string') {
      return makeAnimatedText(nodes);
    }

    return React.Children.map(nodes, (node, index) => {
      const childElement = node as React.ReactElement;

      switch (childElement.type) {
        case 'ol':
        case 'ul':
          return makeAnimated(childElement.props.children);
        default:
          return React.cloneElement(childElement, {
            className: classNames(
              'animated',
              {
                [animationIn]:
                  inView && typeof when === 'boolean'
                    ? renderCountBecauseOfWhenChanged > 0
                    : true,
              },
              { [animationOut || '']: when === false },
              childElement.props.className
            ),
            style: {
              animationDelay: cascade
                ? `${index * duration * damping}ms`
                : `${delay}ms`,
              animationDuration: `${duration}ms`,
              ...childElement.props.style,
            },
          });
      }
    });
  }

  function makeAnimatedText(text: string): React.ReactNode {
    return cascade ? (
      text.split('').map((char, index) => (
        <span
          key={index}
          className={classNames(
            'animated',
            {
              [animationIn]:
                inView && typeof when === 'boolean'
                  ? renderCountBecauseOfWhenChanged > 0
                  : true,
            },
            { [animationOut || '']: when === false }
          )}
          style={{
            animationDelay: `${index * duration * damping}ms`,
            animationDuration: `${duration}ms`,
            display: 'inline-block',
            whiteSpace: 'pre',
          }}
        >
          {char}
        </span>
      ))
    ) : (
      <div
        className={classNames(
          'animated',
          {
            [animationIn]:
              inView && typeof when === 'boolean'
                ? renderCountBecauseOfWhenChanged > 0
                : true,
          },
          { [animationOut || '']: when === false }
        )}
        style={{
          animationDelay: `${delay}ms`,
          animationDuration: `${duration}ms`,
        }}
      >
        {text}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        visibility:
          typeof when === 'boolean' ? 'visible' : inView ? 'visible' : 'hidden',
        ...style,
      }}
    >
      {makeAnimated(children)}
    </div>
  );
};
