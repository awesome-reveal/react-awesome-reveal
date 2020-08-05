import * as React from "react";

const Section: React.FC = ({ children }) => {
  return (
    <section
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      {children}
    </section>
  );
};

export default Section;
