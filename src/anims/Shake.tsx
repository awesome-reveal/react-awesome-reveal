import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const Shake: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animation="shake" {...props} />
);
