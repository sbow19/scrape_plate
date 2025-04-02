import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
/**
 * Global styles across extension
 */
import "../../global_styles/global_styles.css";

import { App } from "./App";
import UserContent from "../../shared/src/state/state";

UserContent.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App></App>
  </StrictMode>
);
