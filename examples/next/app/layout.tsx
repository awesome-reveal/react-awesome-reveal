import type { ReactNode } from "react";

import "@awesome-reveal/react/reveal.css";

export const metadata = { title: "awesome-reveal Next.js example" };

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
