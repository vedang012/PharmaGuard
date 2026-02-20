import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import AnalysisPage from './pages/AnalysisPage';
import DocsPage from './pages/DocsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: 'analyze', element: <AnalysisPage /> },
            { path: 'docs', element: <DocsPage /> },
        ],
    },
]);
