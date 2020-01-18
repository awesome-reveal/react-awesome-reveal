import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const Jello: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animation="jello" {...props} />
);
