import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";

import Fade from "../src/components/Fade";
import Section from "./components/Section";

const App = () => {
  return (
    <>
      <Section>
        <Fade cascade>Mona de cojon</Fade>
      </Section>
      <Section>
        <Fade>
          <>
            <h1>Title</h1>
            <h2>Subtitle</h2>
          </>
        </Fade>
      </Section>
      {/*<Section>
        <Fade cascade direction="left">
          <p>Line 1</p>
          <p>Line 2</p>
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
      </Section>*/}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
