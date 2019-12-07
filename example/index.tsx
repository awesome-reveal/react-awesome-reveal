import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Fade, Flip, Bounce, Zoom } from '../src';
import Section from './components/Section';

const App = () => {
  return (
    <>
      <Section>
        <Fade direction="left">Scroll down</Fade>
      </Section>
      <Section>
        <Fade cascade direction="left">
          <p>Sono un mona</p>
          <p>Sono un mona</p>
        </Fade>
      </Section>
      <Section>
        <Flip
          cascade
          direction="horizontal"
          style={{ textAlign: 'center', listStyle: 'none' }}
        >
          <ul>
            <li>I enter first...</li>
            <li>...then comes my turn...</li>
            <li>...and finally you see me!</li>
          </ul>
        </Flip>
      </Section>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
