import { blur, defineKeyframes, enter, fade, pop, Reveal, slide } from "@awesome-reveal/react";

import { HookExample } from "./hook-example";
import { ManualExample } from "./manual-example";
import { Section } from "./section";

// The keyframes factories run in this Server Component. The result is an array, so it crosses to Reveal.
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
          <h1>Reveal in a Server Component, with the default entrance</h1>
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
      <Section>
        {/* The spring resolves in the browser, so a Server Component can set it. */}
        <Reveal as="h1" from={{ scale: 0.5 }} bounce={0.3} duration={1000}>
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
