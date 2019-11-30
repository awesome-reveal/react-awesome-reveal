import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const Shake: React.FC<CommonProps> = ({
  children,
  delay,
  duration,
  fraction,
  triggerOnce,
  className,
  style,
}) => (
  <Reveal
    children={children}
    animation="shake"
    delay={delay}
    duration={duration}
    fraction={fraction}
    triggerOnce={triggerOnce}
    className={className}
    style={style}
  />
);
