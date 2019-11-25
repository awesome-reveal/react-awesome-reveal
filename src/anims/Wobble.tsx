import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const Wobble: React.FC<CommonProps> = ({
  children,
  delay,
  fraction,
  speed,
  triggerOnce,
  className,
  style,
}) => (
  <Reveal
    children={children}
    animation="wobble"
    delay={delay}
    fraction={fraction}
    speed={speed}
    triggerOnce={triggerOnce}
    className={className}
    style={style}
  />
);
