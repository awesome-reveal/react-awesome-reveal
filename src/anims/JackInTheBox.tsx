import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const JackInTheBox: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animationIn="jackInTheBox" {...props} />
);
