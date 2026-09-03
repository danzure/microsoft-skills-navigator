import { useState, useCallback, useEffect, useMemo } from 'react';
import { CERT_STATUS, certificationPaths, doesCertExpire, getCertById, getPathById } from '../data/certificationPaths';
import { isRetiring, isRetired } from '../utils/helpers';

const STORAGE_KEY = 'ms-cert-tracker-progress';
const IGNORED_STORAGE_KEY = 'ms-cert-tracker-ignored';
const TRACKED_CERTS_STORAGE_KEY = 'ms-cert-tracker-tracked-certs';
const DISMISSED_CERTS_KEY = 'ms-cert-tracker-dismissed-certs';
const DATES_KEY = 'ms-cert-tracker-dates';
const CUSTOM_PLAYLIST_KEY = 'ms-cert-tracker-custom-playlist';

const getDefaultTrackedPaths = () => [];

const getDefaultTrackedCerts = () => [];

const loadData = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
};

/**
 * Custom hook to manage user's certification progress and tracking states.
 * Handles persistence to localStorage and provides state manipulation methods.
 * 
 * @returns {Object} Progress state, tracking lists, and mutation functions
 */
export const useProgress = () => {
  const [progress, setProgress] = useState(() => loadData(STORAGE_KEY, {}));
  const [trackedPaths, setTrackedPaths] = useState(() => {
    const storedTracked = localStorage.getItem('ms-cert-tracker-tracked-paths');
    if (storedTracked) {
      try { return JSON.parse(storedTracked); } catch { /* ignore */ }
    }
    
    const storedIgnored = localStorage.getItem(IGNORED_STORAGE_KEY);
    if (storedIgnored) {
      try {
        const ignored = JSON.parse(storedIgnored);
        return certificationPaths.filter(p => !ignored.includes(p.id)).map(p => p.id);
      } catch { /* ignore */ }
    }
    return getDefaultTrackedPaths();
  });
  const [trackedCerts, setTrackedCerts] = useState(() => {
    const stored = localStorage.getItem(TRACKED_CERTS_STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    return getDefaultTrackedCerts();
  });
  const [dismissedCerts, setDismissedCerts] = useState(() => loadData(DISMISSED_CERTS_KEY, []));
  const [completionDates, setCompletionDates] = useState(() => loadData(DATES_KEY, {}));
  const [customPlaylist, setCustomPlaylist] = useState(() => loadData(CUSTOM_PLAYLIST_KEY, []));

  useEffect(() => {
    saveData(STORAGE_KEY, progress);
  }, [progress]);

  useEffect(() => {
    saveData('ms-cert-tracker-tracked-paths', trackedPaths);
  }, [trackedPaths]);

  useEffect(() => {
    saveData(TRACKED_CERTS_STORAGE_KEY, trackedCerts);
  }, [trackedCerts]);

  useEffect(() => {
    saveData(DISMISSED_CERTS_KEY, dismissedCerts);
  }, [dismissedCerts]);

  useEffect(() => {
    saveData(DATES_KEY, completionDates);
  }, [completionDates]);

  useEffect(() => {
    saveData(CUSTOM_PLAYLIST_KEY, customPlaylist);
  }, [customPlaylist]);

  const getStatus = useCallback(
    (certId) => {
      const baseStatus = progress[certId] || CERT_STATUS.NOT_STARTED;
      if (baseStatus === CERT_STATUS.COMPLETED) {
        const certLevel = getCertById(certId)?.cert?.level;
        if (doesCertExpire(certLevel)) {
          const completedDate = completionDates[certId];
          if (completedDate) {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (new Date(completedDate) < oneYearAgo) {
              return CERT_STATUS.NEEDS_RENEWAL;
            }
          }
        }
      }
      return baseStatus;
    },
    [progress, completionDates]
  );

  const setStatus = useCallback((certId, status, dateStr = null) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (status === CERT_STATUS.NOT_STARTED) {
        delete next[certId];
      } else {
        next[certId] = status;
      }
      return next;
    });

    // Auto-track cert when starting or passing
    if (status === CERT_STATUS.IN_PROGRESS || status === CERT_STATUS.COMPLETED) {
      setTrackedCerts((prev) => (prev.includes(certId) ? prev : [...prev, certId]));
    }

    if (status === CERT_STATUS.COMPLETED) {
      setCompletionDates(prev => ({ ...prev, [certId]: dateStr || new Date().toISOString() }));
    } else if (status === CERT_STATUS.NOT_STARTED) {
      setCompletionDates(prev => {
        const next = { ...prev };
        delete next[certId];
        return next;
      });
    }
  }, []);

  const setCompletionDate = useCallback((certId, dateStr) => {
    setCompletionDates(prev => ({ ...prev, [certId]: dateStr }));
  }, []);

  const cycleStatus = useCallback(
    (certId) => {
      const current = getStatus(certId);
      const nextMap = {
        [CERT_STATUS.NOT_STARTED]: CERT_STATUS.IN_PROGRESS,
        [CERT_STATUS.IN_PROGRESS]: CERT_STATUS.COMPLETED,
        [CERT_STATUS.COMPLETED]: CERT_STATUS.NOT_STARTED,
        [CERT_STATUS.NEEDS_RENEWAL]: CERT_STATUS.COMPLETED, // Cycle back to completed (renews)
      };
      setStatus(certId, nextMap[current]);
    },
    [getStatus, setStatus]
  );

  const togglePathIgnored = useCallback((pathId) => {
    const isCurrentlyTracked = trackedPaths.includes(pathId);
    
    if (isCurrentlyTracked) {
      setTrackedPaths((prev) => prev.filter(id => id !== pathId));
      
      // Untrack all certs within this path, unless they belong to another currently tracked path or have progress
      const path = getPathById(pathId);
      if (path) {
        const certIds = path.certifications.map(c => c.id);
        setTrackedCerts(prevCerts => prevCerts.filter(id => {
          if (certIds.includes(id)) {
            const hasProgress = progress[id] === CERT_STATUS.COMPLETED || progress[id] === CERT_STATUS.IN_PROGRESS;
            if (hasProgress) return true;

            const otherTrackedPaths = trackedPaths.filter(pId => pId !== pathId);
            const isShared = otherTrackedPaths.some(pId => {
              const otherPath = getPathById(pId);
              return otherPath?.certifications.some(c => c.id === id);
            });
            return isShared;
          }
          return true;
        }));
      }
    } else {
      setTrackedPaths((prev) => [...prev, pathId]);
      
      // Automatically track all certs within this path
      const path = getPathById(pathId);
      if (path) {
        const certIds = path.certifications.map(c => c.id);
        setTrackedCerts(prevCerts => {
          const nextCerts = [...prevCerts];
          certIds.forEach(id => {
            if (!nextCerts.includes(id)) {
              nextCerts.push(id);
            }
          });
          return nextCerts;
        });
      }
    }
  }, [trackedPaths, progress]);

  const isPathIgnored = useCallback((pathId) => {
    return !trackedPaths.includes(pathId);
  }, [trackedPaths]);

  const toggleCertIgnored = useCallback((certId) => {
    setTrackedCerts((prev) =>
      prev.includes(certId) ? prev.filter(id => id !== certId) : [...prev, certId]
    );
  }, []);

  const isCertIgnored = useCallback((certId) => {
    return !trackedCerts.includes(certId);
  }, [trackedCerts]);

  const toggleCertDismissed = useCallback((certId) => {
    setDismissedCerts((prev) =>
      prev.includes(certId) ? prev.filter(id => id !== certId) : [...prev, certId]
    );
  }, []);

  const isCertDismissed = useCallback((certId) => {
    return dismissedCerts.includes(certId);
  }, [dismissedCerts]);

  const pathProgressMap = useMemo(() => {
    const map = new Map();
    const trackedPathsSet = new Set(trackedPaths);

    certificationPaths.forEach((path) => {
      const isTracked = trackedPathsSet.has(path.id);
      let total = 0;
      let completed = 0;
      let inProgress = 0;

      path.certifications.forEach((c) => {
        const stat = getStatus(c.id);
        const hasProgress =
          stat === CERT_STATUS.COMPLETED ||
          stat === CERT_STATUS.NEEDS_RENEWAL ||
          stat === CERT_STATUS.IN_PROGRESS;

        if ((isRetiring(c) || isRetired(c)) && !hasProgress) {
          return;
        }

        total++;
        if (stat === CERT_STATUS.COMPLETED || stat === CERT_STATUS.NEEDS_RENEWAL) {
          completed++;
        } else if (stat === CERT_STATUS.IN_PROGRESS) {
          inProgress++;
        }
      });

      map.set(path.id, {
        total,
        completed,
        inProgress,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        isTracked,
      });
    });

    return map;
  }, [trackedPaths, getStatus]);

  const getPathProgress = useCallback(
    (pathId) => {
      return (
        pathProgressMap.get(pathId) || {
          total: 0,
          completed: 0,
          inProgress: 0,
          percent: 0,
          isTracked: false,
        }
      );
    },
    [pathProgressMap]
  );

  const getOverallProgress = useCallback(() => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    const processedCerts = new Set();
    const trackedPathsSet = new Set(trackedPaths);
    const trackedCertsSet = new Set(trackedCerts);

    certificationPaths.forEach((path) => {
      const isPathTracked = trackedPathsSet.has(path.id);

      path.certifications.forEach((cert) => {
        if (processedCerts.has(cert.id)) return;

        const stat = getStatus(cert.id);
        const hasProgress =
          stat === CERT_STATUS.COMPLETED ||
          stat === CERT_STATUS.NEEDS_RENEWAL ||
          stat === CERT_STATUS.IN_PROGRESS;
        const isIndividuallyTracked = trackedCertsSet.has(cert.id);

        const shouldInclude =
          (isPathTracked && isIndividuallyTracked) ||
          (!isPathTracked && (isIndividuallyTracked || hasProgress));

        if (!shouldInclude) return;

        if ((isRetiring(cert) || isRetired(cert)) && !hasProgress) {
          return;
        }

        processedCerts.add(cert.id);
        total++;
        if (stat === CERT_STATUS.COMPLETED || stat === CERT_STATUS.NEEDS_RENEWAL) {
          completed++;
        } else if (stat === CERT_STATUS.IN_PROGRESS) {
          inProgress++;
        }
      });
    });

    return {
      total,
      completed,
      inProgress,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      trackedPathsCount: trackedPaths.length,
      trackedCertsCount: processedCerts.size,
    };
  }, [trackedPaths, trackedCerts, getStatus]);

  const resetAll = useCallback(() => {
    setProgress({});
    setTrackedPaths(getDefaultTrackedPaths());
    setTrackedCerts(getDefaultTrackedCerts());
    setDismissedCerts([]);
    setCompletionDates({});
    setCustomPlaylist([]);
    try {
      localStorage.removeItem(IGNORED_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const exportProgressJSON = useCallback(() => {
    const data = {
      app: 'ms-cert-tracker',
      version: '1.8.2',
      exportedAt: new Date().toISOString(),
      progress,
      trackedPaths,
      trackedCerts,
      dismissedCerts,
      completionDates,
      customPlaylist,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ms-certification-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [progress, trackedPaths, trackedCerts, dismissedCerts, completionDates, customPlaylist]);

  const importProgressJSON = useCallback((jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid backup file format');
      }

      if (data.progress && typeof data.progress === 'object') {
        setProgress(data.progress);
      }
      if (Array.isArray(data.trackedPaths)) {
        setTrackedPaths(data.trackedPaths);
      }
      if (Array.isArray(data.trackedCerts)) {
        setTrackedCerts(data.trackedCerts);
      }
      if (Array.isArray(data.dismissedCerts)) {
        setDismissedCerts(data.dismissedCerts);
      }
      if (data.completionDates && typeof data.completionDates === 'object') {
        setCompletionDates(data.completionDates);
      }
      if (Array.isArray(data.customPlaylist)) {
        setCustomPlaylist(data.customPlaylist);
      }

      return { success: true };
    } catch (err) {
      console.error('Failed to import backup:', err);
      return { success: false, error: err.message };
    }
  }, []);

  return useMemo(
    () => ({
      progress,
      trackedPaths,
      trackedCerts,
      dismissedCerts,
      getStatus,
      setStatus,
      cycleStatus,
      getPathProgress,
      getOverallProgress,
      togglePathIgnored,
      isPathIgnored,
      toggleCertIgnored,
      isCertIgnored,
      toggleCertDismissed,
      isCertDismissed,
      resetAll,
      exportProgressJSON,
      importProgressJSON,
      completionDates,
      setCompletionDate,
      customPlaylist,
      setCustomPlaylist,
    }),
    [
      progress,
      trackedPaths,
      trackedCerts,
      dismissedCerts,
      getStatus,
      setStatus,
      cycleStatus,
      getPathProgress,
      getOverallProgress,
      togglePathIgnored,
      isPathIgnored,
      toggleCertIgnored,
      isCertIgnored,
      toggleCertDismissed,
      isCertDismissed,
      resetAll,
      exportProgressJSON,
      importProgressJSON,
      completionDates,
      setCompletionDate,
      customPlaylist,
      setCustomPlaylist,
    ]
  );
};
