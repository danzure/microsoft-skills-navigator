import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificationPaths, CERT_STATUS, PILLARS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import Badge from '../common/Badge';
import SEO from '../common/SEO';
import { IconMap as Icons } from '../common/IconMap';
import './Dashboard.css';

/**
 * Dashboard Component
 * 
 * Provides an overview of the user's certification tracking progress.
 * Displays total statistics, an action center for active/expiring certs,
 * tracked paths, and an explore catalog for untracked paths.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { getOverallProgress, getPathProgress, getStatus, togglePathIgnored, isPathIgnored, isCertIgnored, customPlaylist, getAppliedSkillsProgress } = useProgressContext();
  const overall = useMemo(() => getOverallProgress(), [getOverallProgress]);
  const appliedSkillsStats = useMemo(() => getAppliedSkillsProgress(), [getAppliedSkillsProgress]);

  const { inProgressCerts, needsRenewalCerts } = useMemo(() => {
    const inProgress = [];
    const needsRenewal = [];
    const seenInProgress = new Set();
    const seenRenewal = new Set();

    certificationPaths.forEach(path => {
      path.certifications.forEach(cert => {
        const stat = getStatus(cert.id);
        if (stat === CERT_STATUS.IN_PROGRESS && !seenInProgress.has(cert.id)) {
          inProgress.push({ ...cert, pathName: path.shortName, pathColor: path.color, pathId: path.id });
          seenInProgress.add(cert.id);
        } else if (stat === CERT_STATUS.NEEDS_RENEWAL && !seenRenewal.has(cert.id)) {
          needsRenewal.push({ ...cert, pathName: path.shortName, pathColor: path.color, pathId: path.id });
          seenRenewal.add(cert.id);
        }
      });
    });

    return { inProgressCerts: inProgress, needsRenewalCerts: needsRenewal };
  }, [getStatus]);

  const trackedPaths = useMemo(() => certificationPaths.filter(p => !isPathIgnored(p.id)), [isPathIgnored]);
  const ignoredPaths = useMemo(() => certificationPaths.filter(p => isPathIgnored(p.id)), [isPathIgnored]);

  const individuallyTrackedCerts = useMemo(() => {
    const certs = [];
    const seen = new Set();
    
    // First, find all cert IDs that belong to a currently tracked path
    const certsInTrackedPaths = new Set();
    certificationPaths.forEach(path => {
      if (!isPathIgnored(path.id)) {
        path.certifications.forEach(c => certsInTrackedPaths.add(c.id));
      }
    });

    certificationPaths.forEach(path => {
      path.certifications.forEach(cert => {
        const isIndividuallyTracked = !isCertIgnored(cert.id);
        const stat = getStatus(cert.id);
        const hasProgress = stat === CERT_STATUS.COMPLETED || stat === CERT_STATUS.IN_PROGRESS || stat === CERT_STATUS.NEEDS_RENEWAL;

        // Must be tracked or have progress, NOT in a tracked path, and NOT seen yet
        if ((isIndividuallyTracked || hasProgress) && !certsInTrackedPaths.has(cert.id) && !seen.has(cert.id)) {
          certs.push({ ...cert, pathName: path.shortName, pathColor: path.color, pathId: path.id });
          seen.add(cert.id);
        }
      });
    });
    return certs;
  }, [isPathIgnored, isCertIgnored, getStatus]);
  
  const activeIgnoredPaths = useMemo(() => 
    [...ignoredPaths.filter(p => p.pillar !== PILLARS.RETIRED)]
      .sort((a, b) => (a.shortName || a.name).localeCompare(b.shortName || b.name)),
    [ignoredPaths]
  );
  const retiredIgnoredPaths = useMemo(() => 
    [...ignoredPaths.filter(p => p.pillar === PILLARS.RETIRED)]
      .sort((a, b) => (a.shortName || a.name).localeCompare(b.shortName || b.name)),
    [ignoredPaths]
  );

  const renderPathCard = (path, isIgnored, idx) => {
    const prog = getPathProgress(path.id);
    const Icon = Icons[path.icon] || Icons.Circle;
    
    return (
      <div
        key={path.id}
        className={`dashboard__path-card ${isIgnored ? 'dashboard__path-card--ignored' : ''}`}
        onClick={() => navigate(`/path/${path.id}`)}
        style={{
          '--card-color': path.color,
          animationDelay: `${idx * 50}ms`,
        }}
        id={`dashboard-path-${path.id}`}
      >
        <div className="dashboard__path-card-header">
          <div className="dashboard__path-icon-title">
            <div className="dashboard__path-icon">
              <Icon size={20} />
            </div>
            <div className="dashboard__path-title-group">
              <div className="dashboard__path-badge-stats">
                <Badge color={path.color} small>{path.pillar}</Badge>
                {path.id !== 'retired-exams' && (
                  <div className="dashboard__path-stats-mini">
                    <span title="Total Available Certifications"><Icons.Award size={12} /> {prog.total} exams</span>
                    {prog.completed > 0 && <span title="Completed"><Icons.CheckCircle2 size={12} /> {prog.completed}</span>}
                    {prog.inProgress > 0 && <span title="In Progress"><Icons.Clock size={12} /> {prog.inProgress}</span>}
                  </div>
                )}
              </div>
              <h2 className="dashboard__path-name">{path.shortName}</h2>
            </div>
          </div>
          {path.id !== 'retired-exams' && (
            <button
              className={`dashboard__path-toggle-btn ${isIgnored ? 'dashboard__path-toggle-btn--add' : 'dashboard__path-toggle-btn--remove'}`}
              onClick={(e) => {
                e.stopPropagation();
                togglePathIgnored(path.id);
              }}
              title={isIgnored ? "Track this path in My Learning" : "Remove path from My Learning"}
            >
              {isIgnored ? <Icons.Plus size={16} /> : <Icons.Minus size={16} />}
              <span className="sr-only">{isIgnored ? "Track" : "Remove"}</span>
            </button>
          )}
        </div>
        
        <div className="dashboard__path-card-body">
          <p className="dashboard__path-desc">{path.description}</p>
        </div>
        
        {!isIgnored && path.id !== 'retired-exams' && (
          <div className="dashboard__path-progress-container">
            <div 
              className="dashboard__path-progress-fill"
              style={{ width: `${prog.percent}%` }} 
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard" id="dashboard">
      <SEO
        title="Microsoft Skills Navigator & Certification Roadmap | atozazure"
        description="Interactive Microsoft Skills Navigator: visualize certification prerequisites on an interactive metro map, plan role-based career pathways, track exam completion dates, and manage annual renewals across 11 technology tracks."
        canonical="https://skills.atozazure.com/"
      />
      {/* Hero Overview Panel */}
      <div className="dashboard__hero">
        <div className="dashboard__hero-main">
          <h1 className="dashboard__title">Microsoft Skills Navigator & Certification Roadmap</h1>
          <p className="dashboard__subtitle">
            Your interactive guide to the Microsoft certification ecosystem. Visualize prerequisite paths on a metro-style map, build role-tailored career journeys, track exam completions and annual renewals, and budget with real-time exam pricing across {certificationPaths.length} technology paths.
          </p>
          <div className="dashboard__update-link">
            <a 
              href="https://techcommunity.microsoft.com/category/skills-hub/blog/skills-hub-blog" 
              target="_blank" 
              rel="noopener noreferrer"
              className="dashboard__update-btn"
            >
              <Icons.Microsoft size={16} />
              Skills & Certifications Updates
            </a>
            <a
              href="https://arch-center.azureedge.net/Credentials/Certification-Poster_en-us.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="dashboard__update-btn"
            >
              <Icons.Microsoft size={16} />
              Official Certification Poster
            </a>
            <button
              onClick={() => navigate('/applied-skills')}
              className="dashboard__update-btn dashboard__update-btn--applied"
            >
              <Icons.AppliedSkills size={16} />
              Applied Skills Hub ({appliedSkillsStats.completed}/{appliedSkillsStats.total})
            </button>
          </div>
        </div>
        
        <div className="dashboard__hero-overview">
          <div className="dashboard__hero-progress">
            <div className="dashboard__hero-progress-header">
              <span className="dashboard__hero-progress-label">Overall Progress</span>
              <span className="dashboard__hero-progress-percent">{overall.percent}%</span>
            </div>
            <div className="dashboard__hero-progress-track">
              <div className="dashboard__hero-progress-fill" style={{ width: `${overall.percent}%` }} />
            </div>
          </div>
          
          <div className="dashboard__hero-stats-row">
            <div className="dashboard__stat-mini">
              <div className="dashboard__stat-mini-icon"><Icons.Award size={18} /></div>
              <div className="dashboard__stat-mini-info">
                <span className="dashboard__stat-mini-value">{overall.total}</span>
                <span className="dashboard__stat-mini-label">Total Exams</span>
              </div>
            </div>
            <div className="dashboard__stat-mini dashboard__stat-mini--completed">
              <div className="dashboard__stat-mini-icon"><Icons.CheckCircle2 size={18} /></div>
              <div className="dashboard__stat-mini-info">
                <span className="dashboard__stat-mini-value">{overall.completed}</span>
                <span className="dashboard__stat-mini-label">Completed</span>
              </div>
            </div>
            <div className="dashboard__stat-mini dashboard__stat-mini--active">
              <div className="dashboard__stat-mini-icon"><Icons.Clock size={18} /></div>
              <div className="dashboard__stat-mini-info">
                <span className="dashboard__stat-mini-value">{overall.inProgress}</span>
                <span className="dashboard__stat-mini-label">In Progress</span>
              </div>
            </div>
            <div 
              className="dashboard__stat-mini dashboard__stat-mini--clickable"
              onClick={() => navigate('/applied-skills')}
              title="Open Applied Skills Hub"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/applied-skills');
                }
              }}
            >
              <div className="dashboard__stat-mini-icon"><Icons.AppliedSkills size={18} /></div>
              <div className="dashboard__stat-mini-info">
                <span className="dashboard__stat-mini-value">{appliedSkillsStats.completed}/{appliedSkillsStats.total}</span>
                <span className="dashboard__stat-mini-label">Applied Skills</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Center */}
      {(inProgressCerts.length > 0 || needsRenewalCerts.length > 0) && (
        <div className="dashboard__action-center">
          {needsRenewalCerts.length > 0 && (
            <div className="dashboard__activity-panel dashboard__activity-panel--warning">
              <h2 className="dashboard__activity-title">
                <Icons.AlertTriangle size={18} />
                Needs Renewal
                <span className="dashboard__activity-count">{needsRenewalCerts.length}</span>
              </h2>
              <div className="dashboard__activity-list">
                {needsRenewalCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="dashboard__activity-item"
                    onClick={() => navigate(`/path/${cert.pathId}`)}
                    style={{ '--cert-color': cert.pathColor }}
                  >
                    <div className="dashboard__activity-item-icon">
                      <Icons.AlertTriangle size={16} />
                    </div>
                    <div className="dashboard__activity-item-content">
                      <span className="dashboard__activity-item-name">{cert.name}</span>
                      <span className="dashboard__activity-item-code">{cert.examCode}</span>
                    </div>
                    <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
                    <Icons.ChevronRight size={16} className="dashboard__activity-item-chevron" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {inProgressCerts.length > 0 && (
            <div className="dashboard__activity-panel">
              <h2 className="dashboard__activity-title">
                <Icons.Clock size={18} />
                Continue Learning
                <span className="dashboard__activity-count">{inProgressCerts.length}</span>
              </h2>
              <div className="dashboard__activity-list">
                {inProgressCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="dashboard__activity-item"
                    onClick={() => navigate(`/path/${cert.pathId}`)}
                    style={{ '--cert-color': cert.pathColor }}
                  >
                    <div className="dashboard__activity-item-icon">
                      <Icons.BookOpen size={16} />
                    </div>
                    <div className="dashboard__activity-item-content">
                      <span className="dashboard__activity-item-name">{cert.name}</span>
                      <span className="dashboard__activity-item-code">{cert.examCode}</span>
                    </div>
                    <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
                    <Icons.ChevronRight size={16} className="dashboard__activity-item-chevron" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Tracked Learning */}
      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h2 className="dashboard__section-title">My Tracked Learning</h2>
        </div>
        
        {trackedPaths.length === 0 && individuallyTrackedCerts.length === 0 && (!customPlaylist || customPlaylist.length === 0) ? (
          <div className="dashboard__empty-state">
            <Icons.TrendingUp size={24} />
            <p>You aren't tracking any paths or individual exams yet. Explore the catalog below to start your journey.</p>
          </div>
        ) : (
          <>
            {(trackedPaths.length > 0 || (customPlaylist && customPlaylist.length > 0)) && (
              <div className="dashboard__paths-grid">
                {customPlaylist && customPlaylist.length > 0 && (
                  <div
                    className="dashboard__path-card"
                    onClick={() => navigate('/career-paths?role=custom')}
                    style={{ '--card-color': 'var(--colorBrandForeground1)' }}
                  >
                    <div className="dashboard__path-card-header">
                      <div className="dashboard__path-icon-title">
                        <div className="dashboard__path-icon">
                          <Icons.SettingsColor size={20} />
                        </div>
                        <div className="dashboard__path-title-group">
                          <div className="dashboard__path-badge-stats">
                            <Badge color="var(--colorBrandForeground1)" small>Custom Track</Badge>
                          </div>
                          <h2 className="dashboard__path-name">Your Custom Career</h2>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dashboard__path-card-body">
                      <p className="dashboard__path-desc">A personalized playlist of {customPlaylist.length} certifications tailored to your unique goals.</p>
                    </div>
                  </div>
                )}
                {trackedPaths.map((path, idx) => renderPathCard(path, false, idx))}
              </div>
            )}
            
            {individuallyTrackedCerts.length > 0 && (
              <div style={{ marginTop: (trackedPaths.length > 0 || (customPlaylist && customPlaylist.length > 0)) ? '24px' : '0' }}>
                <h3 className="dashboard__pillar-title" style={{ fontSize: '16px', marginBottom: '16px' }}>Individually Tracked Exams</h3>
                <div className="dashboard__activity-list">
                  {individuallyTrackedCerts.map((cert) => (
                    <div
                      key={cert.id}
                      className="dashboard__activity-item"
                      onClick={() => navigate(`/path/${cert.pathId}`)}
                      style={{ '--cert-color': cert.pathColor }}
                    >
                      <div className="dashboard__activity-item-icon">
                        <Icons.Award size={16} />
                      </div>
                      <div className="dashboard__activity-item-content">
                        <span className="dashboard__activity-item-name">{cert.name}</span>
                        <span className="dashboard__activity-item-code">{cert.examCode}</span>
                      </div>
                      <Badge color={cert.pathColor} small>{cert.pathName}</Badge>
                      <Icons.ChevronRight size={16} className="dashboard__activity-item-chevron" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Explore Catalog */}
      {ignoredPaths.length > 0 && (
        <div className="dashboard__section dashboard__section--explore">
          {activeIgnoredPaths.length > 0 && (
            <div className="dashboard__catalog-group">
              <div className="dashboard__section-header">
                <h2 className="dashboard__section-title">Explore Catalog</h2>
                <p className="dashboard__section-desc">Discover new certification paths, or pick and choose individual exams to add to your tracked learning.</p>
              </div>
              
              <div className="dashboard__paths-grid">
                {activeIgnoredPaths.map((path, idx) => renderPathCard(path, true, idx))}
              </div>
            </div>
          )}

          {retiredIgnoredPaths.length > 0 && (
            <div className="dashboard__catalog-group" style={{ marginTop: activeIgnoredPaths.length > 0 ? '40px' : '0' }}>
              <div className="dashboard__section-header">
                <h2 className="dashboard__section-title">Retired Certifications</h2>
                <p className="dashboard__section-desc">Historically retired or soon-to-be retired certifications.</p>
              </div>
              
              <div className="dashboard__paths-grid">
                {retiredIgnoredPaths.map((path, idx) => renderPathCard(path, true, idx))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
