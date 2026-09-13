import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  FluentProvider,
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import { customLightTheme, customDarkTheme } from './theme/fluentTheme';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import { CommandPalette, DataModal } from './components/common';
import { useState, Suspense, lazy, useEffect } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const PathMap = lazy(() => import('./components/PathMap/PathMap'));
const CareerPathBuilder = lazy(() => import('./components/CareerPathBuilder/CareerPathBuilder'));
const AppliedSkills = lazy(() => import('./components/AppliedSkills/AppliedSkills'));

const useStyles = makeStyles({
  app: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  appBody: {
    display: 'flex',
    flexGrow: 1,
    paddingTop: 'var(--header-height, 48px)',
  },
  appContent: {
    flexGrow: 1,
    marginLeft: 'var(--sidebar-width, 280px)',
    height: 'calc(100vh - var(--header-height, 48px))',
    overflowY: 'scroll',
    overflowX: 'hidden',
    transitionProperty: 'margin-left',
    transitionDuration: '250ms',
    transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
    '@media (max-width: 768px)': {
      marginLeft: 0,
      paddingBottom: 'var(--safe-area-bottom, 0px)',
      WebkitOverflowScrolling: 'touch',
    },
  },
  appContentCollapsed: {
    marginLeft: 'var(--sidebar-collapsed, 64px)',
    '@media (max-width: 768px)': {
      marginLeft: 0,
    },
  },
  loadingSkeleton: {
    ...shorthands.padding(tokens.spacingVerticalXXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    animationDuration: '300ms',
    animationTimingFunction: 'ease-out',
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
  skeletonBar: {
    height: '20px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    background: `linear-gradient(90deg, ${tokens.colorNeutralBackground4} 25%, ${tokens.colorNeutralBackground3} 50%, ${tokens.colorNeutralBackground4} 75%)`,
    backgroundSize: '200% 100%',
    animationDuration: '1.8s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationName: {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' },
    },
  },
  skeletonBarWide: {
    width: '40%',
    height: '28px',
  },
  skeletonBarMedium: {
    width: '60%',
    height: '16px',
    opacity: 0.6,
  },
  skeletonRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalL,
    marginTop: tokens.spacingVerticalS,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  skeletonCard: {
    height: '160px',
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    background: `linear-gradient(90deg, ${tokens.colorNeutralBackground4} 25%, ${tokens.colorNeutralBackground3} 50%, ${tokens.colorNeutralBackground4} 75%)`,
    backgroundSize: '200% 100%',
    animationDuration: '1.8s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationName: {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' },
    },
  },
});

/**
 * Loading fallback skeleton component
 */
function LoadingSkeleton() {
  const styles = useStyles();
  return (
    <div className={styles.loadingSkeleton}>
      <div className={mergeClasses(styles.skeletonBar, styles.skeletonBarWide)} />
      <div className={mergeClasses(styles.skeletonBar, styles.skeletonBarMedium)} />
      <div className={styles.skeletonRow}>
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} style={{ animationDelay: '0.15s' }} />
        <div className={styles.skeletonCard} style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}

/**
 * ThemedFluentProvider Component
 * Synchronizes the Fluent UI v9 FluentProvider theme with the application's ThemeContext.
 */
function ThemedFluentProvider({ children }) {
  const { isDark } = useTheme();
  return (
    <FluentProvider
      theme={isDark ? customDarkTheme : customLightTheme}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {children}
    </FluentProvider>
  );
}

/**
 * Inner App Layout component with hooks and styles
 */
function AppLayout() {
  const styles = useStyles();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);

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
    <div className={styles.app}>
      <Header
        onToggleSidebar={toggleSidebar}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenDataModal={() => setDataModalOpen(true)}
      />
      <div className={styles.appBody}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />
        <main
          className={mergeClasses(
            styles.appContent,
            !sidebarOpen && styles.appContentCollapsed
          )}
          id="main-content"
        >
          <Suspense fallback={<LoadingSkeleton />}>
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
      <CommandPalette
        isOpen={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenDataModal={() => setDataModalOpen(true)}
        onToggleSidebar={toggleSidebar}
      />
      <DataModal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
      />
    </div>
  );
}

/**
 * Main application component.
 * Sets up global routing, theme, FluentProvider, and progress contexts.
 * Uses lazy loading for main route components to optimize bundle size.
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ThemedFluentProvider>
          <CurrencyProvider>
            <ProgressProvider>
              <ToastProvider>
                <AppLayout />
              </ToastProvider>
            </ProgressProvider>
          </CurrencyProvider>
        </ThemedFluentProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
