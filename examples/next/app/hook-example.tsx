"use client";

import { useReveal } from "@awesome-reveal/react";
import { blur } from "@awesome-reveal/react/keyframes";

export function HookExample() {
  const { getProps } = useReveal<HTMLHeadingElement>({ keyframes: blur({ from: 16 }) });

  return <h2 {...getProps()}>Revealed with the useReveal hook in a Client Component</h2>;
}
