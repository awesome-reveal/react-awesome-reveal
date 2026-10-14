import { useEffect, useRef, useState } from "react";
import { Reveal, useReveal } from "@awesome-reveal/react";
import { cascade } from "@awesome-reveal/core";
import { Section } from "./components/Section";

function Composition() {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const handle = cascade(ref.current, { from: { opacity: 0, y: 16 }, interval: 80 });
    return () => handle.dispose();
  }, []);
  return (
    <ul ref={ref}>
      <li>Fast</li>
      <li>Small</li>
      <li>Accessible</li>
    </ul>
  );
}
function ManualExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      <Reveal when={open} from={{ opacity: 0 }}>
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
        <Reveal from={from} once={false}>
          From the {from}
        </Reveal>
      </Section>
    ))}
    <Section>
      <Reveal from={{ scale: 0.9 }}>Scale only</Reveal>
    </Section>
    <Section>
      <Reveal
        keyframes={[
          {
            opacity: 0,
            transform: "rotate(-10deg) scale(.8)",
            easing: "cubic-bezier(.34,1.56,.64,1)",
          },
          {},
        ]}
      >
        Native keyframes
      </Reveal>
    </Section>
    <Section>
      <Composition />
    </Section>
    <Section>
      <HookExample />
    </Section>
    <Section>
      <ManualExample />
    </Section>
  </>
);
