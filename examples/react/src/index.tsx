import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@awesome-reveal/react/reveal.css";

import { App } from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No root element found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
