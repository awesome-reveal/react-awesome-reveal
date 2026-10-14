"use client";

import { Reveal } from "@awesome-reveal/react";
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
      <Reveal
        from={{ opacity: 0, scale: 0.9 }}
        when={shown}
        onReveal={() => setCount((value) => value + 1)}
      >
        <p>Revealed manually with `when`</p>
      </Reveal>
    </>
  );
}
