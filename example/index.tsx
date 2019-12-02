import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Fade, Flip, Bounce } from '../dist';
import Section from './components/Section';

const App = () => {
  return (
    <>
      <Section>
        <Fade direction="top">
          <h2>Scroll down</h2>
        </Fade>
      </Section>
      <Section>
        <Bounce direction="left" style={{ transformStyle: 'flat' }}>
          <h1
            style={{
              padding: '2rem 4rem',
              background: 'pink',
              borderRadius: 8,
            }}
          >
            Bounce
          </h1>
        </Bounce>
      </Section>
      <Section>
        <Flip
          as="ul"
          chain
          damping={1 / 10}
          direction="horizontal"
          style={{ textAlign: 'center', listStyle: 'none' }}
        >
          <li>I enter first...</li>
          <li>...then comes my turn...</li>
          <li>...and finally you see me!</li>
          <li>I enter first...</li>
          <li>...then comes my turn...</li>
          <li>...and finally you see me!</li>
          <li>I enter first...</li>
          <li>...then comes my turn...</li>
          <li>...and finally you see me!</li>
        </Flip>
      </Section>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
