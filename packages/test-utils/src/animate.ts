import type { Mock } from "vitest";

interface RecordedAnimation {
  element: Element;
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null;
  options: number | KeyframeAnimationOptions | undefined;
  cancel: Mock<() => void>;
  pause: Mock<() => void>;
  play: Mock<() => void>;
  finish: Mock<() => void>;
  playState: AnimationPlayState;
}

export const animations: RecordedAnimation[] = [];

export function runningAnimations(): RecordedAnimation[] {
  return animations.filter((animation) => animation.cancel.mock.calls.length === 0);
}

// jsdom has no Element.animate, so the stub only exists while a test runs.
export function installAnimate() {
  Element.prototype.animate = function (this: Element, keyframes, options) {
    const animation: RecordedAnimation = {
      element: this,
      keyframes,
      options,
      playState: "running",
      cancel: vi.fn(() => void (animation.playState = "idle")),
      pause: vi.fn(() => void (animation.playState = "paused")),
      play: vi.fn(() => void (animation.playState = "running")),
      finish: vi.fn(() => void (animation.playState = "finished")),
    };
    animations.push(animation);
    return animation as unknown as Animation;
  };
}

export function uninstallAnimate() {
  delete (Element.prototype as Partial<Element>).animate;
  animations.length = 0;
}
