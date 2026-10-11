import { intersect as report } from "@awesome-reveal/test-utils/intersection-observer";
import { nextTick } from "vue";

export async function intersect(element: Element, visible: boolean | number) {
  report(element, visible);
  await nextTick();
}
