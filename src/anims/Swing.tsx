import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const Swing: React.FC<CommonProps> = ({
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
    animation="swing"
    delay={delay}
    fraction={fraction}
    speed={speed}
    triggerOnce={triggerOnce}
    className={className}
    style={style}
  />
);
