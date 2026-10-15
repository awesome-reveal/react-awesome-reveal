import type { Mock } from "vitest";

interface RecordedAnimation {
  element: Element;
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null;
  options: number | KeyframeAnimationOptions | undefined;
  cancel: Mock<() => void>;
  pause: Mock<() => void>;
  play: Mock<() => void>;
  finish: Mock<() => void>;
  effect: { updateTiming: Mock<(timing: OptionalEffectTiming) => void> };
  playState: AnimationPlayState;
  finished: Promise<void>;
}

export const animations: RecordedAnimation[] = [];

export function runningAnimations(): RecordedAnimation[] {
  return animations.filter((animation) => animation.cancel.mock.calls.length === 0);
}

// jsdom has no Element.animate, so the stub only exists while a test runs.
export function installAnimate() {
  Element.prototype.animate = function (this: Element, keyframes, options) {
    let resolve!: () => void, reject!: (reason: unknown) => void;
    const finished = new Promise<void>((...settle) => ([resolve, reject] = settle));
    // The browser marks the promise as handled, so a cancel with no listener is not an unhandled rejection.
    finished.catch(() => {});
    const animation: RecordedAnimation = {
      element: this,
      keyframes,
      options,
      playState: "running",
      finished,
      cancel: vi.fn(() => {
        if (animation.playState !== "idle") reject(new DOMException("", "AbortError"));
        animation.playState = "idle";
      }),
      pause: vi.fn(() => void (animation.playState = "paused")),
      play: vi.fn(() => void (animation.playState = "running")),
      finish: vi.fn(() => {
        animation.playState = "finished";
        resolve();
      }),
      effect: { updateTiming: vi.fn() },
    };
    animations.push(animation);
    return animation as unknown as Animation;
  };
}

export function uninstallAnimate() {
  delete (Element.prototype as Partial<Element>).animate;
  animations.length = 0;
}
