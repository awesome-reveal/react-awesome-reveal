import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const Flash: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animationIn="flash" {...props} />
);
