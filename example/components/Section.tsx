import * as React from 'react';
import { Fade, Direction } from '../../src/index';

interface SectionProps {
  direction?: Direction;
}

const Section: React.FC<SectionProps> = ({ direction = 'left' }) => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade direction={direction} triggerOnce style={{ textAlign: 'center' }}>
        <h1>React Reveal Next</h1>
        <h2>Dennis Morello</h2>
        <h3>Front-End Engineer</h3>
      </Fade>
    </div>
  );
};

export default Section;
