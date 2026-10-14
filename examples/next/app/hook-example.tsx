"use client";

import { useReveal } from "@awesome-reveal/react";

export function HookExample() {
  const { getProps } = useReveal<HTMLHeadingElement>({ from: { opacity: 0, blur: 16 } });

  return <h2 {...getProps()}>Revealed with the useReveal hook in a Client Component</h2>;
}
