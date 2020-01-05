import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Fade, Flip } from '../src';
import Section from './components/Section';

const App = () => {
  const [when, setWhen] = React.useState<boolean>(true);

  function toggleWhen() {
    setWhen(previousWhen => !previousWhen);
  }

  return (
    <>
      <Section>
        <Fade direction="left" when={when}>
          <p>Text with when</p>
        </Fade>
        <button onClick={toggleWhen}>{when === true ? 'true' : 'false'}</button>
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
