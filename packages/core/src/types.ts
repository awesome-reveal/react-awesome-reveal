/** Chooses the side from which the element enters. */
export type Side = "top" | "right" | "bottom" | "left";

/** Sets the complete start state. A number is in pixels for a length and in degrees for a rotation. */
export interface StartState {
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
  rotate?: number | string;
  blur?: number | string;
}

type AnimationOptions =
  | {
      /** Sets the side or the complete start state of the entrance. @default "bottom" */
      from?: Side | StartState;
      keyframes?: never;
    }
  | {
      from?: never;
      /** Replaces the generated entrance with native keyframes. Core ignores `from` when you give `keyframes`. Give explicit values to the first keyframe. */
      keyframes: Keyframe[];
    };

/** Configures the entrance and viewport behavior of a reveal. The entrance plays one time. */
export type RevealOptions = AnimationOptions & {
  /** The duration of the entrance, in milliseconds. @default 600 */
  duration?: number;
  /**
   * The visible fraction of the element, from 0 to 1, that reveals it. An element that leaves the
   * visible area before it reaches the threshold reveals then. @default 0
   */
  threshold?: number;
};

/** Configures the entrance and the delay between direct children. */
export type CascadeOptions = RevealOptions & {
  /** The delay between direct element children, in milliseconds. The child at `index` waits `index * interval`. A negative value starts each later child further into its entrance. @default 80 */
  interval?: number;
};

/** Selects the elements that one `reveal` or `cascade` call animates. */
export type RevealTarget = Element | string | Iterable<Element> | ArrayLike<Element>;

/** Controls the animations and the observers of one call. */
export interface RevealHandle {
  /** Stops the observation and the animations. Each element returns to its resting style. */
  dispose(): void;
}
