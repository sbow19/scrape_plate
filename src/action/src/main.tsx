import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter,  RouterProvider} from "react-router";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
  },
  {
    path: '/welcome',
    element: <WelcomeView />
  },
  {
    path: '/project',
    element: <ProjectListView/>
  },
  {
    path: '/project/:projectId',
    element: <ProjectView/>
  },
  {
    path: '/capture/:captureId',
    element: <CaptureView/>
  },
  {
    path: '/project/create',
    element: <CreateProject/>
  },
  {
    path: '/schema',
    element: <SchemaListView/>
  },
  {
    path: '/schema/:schemaId',
    element: <SchemaView/>
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>
);
