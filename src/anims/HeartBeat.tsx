import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const HeartBeat: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animationIn="heartBeat" {...props} />
);
