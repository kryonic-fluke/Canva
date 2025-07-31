import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { AppLayout } from './pages/AppLayout';
import { CanvasView } from './view/CanvasView';
import { KabanView } from './view/KabanView';
import { StatisticsView } from './view/StatisticsView';
import ProtectedRoute from './components/protectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {

  const queryClient = new QueryClient();
  return ( 
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>

    <Routes>
            <Route path="/" element={<HomePage />} />

      <Route path='/login' element={<AuthPage/>} />
      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout/>
        </ProtectedRoute>
      }>
        <Route path="canvas/:canvasId" element={<CanvasView/>} />
        <Route path="kaban/:canvasId" element={<KabanView />} />
        <Route path="stats/:canvasId" element={<StatisticsView/>} />
   <Route index element={<Navigate to="canvas/123" replace />} />      </Route>

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
        </QueryClientProvider>
        </BrowserRouter>
  );
};

export default App; 