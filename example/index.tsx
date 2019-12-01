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
        <Flip
          chain
          direction="horizontal"
          duration={1000}
          style={{ textAlign: 'center' }}
        >
          <h1>I enter first...</h1>
          <h1>...then comes my turn...</h1>
          <h1>...and finally you see me!</h1>
          <h1>I enter first...</h1>
          <h1>...then comes my turn...</h1>
          <h1>...and finally you see me!</h1>
          <h1>I enter first...</h1>
          <h1>...then comes my turn...</h1>
          <h1>...and finally you see me!</h1>
        </Flip>
      </Section>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
