export type AnimationString =
  | 'bounce'
  | 'flash'
  | 'pulse'
  | 'rubberBand'
  | 'shake'
  | 'headShake'
  | 'heartBeat'
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

export interface CommonProps {
  cascade?: boolean;
  damping?: number;
  delay?: number;
  duration?: number;
  fraction?: number;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
