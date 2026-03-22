import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import OnboardingWizard from './components/OnboardingWizard';
import RoadmapReview from './components/RoadmapReview';
import NewHireView from './components/NewHireView';
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
    ],
  },
]);