export function mountBelowTheFold(): HTMLElement {
  document.body.innerHTML = `<div style="height: 150vh"></div><div id="target" style="height: 100px"><p>a</p><p>b</p><p>c</p></div><div style="height: 150vh"></div>`;
  scrollTo(0, 0);
  return document.getElementById("target")!;
}

export function scrollIntoView(element: Element) {
  element.scrollIntoView({ block: "center" });
}

export function showTopHalf(element: HTMLElement) {
  scrollTo(0, element.offsetTop - innerHeight + element.offsetHeight / 2);
}

export function scrollToTop() {
  scrollTo(0, 0);
}

/** Waits until the observers of the current layout have reported. */
export function settle(): Promise<void> {
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve))),
  );
}
