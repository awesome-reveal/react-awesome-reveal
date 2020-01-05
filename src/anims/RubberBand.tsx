import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const RubberBand: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animationIn="rubberBand" {...props} />
);
