export type AnimationString =
  | 'bounce'
  | 'flash'
  | 'pulse'
  | 'rubberBand'
  | 'shake'
  | 'headShake'
  | 'swing'
  | 'tada'
  | 'wobble'
  | 'jello'
  | 'bounceIn'
  | 'bounceInDown'
  | 'bounceInLeft'
  | 'bounceInRight'
  | 'bounceInUp'
  | 'fadeIn'
  | 'fadeInDown'
  | 'fadeInDownBig'
  | 'fadeInLeft'
  | 'fadeInLeftBig'
  | 'fadeInRight'
  | 'fadeInRightBig'
  | 'fadeInUp'
  | 'fadeInUpBig'
  | 'flipInX'
  | 'flipInY'
  | 'lightSpeedIn'
  | 'rotateIn'
  | 'rotateInDownLeft'
  | 'rotateInDownRight'
  | 'rotateInUpLeft'
  | 'rotateInUpRight'
  | 'hinge'
  | 'jackInTheBox'
  | 'rollIn'
  | 'zoomIn'
  | 'zoomInDown'
  | 'zoomInLeft'
  | 'zoomInRight'
  | 'zoomInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp';

export type Direction = 'top' | 'left' | 'bottom' | 'right' | undefined;

export type FlipDirection = 'vertical' | 'horizontal' | undefined;

export type RotateDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | undefined;

export type Delay = '1s' | '2s' | '3s' | '4s' | '5s' | number | undefined;

export type Speed = 'slower' | 'slow' | 'fast' | 'faster' | number | undefined;

export interface CommonProps {
  delay?: Delay;
  fraction?: number;
  speed?: Speed;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
