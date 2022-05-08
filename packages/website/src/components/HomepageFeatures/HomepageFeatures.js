import clsx from "clsx";
import React from "react";

import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Easy to Use",
    Svg: require("../../../static/img/undraw_coolness.svg").default,
    description: (
      <>
        React Awesome Reveal was designed from the ground up to be easily
        installed and used.
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    Svg: require("../../../static/img/undraw_dev_focus.svg").default,
    description: (
      <>
        React Awesome Reveal lets you focus on the content, taking care of all
        the heavy lifting to efficiently animating your components.
      </>
    ),
  },
  {
    title: "Powered by React and TypeScript",
    Svg: require("../../../static/img/undraw_react.svg").default,
    description: (
      <>
        The library is entirely written in TypeScript and it is intended to be
        used in React projects.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
