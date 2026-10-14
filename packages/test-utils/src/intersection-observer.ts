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

  trigger(target: Element, intersectionRatio: number) {
    const entry = { target, intersectionRatio, isIntersecting: intersectionRatio > 0 };
    this.callback([entry as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

export function observerOf(element: Element): MockIntersectionObserver | undefined {
  return [...MockIntersectionObserver.instances].find((observer) => observer.elements.has(element));
}

/** Reports `element` to its observers as visible (`true` or a ratio) or not visible. Adapters wrap it in their update scope, such as React `act`. */
export function intersect(element: Element, visible: boolean | number) {
  const ratio = typeof visible === "number" ? visible : visible ? 1 : 0;
  observerOf(element)?.trigger(element, ratio);
}
