import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
const PortfolioPage = lazy(() => import('./PortfolioPage'));
const isPortfolio = window.location.pathname.replace(/\/$/, '') === '/portfolio';
const page = isPortfolio ? <Suspense fallback={<div className="route-loading"/>}><PortfolioPage/></Suspense> : <App/>;
createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
