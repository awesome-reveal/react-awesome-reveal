import { createReveal, type RevealStore } from "../src/adapter";

class FakeObserver {
  static instances: FakeObserver[] = [];
  readonly elements: Element[] = [];
  disconnected = false;

  constructor(private callback: IntersectionObserverCallback) {
    FakeObserver.instances.push(this);
  }

  observe(element: Element) {
    this.elements.push(element);
  }

  disconnect() {
    this.disconnected = true;
  }

  report(inView: boolean) {
    this.callback(
      [{ isIntersecting: inView, intersectionRatio: Number(inView) }] as never,
      this as never,
    );
  }
}

const root = new Map<string, string>();
const ownerDocument = {
  documentElement: {
    hasAttribute: (name: string) => root.has(name),
    setAttribute: (name: string, value: string) => root.set(name, value),
  },
};

function fakeElement() {
  const cancel = vi.fn();
  const animate = vi.fn(() => ({ cancel, pause: vi.fn(), play: vi.fn() }));
  const element = { animate, children: [], isConnected: false, ownerDocument };
  return { element: element as unknown as Element, animate, cancel };
}

const live = () => FakeObserver.instances.filter((observer) => !observer.disconnected);

beforeEach(() => {
  FakeObserver.instances = [];
  root.clear();
  vi.stubGlobal("IntersectionObserver", FakeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createReveal", () => {
  const options = {};

  // The server renders the element hidden, so the entrance of `when: true` plays after hydration.
  it("is hidden before the first attach, also with when: true", () => {
    expect(createReveal(options).revealed).toBe(false);
    expect(createReveal({ ...options, when: null }).revealed).toBe(false);
    expect(createReveal({ ...options, when: true }).revealed).toBe(false);
  });

  it("tells the listener, but observes and plays nothing, before it has an element", () => {
    const state = createReveal({ ...options, when: false });
    const listener = vi.fn();
    state.subscribe(listener);
    state.setOptions({ ...options, when: true });
    expect(listener.mock.calls).toEqual([[true]]);
    expect(FakeObserver.instances).toEqual([]);
  });

  it("reveals at the first attach with when: true", () => {
    const { element, animate } = fakeElement();
    const state = createReveal({ ...options, when: true });
    const listener = vi.fn();
    state.subscribe(listener);
    state.attach(element);
    expect(listener.mock.calls).toEqual([[true]]);
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it("marks the document as ready at the first attach", () => {
    const state = createReveal(options);
    expect(root.has("data-reveal-ready")).toBe(false);
    state.attach(fakeElement().element);
    expect(root.get("data-reveal-ready")).toBe("");
  });

  it("calls onReveal once for each reveal, also when the same element plays again", () => {
    const { element } = fakeElement();
    const onReveal = vi.fn();
    const state = createReveal({ ...options, once: false, onReveal });
    state.attach(element);
    const observer = live()[0]!;
    observer.report(true);
    state.attach(null);
    state.attach(element);
    expect(onReveal.mock.calls).toEqual([[element]]);
    live()[0]!.report(false);
    live()[0]!.report(true);
    expect(onReveal).toHaveBeenCalledTimes(2);
  });

  it("tells the listener and plays the animation when the element enters the viewport", () => {
    const { element, animate } = fakeElement();
    const state = createReveal(options);
    const order: string[] = [];
    state.subscribe((revealed) => order.push(`listener ${revealed}`));
    animate.mockImplementation(() => {
      order.push("play");
      return { cancel: vi.fn(), pause: vi.fn(), play: vi.fn() };
    });
    state.attach(element);
    live()[0]!.report(true);
    expect(order).toEqual(["listener true", "play"]);
    expect(state.revealed).toBe(true);
  });

  it("cancels the animation before it tells the listener to hide the element", () => {
    const { element, cancel } = fakeElement();
    const state = createReveal({ ...options, once: false });
    const order: string[] = [];
    cancel.mockImplementation(() => order.push("cancel"));
    state.attach(element);
    live()[0]!.report(true);
    state.subscribe((revealed) => order.push(`listener ${revealed}`));
    live()[0]!.report(false);
    expect(order).toEqual(["cancel", "listener false"]);
  });

  it("plays the entrance again when the same element comes back right after null", () => {
    const { element, animate } = fakeElement();
    const state = createReveal({ ...options, when: true });
    state.attach(element);
    state.attach(null);
    state.attach(element);
    expect(animate).toHaveBeenCalledTimes(2);
  });

  it("plays no entrance on a different element after null", () => {
    const first = fakeElement();
    const second = fakeElement();
    const state = createReveal({ ...options, when: true });
    state.attach(first.element);
    state.attach(null);
    state.attach(second.element);
    expect(second.animate).not.toHaveBeenCalled();
  });

  it("does not reveal a stale in-view report when `when` is removed", () => {
    const { element } = fakeElement();
    const state = createReveal({ ...options, once: false });
    state.attach(element);
    live()[0]!.report(true);
    state.setOptions({ ...options, once: false, when: false });
    expect(state.revealed).toBe(false);
    state.setOptions({ ...options, once: false });
    expect(state.revealed).toBe(false);
  });

  it("plays the entrance once when when is true from the start", () => {
    const first = fakeElement();
    const second = fakeElement();
    const state = createReveal({ ...options, when: true });
    state.attach(first.element);
    expect(first.animate).toHaveBeenCalledTimes(1);
    state.attach(second.element);
    expect(second.animate).not.toHaveBeenCalled();
    expect(FakeObserver.instances).toEqual([]);
  });

  it("keeps a revealed state on a new element, and observes a hidden one", () => {
    const first = fakeElement();
    const second = fakeElement();
    const state = createReveal({ ...options, once: false });
    state.attach(first.element);
    state.attach(second.element);
    expect(live().map((observer) => observer.elements)).toEqual([[second.element]]);
    live()[0]!.report(true);
    const third = fakeElement();
    state.attach(third.element);
    expect(third.animate).not.toHaveBeenCalled();
    expect(state.revealed).toBe(true);
    expect(live().map((observer) => observer.elements)).toEqual([[third.element]]);
  });

  it("does not observe a new element after the reveal with once", () => {
    const state = createReveal(options);
    state.attach(fakeElement().element);
    live()[0]!.report(true);
    state.attach(fakeElement().element);
    expect(live()).toEqual([]);
  });

  it("cancels the animation and stops observing when it gets null", () => {
    const { element, cancel } = fakeElement();
    const state = createReveal({ ...options, once: false });
    state.attach(element);
    live()[0]!.report(true);
    state.attach(null);
    expect(cancel).toHaveBeenCalled();
    expect(live()).toEqual([]);
  });

  it("hides and plays again when the element leaves and enters with once: false", () => {
    const { element, animate, cancel } = fakeElement();
    const state = createReveal({ ...options, once: false });
    state.attach(element);
    const observer = live()[0]!;
    observer.report(true);
    observer.report(false);
    expect(cancel).toHaveBeenCalledTimes(1);
    observer.report(true);
    expect(animate).toHaveBeenCalledTimes(2);
  });

  it("restarts the observer only for when, threshold and once", () => {
    const state = createReveal({ ...options, threshold: 0.5 });
    state.attach(fakeElement().element);
    const first = live()[0]!;
    state.setOptions({ ...options, threshold: 0.5, duration: 100 });
    state.setOptions({
      ...options,
      threshold: 0.5,
      duration: 100,
      when: null,
    } as never);
    expect(live()).toEqual([first]);
    state.setOptions({ ...options, threshold: 0.2 });
    expect(live()).toHaveLength(1);
    expect(live()[0]).not.toBe(first);
  });

  it("calls only the last listener, and a removed listener not at all", () => {
    const state: RevealStore = createReveal({ ...options, when: false });
    const first = vi.fn();
    const second = vi.fn();
    state.subscribe(first);
    const remove = state.subscribe(second);
    state.setOptions({ ...options, when: true });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(true);
    remove();
    state.setOptions({ ...options, when: false });
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("copies the options, so that a mutated object still restarts the observer", () => {
    const mutable = { ...options, threshold: 1 };
    const state = createReveal(mutable);
    state.attach(fakeElement().element);
    const first = live()[0]!;
    mutable.threshold = 0.4;
    state.setOptions(mutable);
    expect(live()[0]).not.toBe(first);
  });
});

it("reports a throwing adapter callback once without breaking the reveal", () => {
  const callbacks: VoidFunction[] = [];
  vi.stubGlobal("queueMicrotask", (callback: VoidFunction) => callbacks.push(callback));
  const error = new Error("callback failure");
  const state = createReveal({
    once: false,
    onReveal: () => {
      throw error;
    },
  });
  state.attach(fakeElement().element);
  live()[0]!.report(true);
  live()[0]!.report(false);
  live()[0]!.report(true);
  expect(state.revealed).toBe(true);
  expect(callbacks).toHaveLength(1);
  expect(callbacks[0]).toThrow(error);
});
