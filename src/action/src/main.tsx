import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
/**
 * Global  styles
 */
import "../../global_styles/global_styles.css";

import { HomeView } from "./views/homeView.tsx";
import { WelcomeView } from "./views/welcomeView.tsx";
import { ProjectListView } from "./views/projectListView.tsx";
import { SchemaListView } from "./views/schemaListView.tsx";
import { CreateProject } from "./views/createProjectView.tsx";
import { ProjectView } from "./views/projectView.tsx";
import { SchemaView } from "./views/schemaView.tsx";
import { CaptureView } from "./views/captureView.tsx";
import TabContext from "./context/Tab.tsx";
import UserContent from "../../shared/src/state/state.ts";
import PortContext from "./context/Port.tsx";

UserContent.init();

const router = createBrowserRouter([
  {
    path: "/action/index.html",
    element: <HomeView />,
  },
  {
    path: "/welcome",
    element: <WelcomeView />,
  },
  {
    path: "/project",
    element: <ProjectListView />,
  },
  {
    path: "/project/:projectId",
    element: <ProjectView />,
  },
  {
    path: "/capture/:captureId",
    element: <CaptureView />,
  },
  {
    path: "/project/create",
    element: <CreateProject />,
  },
  {
    path: "/schema",
    element: <SchemaListView />,
  },
  {
    path: "/schema/:schemaId",
    element: <SchemaView />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

function App() {
  // Get tab information from backend
  const [tab, setTab] = useState<chrome.tabs.Tab>(null);
  const [port, setPort] = useState<chrome.runtime.Port>();

  const tabRef = useRef(false);

  // Set up tab context
  useEffect(() => {
    if (!tabRef.current) {
      chrome.runtime
        .sendMessage({
          operation: "getCurrentTab",
          data: "",
        })
        .then((response: BackendResponse) => {
          setTab(response.data);
          tabRef.current = true;

          const port = chrome.tabs.connect(response?.data?.id ?? 0);
          setPort(port)

        })
        .catch(() => {});
    }
  }, []);

  return (
    <PortContext.Provider value={port}>
      <TabContext.Provider value={tab}>
        <RouterProvider router={router} />
      </TabContext.Provider>
    </PortContext.Provider>
  );
}
