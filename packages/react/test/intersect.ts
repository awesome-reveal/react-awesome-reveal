import { intersect as report } from "@awesome-reveal/test-utils/intersection-observer";
import { act } from "@testing-library/react";

export function intersect(element: Element, visible: boolean | number) {
  act(() => report(element, visible));
}
