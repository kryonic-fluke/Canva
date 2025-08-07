import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
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
import { ReactFlowProvider } from "reactflow";
const App = () => {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* All of these routes will share the PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/demo" element={<DemoPage />} />
          </Route>

          <Route path="/login" element={<AuthPage />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="canvas/123" replace />} />
            <Route
              path="canvas/:canvasId"
              element={
                <ReactFlowProvider>
                  <CanvasView />
                </ReactFlowProvider>
              }
            />
            <Route path="kanban/:canvasId" element={<KabanView />} />
            <Route path="stats/:canvasId" element={<StatisticsView />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
