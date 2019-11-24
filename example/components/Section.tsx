import * as React from 'react';
import { Direction, Fade } from '../../.';

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
      <Fade direction={direction} style={{ textAlign: 'center' }}>
        <h1>Hello World</h1>
        <h2>Dennis Morello</h2>
        <h3>Front-End Engineer</h3>
      </Fade>
    </div>
  );
};

export default Section;
