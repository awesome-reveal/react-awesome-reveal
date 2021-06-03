const Section: React.FC = ({ children }) => (
  <section
    style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    {children}
  </section>
);

export default Section;
