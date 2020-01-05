import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const Wobble: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animationIn="wobble" {...props} />
);
