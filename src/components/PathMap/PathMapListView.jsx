import { useMemo } from 'react';
import { getCertById, getCertificationsRequiring, CERT_LEVELS, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { isRetiring, isRetired, getBadgeUrl } from '../../utils/helpers';
import Badge from '../common/Badge';
import { IconMap as Icons } from '../common/IconMap';

/**
 * PathMapListView Component
 * Renders the responsive list view for certification paths, organized by foundational,
 * pathway/branch, and advanced credentials with filtering and status controls.
 */
const PathMapListView = ({ path, onSelectCert, selectedBranch = 'all', statusFilter = 'all', onClearFilters }) => {
  const { getStatus, setStatus, isCertIgnored, toggleCertIgnored } = useProgressContext();
  const { addToast } = useToast();

  const handleSetStatus = (cert, newStatus, e) => {
    e.stopPropagation();
    setStatus(cert.id, newStatus);
    if (newStatus === CERT_STATUS.COMPLETED) {
      const requiring = getCertificationsRequiring(cert.id);
      if (requiring?.length > 0) {
        const nextCert = requiring.find(c => getStatus(c.id) === CERT_STATUS.NOT_STARTED);
        if (nextCert) {
          addToast(`🎉 You've unlocked ${nextCert.examCode}!`, 'success', {
            action: {
              label: 'Start it',
              onClick: () => {
                setStatus(nextCert.id, CERT_STATUS.IN_PROGRESS);
                addToast(`${nextCert.examCode} marked as In Progress`, 'info');
              }
            }
          });
          return;
        }
      }
      addToast(`${cert.examCode} marked as Passed`, 'success');
    } else if (newStatus === CERT_STATUS.IN_PROGRESS) {
      addToast(`${cert.examCode} marked as In Progress`, 'info');
    } else if (newStatus === CERT_STATUS.NOT_STARTED) {
      addToast(`${cert.examCode} marked as Not Started`, 'info');
    }
  };

  const sections = useMemo(() => {
    if (!path?.certifications) return [];
    let list = [];
    const trunkFundamentals = path.certifications.filter(c => !c.branch && c.level === CERT_LEVELS.FUNDAMENTALS);
    if (trunkFundamentals.length > 0) {
      list.push({
        id: 'fundamentals',
        branchId: 'fundamentals',
        title: 'Foundational Credentials',
        description: 'Recommended entry points providing fundamental architectural and platform knowledge.',
        certs: trunkFundamentals,
      });
    }

    if (path.branches?.length > 0) {
      path.branches.forEach(branch => {
        const branchCerts = path.certifications.filter(c => c.branch === branch.id);
        if (branchCerts.length > 0) {
          list.push({
            id: `branch-${branch.id}`,
            branchId: branch.id,
            title: `${branch.name} Pathway`,
            description: branch.description,
            certs: branchCerts,
          });
        }
      });
    }

    const trunkBottom = path.certifications.filter(c => !c.branch && c.level !== CERT_LEVELS.FUNDAMENTALS);
    if (trunkBottom.length > 0) {
      list.push({
        id: 'advanced',
        branchId: 'advanced',
        title: 'Specialty & Expert Level',
        description: 'Advanced role-based credentials for architects and domain specialists.',
        certs: trunkBottom,
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'all',
        branchId: 'all',
        title: 'All Certifications',
        description: '',
        certs: path.certifications,
      });
    }

    if (selectedBranch !== 'all') {
      list = list.filter(s => s.branchId === selectedBranch);
    }

    if (statusFilter !== 'all') {
      list = list.map(s => ({
        ...s,
        certs: s.certs.filter(c => {
          const sStatus = getStatus(c.id);
          if (statusFilter === 'completed') return sStatus === CERT_STATUS.COMPLETED;
          if (statusFilter === 'in_progress') return sStatus === CERT_STATUS.IN_PROGRESS;
          if (statusFilter === 'not_started') return sStatus === CERT_STATUS.NOT_STARTED;
          return true;
        })
      })).filter(s => s.certs.length > 0);
    }

    return list;
  }, [path, selectedBranch, statusFilter, getStatus]);

  return (
    <div className="path-map__list-view" id="path-list-view">
      {sections.length === 0 && (
        <div className="path-map__list-empty">
          <p>No certifications match your current filters.</p>
          <button onClick={onClearFilters}>Clear all filters</button>
        </div>
      )}
      {sections.map(section => (
        <div key={section.id} className="path-map__list-section">
          <div className="path-map__list-section-header">
            <h2 className="path-map__list-section-title">{section.title}</h2>
            {section.description && (
              <p className="path-map__list-section-desc">{section.description}</p>
            )}
          </div>
          <div className="path-map__list-cards">
            {section.certs.map(cert => {
              const status = getStatus(cert.id);
              const retiring = isRetiring(cert);
              const retired = isRetired(cert);
              const isRetiredExam = retiring || retired;
              const isTracked = !isCertIgnored(cert.id);
              const badgeUrl = getBadgeUrl(cert.level, cert.id);

              return (
                <div
                  key={cert.id}
                  className={`path-map__list-card ${status === CERT_STATUS.COMPLETED ? 'path-map__list-card--completed' : ''} ${status === CERT_STATUS.IN_PROGRESS ? 'path-map__list-card--in-progress' : ''}`}
                  onClick={() => onSelectCert(cert)}
                  style={{ '--card-color': path.color }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectCert(cert)}
                >
                  <div className="path-map__list-card-header">
                    <div className="path-map__list-card-badge">
                      {badgeUrl ? (
                        <img src={badgeUrl} alt={`${cert.examCode} badge`} loading="lazy" />
                      ) : (
                        <Icons.Award size={24} />
                      )}
                    </div>
                    <div className="path-map__list-card-title-group">
                      <div className="path-map__list-card-code-row">
                        <span className="path-map__list-card-code">{cert.examCode}</span>
                        <Badge variant={cert.level.toLowerCase()} small>{cert.level}</Badge>
                        {retiring && <Badge variant="retiring" small><Icons.AlertTriangle size={9} />Retiring</Badge>}
                        {retired && <Badge variant="retiring" small><Icons.ArchiveX size={9} />Retired</Badge>}
                        {cert.isNew && <Badge variant="new" small>New</Badge>}
                        {cert.isUpdated && <Badge variant="updated" small>Updated</Badge>}
                        {cert.isBeta && <Badge variant="beta" small>Beta</Badge>}
                      </div>
                      <h3 className="path-map__list-card-name">{cert.name}</h3>
                    </div>
                    {!isRetiredExam && (
                      <button
                        className={`path-map__list-track-btn ${isTracked ? 'path-map__list-track-btn--tracked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCertIgnored(cert.id);
                          if (!isTracked) {
                            addToast(`${cert.examCode} added to tracked learning`, 'success');
                          } else {
                            addToast(`${cert.examCode} removed from tracked learning`, 'info');
                          }
                        }}
                        aria-label={isTracked ? "Untrack exam" : "Track exam"}
                        title={isTracked ? "Tracked in learning" : "Untracked"}
                      >
                        {isTracked ? <Icons.Eye size={18} /> : <Icons.EyeOff size={18} />}
                      </button>
                    )}
                  </div>
                  <p className="path-map__list-card-desc">{cert.description}</p>
                  
                  <div className="path-map__list-card-footer">
                    <div className="path-map__list-card-prereqs">
                      {cert.prerequisites?.length > 0 && cert.prerequisites.map((prereq, pIdx) => {
                        if (Array.isArray(prereq)) {
                          return (
                            <Badge key={`prereq-${pIdx}`} variant="default" small>
                              <Icons.Link size={9} /> 1 of {prereq.length}
                            </Badge>
                          );
                        }
                        const prereqCert = getCertById(prereq)?.cert;
                        return (
                          <Badge key={`prereq-${prereq}`} variant={prereqCert ? prereqCert.level.toLowerCase() : 'default'} small>
                            <Icons.Link size={9} /> Prereq: {prereqCert ? prereqCert.examCode : prereq.toUpperCase()}
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="path-map__list-status-toggle" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={`path-map__list-status-btn ${status === CERT_STATUS.NOT_STARTED ? 'path-map__list-status-btn--active' : ''}`}
                        onClick={(e) => handleSetStatus(cert, CERT_STATUS.NOT_STARTED, e)}
                        aria-label="Set status: Not Started"
                      >
                        <Icons.Circle size={14} />
                        <span>Not Started</span>
                      </button>
                      <button
                        type="button"
                        className={`path-map__list-status-btn ${status === CERT_STATUS.IN_PROGRESS ? 'path-map__list-status-btn--active path-map__list-status-btn--in-progress' : ''}`}
                        onClick={(e) => handleSetStatus(cert, CERT_STATUS.IN_PROGRESS, e)}
                        aria-label="Set status: In Progress"
                      >
                        <Icons.Clock size={14} />
                        <span>In Progress</span>
                      </button>
                      <button
                        type="button"
                        className={`path-map__list-status-btn ${(status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) ? 'path-map__list-status-btn--active path-map__list-status-btn--completed' : ''}`}
                        onClick={(e) => handleSetStatus(cert, CERT_STATUS.COMPLETED, e)}
                        aria-label="Set status: Passed"
                      >
                        {status === CERT_STATUS.NEEDS_RENEWAL ? <Icons.RefreshCw size={14} /> : <Icons.CheckCircle2 size={14} />}
                        <span>{status === CERT_STATUS.NEEDS_RENEWAL ? 'Renew' : 'Passed'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PathMapListView;
