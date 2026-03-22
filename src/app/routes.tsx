import { createBrowserRouter, Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import Layout from './components/Layout';
import OnboardingWizard from './components/OnboardingWizard';
import RoadmapReview from './components/RoadmapReview';
import NewHireView from './components/NewHireView';
import NotificationsPage from './components/NotificationsPage';
import HelpPage from './components/HelpPage';
import TemplateBuilder from './components/TemplateBuilder';
import ManagerOnboarding from './components/ManagerOnboarding';
import { AppProvider, useApp } from './context/AppContext';

function GuardedLayout() {
  const { hasCompletedOnboarding } = useApp();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      navigate('/welcome', { replace: true });
    }
  }, [hasCompletedOnboarding, navigate]);

  if (!hasCompletedOnboarding) return null;
  
  return <Layout />;
}

function Root() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: '',
        Component: GuardedLayout,
        children: [
          { index: true, Component: OnboardingWizard },
          { path: 'roadmap', Component: RoadmapReview },
          { path: 'new-hire', Component: NewHireView },
          { path: 'notifications', Component: NotificationsPage },
          { path: 'help', Component: HelpPage },
          { path: 'templates/new', Component: TemplateBuilder },
        ],
      },
      {
        path: 'welcome',
        Component: ManagerOnboarding,
      }
    ],
  },
]);