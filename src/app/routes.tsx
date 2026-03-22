import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import OnboardingWizard from './components/OnboardingWizard';
import RoadmapReview from './components/RoadmapReview';
import NewHireView from './components/NewHireView';
import NotificationsPage from './components/NotificationsPage';
import HelpPage from './components/HelpPage';
import TemplateBuilder from './components/TemplateBuilder';
import { AppProvider } from './context/AppContext';

function Root() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: OnboardingWizard },
      { path: 'roadmap', Component: RoadmapReview },
      { path: 'new-hire', Component: NewHireView },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'help', Component: HelpPage },
      { path: 'templates/new', Component: TemplateBuilder },
    ],
  },
]);