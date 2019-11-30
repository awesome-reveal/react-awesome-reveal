import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Fade, Bounce } from '../dist';
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
          <div
            style={{
              padding: '2rem 4rem',
              background: 'pink',
              borderRadius: 8,
            }}
          >
            <h1>Bounce</h1>
          </div>
        </Bounce>
      </Section>
      <Section>
        <Fade>
          <p>I enter first...</p>
        </Fade>
        <Fade delay="1s">
          <p>...then comes my turn...</p>
        </Fade>
        <Fade delay="2s">
          <p>...and finally you see me!</p>
        </Fade>
      </Section>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
