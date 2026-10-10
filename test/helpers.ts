import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";

export function wrapperOf(text: string): HTMLElement {
  return screen.getByText(text).parentElement!;
}

export function classesOf(element: Element): string[] {
  return [...element.classList].filter((name) => !name.startsWith("css-"));
}

export function renderInView(ui: ReactElement): HTMLElement {
  render(ui);
  mockAllIsIntersecting(true);
  return wrapperOf("child");
}
