import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { AppLayout } from "./pages/AppLayout";
import { CanvasView } from "./view/CanvasView";
import { KabanView } from "./view/KabanView";
import { StatisticsView } from "./view/StatisticsView";
import ProtectedRoute from "./components/protectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PublicLayout } from "./pages/PublicLayout";
import { DemoPage } from "./pages/DemoPage";
import { AboutPage } from "./pages/About";
import { NotFoundPage } from "./pages/PageNotFound";
import { AppIndexRedirect } from "./components/AppIndexRedirect";
import { ReactFlowProvider } from "reactflow";
import { JoinCanvasPage } from "./pages/JoinCanvasPage";
import { LayoutProvider } from "./context/LayoutContext";
const App = () => {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LayoutProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/login" element={<AuthPage />} />
            </Route>
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout/>
                </ProtectedRoute>
              }
            >
              <Route index element={<AppIndexRedirect />} />
              <Route
                path="/app/canvas/:_id"
                element={
                  <ReactFlowProvider>
                    <CanvasView />
                  </ReactFlowProvider>
                }
              />
              <Route path="kanban/:_id" element={<KabanView />} />
              <Route path="stats/:_id" element={<StatisticsView />} />
            </Route>
            <Route
              path="/join/:_id/:inviteToken"
              element={<JoinCanvasPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LayoutProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
