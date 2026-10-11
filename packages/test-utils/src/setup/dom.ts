import "@testing-library/jest-dom/vitest";

import { installAnimate, uninstallAnimate } from "../animate";
import { MockIntersectionObserver } from "../intersection-observer";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  installAnimate();
});

afterEach(() => {
  vi.unstubAllGlobals();
  uninstallAnimate();
  MockIntersectionObserver.instances.clear();
});
