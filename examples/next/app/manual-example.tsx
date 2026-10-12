"use client";

import { Reveal } from "@awesome-reveal/react";
import { scale } from "@awesome-reveal/react/keyframes";
import { useState } from "react";

export function ManualExample() {
  const [shown, setShown] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShown((value) => !value)}>
        Toggle
      </button>
      <Reveal keyframes={scale()} when={shown}>
        <p>Revealed manually with `when`</p>
      </Reveal>
    </>
  );
}
