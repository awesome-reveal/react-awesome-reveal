interface Props {
  children?: React.ReactNode;
}

export const Section: React.FC<Props> = ({ children }) => (
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
