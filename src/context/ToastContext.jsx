import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import Toast from '../components/common/Toast';

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    bottom: tokens.spacingVerticalXL,
    right: tokens.spacingHorizontalXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    zIndex: 600,
    pointerEvents: 'none',
  },
});

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const styles = useStyles();
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', options = {}) => {
    const id = Date.now().toString() + Math.random().toString();
    const duration = options.duration || (options.action ? 6000 : 3000);

    setToasts((prev) => [...prev, { id, message, type, action: options.action }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className={styles.container}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            action={toast.action}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
