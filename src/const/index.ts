export type Direction = 'top' | 'left' | 'bottom' | 'right' | undefined;

export type FlipDirection = 'vertical' | 'horizontal' | undefined;

export type RotateDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | undefined;

export interface CommonProps {
  delay?: number;
  duration?: number;
  count?: number | 'infinite';
  className?: string;
  style?: React.CSSProperties;
}
