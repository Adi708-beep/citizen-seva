import type { ReactNode } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DemoApplicationPage from './pages/DemoApplicationPage';
import FeatureLabPage from './pages/FeatureLabPage';
import NotificationsPage from './pages/NotificationsPage';
import DashboardLayout from './components/layouts/DashboardLayout';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Landing',
    path: '/',
    element: <LandingPage />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
  },
  {
    name: 'Admin Login',
    path: '/admin-login',
    element: <AdminLoginPage />,
  },
  {
    name: 'Profile Setup',
    path: '/profile-setup',
    element: <ProfileSetupPage />,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    ),
  },
  {
    name: 'Schemes',
    path: '/schemes',
    element: (
      <DashboardLayout>
        <SchemesPage />
      </DashboardLayout>
    ),
  },
  {
    name: 'Scheme Detail',
    path: '/schemes/:id',
    element: (
      <DashboardLayout>
        <SchemeDetailPage />
      </DashboardLayout>
    ),
  },
  {
    name: 'Chat',
    path: '/chat',
    element: (
      <DashboardLayout>
        <ChatPage />
      </DashboardLayout>
    ),
  },
  {
    name: 'Notifications',
    path: '/notifications',
    element: (
      <DashboardLayout>
        <NotificationsPage />
      </DashboardLayout>
    ),
  },
  {
    name: 'Profile',
    path: '/profile',
    element: (
      <DashboardLayout>
        <ProfilePage />
      </DashboardLayout>
    ),
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: (
      <DashboardLayout>
        <AdminDashboardPage />
      </DashboardLayout>
    ),
  },
  {
    name: 'Demo Application',
    path: '/demo-application',
    element: <DemoApplicationPage />,
  },
  {
    name: 'Feature Lab',
    path: '/feature-lab',
    element: <FeatureLabPage />,
  },
];

export default routes;
