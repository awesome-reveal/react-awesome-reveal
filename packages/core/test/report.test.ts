// The report state lives in a module, so each test loads fresh modules.
let queued: VoidFunction[];

beforeEach(() => {
  vi.resetModules();
  queued = [];
  vi.stubGlobal("queueMicrotask", (callback: VoidFunction) => queued.push(callback));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function thrownBy(callbacks: VoidFunction[]): unknown[] {
  return callbacks.map((callback) => {
    try {
      callback();
    } catch (error) {
      return error;
    }
    return undefined;
  });
}

function rejectObserver(error: Error) {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor() {
        throw error;
      }
    },
  );
}

function failingElement(message: string, children = 0) {
  const child = () => ({
    animate: () => {
      throw new TypeError(message);
    },
  });
  return {
    animate: () => {
      throw new TypeError(message);
    },
    children: Array.from({ length: children }, child),
  } as unknown as Element;
}

describe("observe reports", () => {
  it("shows the element and reports the rejected options from a microtask", async () => {
    const { observe } = await import("../src/observe");
    const error = new RangeError("threshold");
    rejectObserver(error);
    const onChange = vi.fn();
    expect(() => observe({} as Element, { threshold: 2 }, onChange)).not.toThrow();
    expect(onChange.mock.calls).toEqual([[true]]);
    expect(queued).toHaveLength(1);
    expect(thrownBy(queued)).toEqual([error]);
  });

  it("reports each distinct message once", async () => {
    const { observe } = await import("../src/observe");
    rejectObserver(new RangeError("same"));
    observe({} as Element, {}, () => {});
    observe({} as Element, {}, () => {});
    expect(queued).toHaveLength(1);
    rejectObserver(new RangeError("other"));
    observe({} as Element, {}, () => {});
    expect(queued).toHaveLength(2);
  });

  it("does not report when IntersectionObserver does not exist", async () => {
    const { observe } = await import("../src/observe");
    vi.stubGlobal("IntersectionObserver", undefined);
    const onChange = vi.fn();
    observe({} as Element, {}, onChange);
    expect(onChange.mock.calls).toEqual([[true]]);
    expect(queued).toEqual([]);
  });
});

describe("play reports", () => {
  const options = { reducedMotion: "never" } as const;

  it("keeps the element visible and reports the error from a microtask", async () => {
    const { play } = await import("../src/play");
    expect(() => play(failingElement("bad easing"), options)()).not.toThrow();
    expect(thrownBy(queued)).toEqual([new TypeError("bad easing")]);
  });

  it("reports once for all staggered children", async () => {
    const { play } = await import("../src/play");
    play(failingElement("bad easing", 3), { ...options, stagger: 50 });
    expect(queued).toHaveLength(1);
  });

  it("reports only the first failure of a message", async () => {
    const { play } = await import("../src/play");
    play(failingElement("bad easing"), options);
    play(failingElement("bad easing"), options);
    expect(queued).toHaveLength(1);
    play(failingElement("bad offset"), options);
    expect(queued).toHaveLength(2);
  });

  it("does not report in a browser without linear()", async () => {
    const { play } = await import("../src/play");
    vi.stubGlobal("CSS", { supports: () => false });
    play(failingElement("linear"), options);
    expect(queued).toEqual([]);
  });
});
