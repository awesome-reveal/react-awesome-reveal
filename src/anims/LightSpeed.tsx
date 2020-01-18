import * as React from 'react';
import { CommonProps, AnimationString } from '../const';
import { Reveal } from '../Reveal';

interface LightSpeedOptions {
  reverse?: boolean;
}

function getLightSpeedAnimationString(reverse: boolean): AnimationString {
  return reverse ? 'lightSpeedOut' : 'lightSpeedIn';
}

export const LightSpeed: React.FC<LightSpeedOptions & CommonProps> = ({
  reverse = false,
  ...props
}) => <Reveal animation={getLightSpeedAnimationString(reverse)} {...props} />;
