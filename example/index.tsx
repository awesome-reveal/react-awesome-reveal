import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Fade } from '../dist';
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
