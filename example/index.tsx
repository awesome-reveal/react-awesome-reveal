import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Section from './components/Section';

const App = () => {
  return (
    <>
      <Section />
      <Section direction="right" />
      <Section />
      <Section direction="right" />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
