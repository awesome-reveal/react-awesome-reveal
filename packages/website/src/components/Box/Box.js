import React from "react";

import styles from "./Box.module.css";

export const Box = ({ color = "primary" }) => {
  return (
    <div
      className={styles.Box}
      style={{ backgroundColor: `var(--ifm-color-${color})` }}
    />
  );
};
