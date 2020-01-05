import * as React from 'react';
import { CommonProps } from '../const';
import { Reveal } from '../Reveal';

export const LightSpeed: React.FC<CommonProps> = ({ ...props }) => (
  <Reveal animationIn="lightSpeedIn" animationOut="lightSpeedOut" {...props} />
);
