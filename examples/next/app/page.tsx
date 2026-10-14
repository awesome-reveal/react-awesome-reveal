import { Cascade, Reveal } from "@awesome-reveal/react";
import { HookExample } from "./hook-example";
import { ManualExample } from "./manual-example";
import { Section } from "./section";

export default function Page() {
  return (
    <>
      <Section>
        <Reveal>
          <h1>Reveal from a Server Component</h1>
        </Reveal>
      </Section>
      <Section>
        <Reveal from={{ opacity: 0 }}>Pure fade</Reveal>
      </Section>
      {(["top", "right", "bottom", "left"] as const).map((from) => (
        <Section key={from}>
          <Reveal from={from}>From the {from}</Reveal>
        </Section>
      ))}
      <Section>
        <Reveal
          keyframes={[
            { opacity: 0, transform: "scale(.8)", easing: "ease-out" },
            { opacity: 1, transform: "scale(1)" },
          ]}
        >
          Native frames created on the server
        </Reveal>
      </Section>
      <Section>
        <Cascade as="ul" from={{ opacity: 0, y: 16 }}>
          <li>Cascade</li>
          <li>from a</li>
          <li>Server Component</li>
        </Cascade>
      </Section>
      <Section>
        <Reveal as="h2" from="left">
          A header
        </Reveal>
        <Reveal from={{ opacity: 0 }} delay={250}>
          Its content starts 250 ms later
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
