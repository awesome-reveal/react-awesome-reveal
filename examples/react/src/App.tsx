import { useState } from "react";
import { Cascade, Reveal, useCascade, useReveal } from "@awesome-reveal/react";
import { Section } from "./components/Section";

function CascadeHookExample() {
  const { getProps } = useCascade<HTMLUListElement>({ from: "left", interval: 120 });
  return (
    <ul {...getProps()}>
      <li>A hook</li>
      <li>on your own</li>
      <li>list</li>
    </ul>
  );
}
function ManualExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-expanded={open} onClick={() => setOpen(!open)}>
        Toggle
      </button>
      <Reveal when={open} hidden={!open} from={{ opacity: 0 }}>
        Manual entrance
      </Reveal>
    </>
  );
}
function HookExample() {
  const { getProps } = useReveal<HTMLHeadingElement>({ from: { opacity: 0, blur: 8 } });
  return <h2 {...getProps()}>A hook on your own element</h2>;
}
export const App = () => (
  <>
    <Section>
      <Reveal>
        <h1>The default entrance</h1>
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
      <Reveal from={{ scale: 0.9 }}>Scale only</Reveal>
    </Section>
    <Section>
      <Reveal from="left" style={{ rotate: "-3deg" }}>
        Keeps its own rotation
      </Reveal>
    </Section>
    <Section>
      <Reveal
        keyframes={[
          {
            opacity: 0,
            transform: "rotate(-10deg) scale(.8)",
            easing: "cubic-bezier(.34,1.56,.64,1)",
          },
          { opacity: 1, transform: "rotate(0deg) scale(1)" },
        ]}
      >
        Native keyframes
      </Reveal>
    </Section>
    <Section>
      <Cascade as="ul" from={{ opacity: 0, y: 16 }}>
        <li>Fast</li>
        <li>Small</li>
        <li>Accessible</li>
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
      <CascadeHookExample />
    </Section>
    <Section>
      <HookExample />
    </Section>
    <Section>
      <ManualExample />
    </Section>
  </>
);
