import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import { useState, Suspense, lazy, useEffect } from 'react';
import './App.css';

const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const PathMap = lazy(() => import('./components/PathMap/PathMap'));
const CareerPathBuilder = lazy(() => import('./components/CareerPathBuilder/CareerPathBuilder'));
const AppliedSkills = lazy(() => import('./components/AppliedSkills/AppliedSkills'));

/**
 * Main application component.
 * Sets up global routing, theme, and progress contexts.
 * Uses lazy loading for main route components to optimize bundle size.
 */
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <CurrencyProvider>
          <ProgressProvider>
            <ToastProvider>
              <div className="app">
                <Header onToggleSidebar={toggleSidebar} />
              <div className={`app__body ${sidebarOpen ? '' : 'app__body--collapsed'}`}>
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />
              <main className="app__content" id="main-content">
                <Suspense fallback={
                  <div className="loading-skeleton">
                    <div className="loading-skeleton__bar loading-skeleton__bar--wide" />
                    <div className="loading-skeleton__bar loading-skeleton__bar--medium" />
                    <div className="loading-skeleton__row">
                      <div className="loading-skeleton__card" />
                      <div className="loading-skeleton__card" />
                      <div className="loading-skeleton__card" />
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/career-paths" element={<CareerPathBuilder />} />
                    <Route path="/applied-skills" element={<AppliedSkills />} />
                    <Route path="/path/:pathId" element={<PathMap />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </div>
            </ToastProvider>
          </ProgressProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
