import { Reveal } from "@awesome-reveal/react";
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

import { HookExample } from "./hook-example";
import { ManualExample } from "./manual-example";
import { Section } from "./section";

const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
  keyframe: (progress) => {
    const t = 1 - (1 - progress) ** 3;
    return { opacity: t, transform: `rotate(${(1 - t) * turns * 360}deg) scale(${t})` };
  },
}));

export default function Page() {
  return (
    <>
      <Section>
        <Reveal>
          <h1>Reveal in a Server Component, with the default keyframes</h1>
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
      <Section>
        <Reveal
          as="h1"
          keyframes={scale({ from: 0.5, easing: spring({ bounce: 0.3 }) })}
          duration={1000}
        >
          scale with a spring
        </Reveal>
      </Section>
      <Section>
        <Reveal as="ul" keyframes={enter({ x: -24 })} stagger={100}>
          <li>I enter first...</li>
          <li>...then comes my turn...</li>
          <li>...and finally you see me!</li>
        </Reveal>
      </Section>
      <Section>
        <Reveal as="h1" keyframes={spin({ turns: 2 })} duration={1000}>
          A custom defineKeyframes animation, created on the server
        </Reveal>
      </Section>
      <Section>
        <Reveal as="h1" keyframes={blur({ from: 12 })}>
          blur
        </Reveal>
      </Section>
      <Section>
        <HookExample />
      </Section>
      <Section>
        <ManualExample />
      </Section>
    </>
  );
}
