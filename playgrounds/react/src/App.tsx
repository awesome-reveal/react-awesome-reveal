import { useRef, useState } from "react";
import { Reveal, useReveal } from "@awesome-reveal/react";
import {
  blur,
  defineKeyframes,
  enter,
  fade,
  pop,
  scale,
  slide,
  spring,
} from "@awesome-reveal/react/keyframes";

import { Section } from "./components/Section";

const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
  keyframe: (t, u) => ({ opacity: t, transform: `rotate(${u * turns * 360}deg) scale(${t})` }),
  easing: (t) => 1 - (1 - t) ** 3,
}));

function HookExample() {
  const { ref, style } = useReveal<HTMLHeadingElement>({ keyframes: blur() });

  return (
    <h2 ref={ref} style={style}>
      Revealed with the useReveal hook, no wrapper
    </h2>
  );
}

function ManualExample() {
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

function RefExample() {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <Reveal as="input" keyframes={slide()} ref={ref} placeholder="Revealed input" />
      <button type="button" onClick={() => ref.current?.focus()}>
        Focus through the ref
      </button>
    </>
  );
}

export const App = () => {
  return (
    <>
      <Section>
        <Reveal>
          <h1>The default keyframes</h1>
        </Reveal>
      </Section>
      <Section>
        <Reveal keyframes={fade()}>
          <h1>fade</h1>
        </Reveal>
      </Section>
      {(["up", "down", "left", "right"] as const).map((direction) => (
        <Section key={direction}>
          <Reveal as="h1" keyframes={slide({ direction, distance: 40 })} once={false}>
            slide {direction}, every time it enters the viewport
          </Reveal>
        </Section>
      ))}
      <Section>
        <Reveal as="h1" keyframes={pop()} once={false}>
          pop
        </Reveal>
      </Section>
      {[0, 0.3, 0.6].map((bounce) => (
        <Section key={bounce}>
          <Reveal
            as="h1"
            keyframes={scale({ from: 0.5, easing: spring({ bounce }) })}
            duration={1000}
            once={false}
          >
            scale with a spring, bounce {bounce}
          </Reveal>
        </Section>
      ))}
      <Section>
        <Reveal as="ul" keyframes={enter({ x: -24 })} stagger={100}>
          <li>I enter first...</li>
          <li>...then comes my turn...</li>
          <li>...and finally you see me!</li>
        </Reveal>
      </Section>
      <Section>
        <Reveal as="h1" keyframes={spin({ turns: 2 })} duration={1000}>
          A custom defineKeyframes animation
        </Reveal>
      </Section>
      <Section>
        <HookExample />
      </Section>
      <Section>
        <ManualExample />
      </Section>
      <Section>
        <RefExample />
      </Section>
    </>
  );
};
