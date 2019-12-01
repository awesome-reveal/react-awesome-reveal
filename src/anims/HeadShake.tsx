import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const HeadShake: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animation="headShake" {...props} />
);
