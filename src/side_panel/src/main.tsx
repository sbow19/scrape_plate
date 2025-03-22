import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
/**
 * Global styles across extension
 */
import "../../global_styles/global_styles.css";

import { App } from "./App";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App></App>
  </StrictMode>
);
