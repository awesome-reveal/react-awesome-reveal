import { useRef, useState } from "react";
import {
  blur,
  defineKeyframes,
  enter,
  fade,
  pop,
  Reveal,
  scale,
  slide,
  useReveal,
} from "@awesome-reveal/react";

import { Section } from "./components/Section";

const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
  keyframe: (progress) => {
    const t = 1 - (1 - progress) ** 3;
    return { opacity: t, transform: `rotate(${(1 - t) * turns * 360}deg) scale(${t})` };
  },
}));

function HookExample() {
  const { getProps } = useReveal<HTMLHeadingElement>({ keyframes: blur({ from: 16 }) });

  return <h2 {...getProps()}>Revealed with the useReveal hook, no wrapper</h2>;
}

function ManualExample() {
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
          <h1>The default entrance</h1>
        </Reveal>
      </Section>
      <Section>
        <Reveal keyframes={fade()}>
          <h1>fade</h1>
        </Reveal>
      </Section>
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Section key={side}>
          <Reveal as="h1" from={side} distance={40} once={false}>
            from the {side}, every time it enters the viewport
          </Reveal>
        </Section>
      ))}
      <Section>
        <Reveal as="h1" keyframes={slide({ from: "left", distance: "2rem" })}>
          slide from the left, with a factory
        </Reveal>
      </Section>
      <Section>
        <Reveal as="h1" keyframes={pop()} once={false}>
          pop
        </Reveal>
      </Section>
      {[0, 0.3, 0.6].map((bounce) => (
        <Section key={bounce}>
          <Reveal as="h1" from={{ scale: 0.5 }} bounce={bounce} duration={1000} once={false}>
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
