import React from 'react'; // Don't forget to import React if you're using JSX
import { Routes, Route } from 'react-router-dom';

// Assuming these components are defined elsewhere
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // Or wherever it's located
import AppLayout from './layouts/AppLayout'; // Or Applayout if that's the name
import CanvasView from './views/CanvasView';
import KabanView from './views/KabanView'; // Corrected typo: Kaban
import StatisticsView from './views/StatisticsView';

const App = () => {
  return ( 
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<AuthPage/>} />

      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="canvas/:canvasId" element={<CanvasView />} />
        <Route path="kaban/:canvasId" element={<KabanView />} />
        <Route path="stats/:canvasId" element={<StatisticsView />} />
        <Route index element={<div>Welcome to the App! Choose a section.</div>} />
      </Route>

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default App; 