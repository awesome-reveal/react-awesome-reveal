import { collectReports } from "@awesome-reveal/test-utils/reports";

import { createCascade, createReveal, type RevealStore } from "../src/adapter";

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
      [
        {
          isIntersecting: inView,
          intersectionRatio: Number(inView),
          boundingClientRect: { width: 0, height: 0 },
          rootBounds: null,
        },
      ] as never,
      this as never,
    );
  }
}

function fakeElement() {
  const cancel = vi.fn();
  const animate = vi.fn(() => ({ cancel, pause: vi.fn(), play: vi.fn(), playState: "running" }));
  const attributes = new Map<string, string>();
  const element = {
    animate,
    children: [],
    isConnected: false,
    attributes,
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    removeAttribute: (name: string) => attributes.delete(name),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    matches: () => false,
  };
  return { element: element as unknown as Element, animate, cancel, attributes };
}

const live = () => FakeObserver.instances.filter((observer) => !observer.disconnected);

beforeEach(() => {
  FakeObserver.instances = [];
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

  it("marks the attached element, and unmarks it at the detach", () => {
    const first = fakeElement();
    const second = fakeElement();
    const state = createReveal(options);
    state.attach(first.element);
    expect(first.attributes.get("data-awesome-reveal-attached")).toBe("");
    state.attach(second.element);
    expect(first.attributes.has("data-awesome-reveal-attached")).toBe(false);
    expect(second.attributes.get("data-awesome-reveal-attached")).toBe("");
    state.attach(null);
    expect(second.attributes.has("data-awesome-reveal-attached")).toBe(false);
  });

  it("calls onReveal once for each reveal, also when the same element plays again", () => {
    const { element } = fakeElement();
    const onReveal = vi.fn();
    const state = createReveal({ ...options, onReveal });
    state.attach(element);
    live()[0]!.report(true);
    state.attach(null);
    state.attach(element);
    expect(onReveal.mock.calls).toEqual([[element]]);
    state.setOptions({ ...options, onReveal, when: false });
    state.setOptions({ ...options, onReveal, when: true });
    expect(onReveal).toHaveBeenCalledTimes(2);
  });

  it("tells the listener, removes the hidden attribute, plays and calls onReveal when the element enters the viewport", () => {
    const { element, animate, attributes } = fakeElement();
    element.setAttribute("data-awesome-reveal", "hidden");
    const order: string[] = [];
    const hidden = () => attributes.has("data-awesome-reveal");
    const state = createReveal({ ...options, onReveal: () => order.push(`onReveal ${hidden()}`) });
    state.subscribe((revealed) => order.push(`listener ${revealed} ${hidden()}`));
    animate.mockImplementation(() => {
      order.push(`play ${hidden()}`);
      return { cancel: vi.fn(), pause: vi.fn(), play: vi.fn(), playState: "running" };
    });
    state.attach(element);
    live()[0]!.report(true);
    expect(order).toEqual(["listener true true", "play false", "onReveal false"]);
    expect(state.revealed).toBe(true);
  });

  it("cancels the animation before it tells the listener to hide the element", () => {
    const { element, cancel } = fakeElement();
    const state = createReveal(options);
    const order: string[] = [];
    cancel.mockImplementation(() => order.push("cancel"));
    state.attach(element);
    live()[0]!.report(true);
    state.subscribe((revealed) => order.push(`listener ${revealed}`));
    state.setOptions({ ...options, when: false });
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

  it("does not replay a finished entrance when the same element comes back after null", () => {
    const { element, animate } = fakeElement();
    const state = createReveal({ ...options, when: true });
    state.attach(element);
    for (const { value } of animate.mock.results) Object.assign(value, { playState: "finished" });
    state.attach(null);
    state.attach(element);
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it("cancels the entrance when a new element replaces the element", () => {
    const first = fakeElement();
    const second = fakeElement();
    const state = createReveal({ ...options, when: true });
    state.attach(first.element);
    state.attach(second.element);
    expect(first.cancel).toHaveBeenCalled();
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
    const state = createReveal(options);
    state.attach(element);
    live()[0]!.report(true);
    state.setOptions({ ...options, when: false });
    expect(state.revealed).toBe(false);
    state.setOptions(options);
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
    const state = createReveal(options);
    state.attach(first.element);
    state.attach(second.element);
    expect(live().map((observer) => observer.elements)).toEqual([[second.element]]);
    live()[0]!.report(true);
    const third = fakeElement();
    state.attach(third.element);
    expect(third.animate).not.toHaveBeenCalled();
    expect(state.revealed).toBe(true);
    expect(live()).toEqual([]);
  });

  it("cancels the animation and stops observing when it gets null", () => {
    const { element, cancel } = fakeElement();
    const state = createReveal(options);
    state.attach(element);
    live()[0]!.report(true);
    state.attach(null);
    expect(cancel).toHaveBeenCalled();
    expect(live()).toEqual([]);
  });

  it("restarts the observer only for when and threshold", () => {
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
  const reports = collectReports();
  const error = new Error("callback failure");
  const onReveal = () => {
    throw error;
  };
  const state = createReveal({ onReveal });
  state.attach(fakeElement().element);
  live()[0]!.report(true);
  state.setOptions({ onReveal, when: false });
  state.setOptions({ onReveal, when: true });
  expect(state.revealed).toBe(true);
  expect(reports()).toEqual([error]);
});

describe("createCascade", () => {
  const delays = (animate: ReturnType<typeof fakeElement>["animate"]) =>
    animate.mock.calls.map((call) => (call as unknown[])[1] as KeyframeAnimationOptions);

  function container(count: number) {
    const children = Array.from({ length: count }, () => fakeElement());
    const parent = fakeElement();
    Object.assign(parent.element, { children: children.map((child) => child.element) });
    return { ...parent, children };
  }

  it("animates the direct children at the reveal, interval milliseconds apart", () => {
    const { element, animate, children } = container(3);
    const state = createCascade();
    state.attach(element);
    expect(children[0]!.animate).not.toHaveBeenCalled();
    live()[0]!.report(true);
    expect(animate).not.toHaveBeenCalled();
    expect(children.flatMap((child) => delays(child.animate).map((call) => call.delay))).toEqual([
      0, 80, 160,
    ]);
  });

  it("reads the children at the reveal, so children rendered after the attach play", () => {
    const { element, children } = container(0);
    const state = createCascade({ interval: 50 });
    state.attach(element);
    const late = container(2);
    Object.assign(element, { children: late.children.map((child) => child.element) });
    live()[0]!.report(true);
    expect(children).toEqual([]);
    expect(late.children.map((child) => delays(child.animate)[0]!.delay)).toEqual([0, 50]);
  });

  it("applies a new interval at the next reveal, and cancels every child when it hides", () => {
    const { element, children } = container(2);
    const state = createCascade({ when: true });
    state.attach(element);
    state.setOptions({ when: false, interval: 200 });
    expect(children.map((child) => child.cancel.mock.calls.length)).toEqual([1, 1]);
    state.setOptions({ when: true, interval: 200 });
    expect(delays(children[1]!.animate).map((call) => call.delay)).toEqual([80, 200]);
  });

  it("reveals a container with no children and calls onReveal with the container", () => {
    const { element } = container(0);
    const onReveal = vi.fn();
    const state = createCascade({ when: true, onReveal });
    state.attach(element);
    expect(state.revealed).toBe(true);
    expect(onReveal.mock.calls).toEqual([[element]]);
  });
});
