"use client";

import { Reveal, scale } from "@awesome-reveal/react";
import { useState } from "react";

export function ManualExample() {
  const [shown, setShown] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <>
      <button type="button" onClick={() => setShown((value) => !value)}>
        Toggle
      </button>
      <output>{count}</output> reveals
      <Reveal keyframes={scale()} when={shown} onReveal={() => setCount((value) => value + 1)}>
        <p>Revealed manually with `when`</p>
      </Reveal>
    </>
  );
}
