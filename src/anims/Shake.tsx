import * as React from 'react';
import { Animated } from 'react-animated-css';
import { useInView } from 'react-intersection-observer';

interface ShakeOptions {
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
}

export const Shake: React.FC<ShakeOptions> = ({
  children,
  delay,
  duration,
  style,
}) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <div ref={ref}>
      <Animated
        animationIn="shake"
        animationOut="shake"
        animationInDuration={duration}
        animationOutDuration={duration}
        animationInDelay={delay}
        isVisible={inView}
        style={style}
      >
        {children}
      </Animated>
    </div>
  );
};
