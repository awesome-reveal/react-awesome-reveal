import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const Swing: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animation="swing" {...props} />
);
