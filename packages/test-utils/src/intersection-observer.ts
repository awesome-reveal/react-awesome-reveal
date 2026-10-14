export class MockIntersectionObserver {
  static readonly instances = new Set<MockIntersectionObserver>();

  readonly thresholds: readonly number[];
  readonly elements = new Set<Element>();

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.thresholds = [options.threshold ?? 0].flat();
    MockIntersectionObserver.instances.add(this);
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  disconnect() {
    this.elements.clear();
    MockIntersectionObserver.instances.delete(this);
  }

  /** Sends one report with an entry for each ratio, in order. */
  trigger(target: Element, ...ratios: number[]) {
    const entries = ratios.map((intersectionRatio) => ({
      target,
      intersectionRatio,
      isIntersecting: intersectionRatio > 0,
      boundingClientRect: { width: 0, height: 0 },
      rootBounds: null,
    }));
    this.callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
  }

  /** Sends one report with an entry that has the sizes of the element and the root. */
  triggerSized(target: Element, intersectionRatio: number, element: Size, root: Size | null) {
    const entry = {
      target,
      intersectionRatio,
      isIntersecting: intersectionRatio > 0,
      boundingClientRect: element,
      rootBounds: root,
    };
    this.callback([entry] as never, this as unknown as IntersectionObserver);
  }
}

interface Size {
  width: number;
  height: number;
}

export function observerOf(element: Element): MockIntersectionObserver | undefined {
  return [...MockIntersectionObserver.instances].find((observer) => observer.elements.has(element));
}

/** Reports `element` to its observers as visible (`true` or a ratio) or not visible. Adapters wrap it in their update scope, such as React `act`. */
export function intersect(element: Element, visible: boolean | number) {
  const ratio = typeof visible === "number" ? visible : visible ? 1 : 0;
  observerOf(element)?.trigger(element, ratio);
}
