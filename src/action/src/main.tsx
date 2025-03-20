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
    path: '/projects',
    element: <ProjectListView/>
  },
  {
    path: '/projects/:projectId',
    element: <ProjectView/>
  },
  {
    path: '/projects/create',
    element: <CreateProject/>
  },
  {
    path: '/schemas',
    element: <SchemaListView/>
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>
);
