import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlanProvider } from '@/contexts/PlanContext';
import { RouteGuard } from '@/components/common/RouteGuard';

import routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <PlanProvider>
          <RouteGuard>
            <IntersectObserver />
            <div className="flex min-h-screen flex-col">
              <main className="flex-grow">
                <Routes>
                  {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </RouteGuard>
        </PlanProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
