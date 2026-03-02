import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/pages/dashboard";
import { ExerciseLibrary } from "./components/pages/exercise-library";
import { TemplatesList } from "./components/pages/templates-list";
import { TemplateDetail } from "./components/pages/template-detail";
import { StartWorkout } from "./components/pages/start-workout";
import { LiveSession } from "./components/pages/live-session";
import { History } from "./components/pages/history";
import { SessionDetail } from "./components/pages/session-detail";
import { Analytics } from "./components/pages/analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "exercises", Component: ExerciseLibrary },
      { path: "templates", Component: TemplatesList },
      { path: "templates/:id", Component: TemplateDetail },
      { path: "start-workout", Component: StartWorkout },
      { path: "session/:id", Component: LiveSession },
      { path: "history", Component: History },
      { path: "history/:id", Component: SessionDetail },
      { path: "analytics", Component: Analytics },
    ],
  },
]);
