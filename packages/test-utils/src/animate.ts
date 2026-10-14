import type { Mock } from "vitest";

interface RecordedAnimation {
  element: Element;
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null;
  options: number | KeyframeAnimationOptions | undefined;
  cancel: Mock<() => void>;
  pause: Mock<() => void>;
  play: Mock<() => void>;
}

export const animations: RecordedAnimation[] = [];

export function runningAnimations(): RecordedAnimation[] {
  return animations.filter((animation) => animation.cancel.mock.calls.length === 0);
}

// jsdom has no Element.animate, so the stub only exists while a test runs.
export function installAnimate() {
  Element.prototype.animate = function (this: Element, keyframes, options) {
    const cancel = vi.fn();
    const pause = vi.fn();
    const play = vi.fn();
    animations.push({ element: this, keyframes, options, cancel, pause, play });
    return { cancel, pause, play } as unknown as Animation;
  };
}

export function uninstallAnimate() {
  delete (Element.prototype as Partial<Element>).animate;
  animations.length = 0;
}
