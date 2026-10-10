import "@testing-library/jest-dom/vitest";

import { installAnimate, uninstallAnimate } from "../mocks/animate";
import { MockIntersectionObserver } from "../mocks/intersection-observer";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  installAnimate();
});

afterEach(() => {
  vi.unstubAllGlobals();
  uninstallAnimate();
  MockIntersectionObserver.instances.clear();
});
