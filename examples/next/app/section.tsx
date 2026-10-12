import type { ReactNode } from "react";

export function Section({ children }: { children: ReactNode }) {
  return (
    <section style={{ display: "grid", minHeight: "80vh", placeItems: "center" }}>
      {children}
    </section>
  );
}
