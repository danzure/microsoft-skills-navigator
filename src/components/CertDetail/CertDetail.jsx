import { useEffect } from 'react';
import { IconMap } from '../common/IconMap';
const { X, AlertTriangle, Calendar, Award, Eye, EyeOff, Microsoft } = IconMap;
import { useProgressContext } from '../../context/ProgressContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { CERT_STATUS, getCertById, getCertificationsRequiring, doesCertExpire } from '../../data/certificationPaths';
import { isRetiring, isRetired, formatDate, getBadgeUrl } from '../../utils/helpers';
import { getFormattedExamCost, CURRENCIES } from '../../utils/pricing';
import Badge from '../common/Badge';
import './CertDetail.css';

/**
 * A modal panel displaying comprehensive details for a specific certification.
 * Shows description, skills measured, prerequisites, validity, and provides controls
 * to update the tracking status or exclude the certification.
 * 
 * @param {Object} props
 * @param {Object} props.cert - The certification data object
 * @param {Object} props.path - The parent path data object
 * @param {Function} props.onClose - Callback to close the detail panel
 */
const statusOptions = [
  { value: CERT_STATUS.NOT_STARTED, label: 'Not Started', icon: '○', className: 'cert-detail__status-btn--not-started' },
  { value: CERT_STATUS.IN_PROGRESS, label: 'In Progress', icon: '◐', className: 'cert-detail__status-btn--in-progress' },
  { value: CERT_STATUS.COMPLETED, label: 'Passed', icon: '✓', className: 'cert-detail__status-btn--completed' },
];

const CertDetail = ({ cert, path, onClose }) => {
  const { getStatus, setStatus, toggleCertIgnored, isCertIgnored, isPathIgnored, completionDates, setCompletionDate } = useProgressContext();
  const { currency, setCurrency } = useCurrency();
  const { addToast } = useToast();
  const status = getStatus(cert.id);
  const retiring = isRetiring(cert);
  const isRetiredExam = retiring || isRetired(cert);
  const isPathExcluded = isPathIgnored(path.id);
  const certIgnored = !isRetiredExam && isCertIgnored(cert.id);

  const completionDateStr = completionDates?.[cert.id];
  const expires = doesCertExpire(cert.level);

  let expiryDate = null;
  if (expires && completionDateStr) {
    expiryDate = new Date(completionDateStr);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
  }[cert.level] || 'default';

  const prerequisiteFor = getCertificationsRequiring(cert.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'e' && !isRetiredExam) {
        toggleCertIgnored(cert.id);
        if (certIgnored) {
          addToast(`${cert.examCode} added to tracked learning`);
        } else {
          addToast(`${cert.examCode} removed from tracked learning`);
        }
      } else if (e.key.toLowerCase() === 's') {
        const statuses = [CERT_STATUS.NOT_STARTED, CERT_STATUS.IN_PROGRESS, CERT_STATUS.COMPLETED];
        const currentIndex = statuses.indexOf(status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const newStatus = statuses[nextIndex];
        setStatus(cert.id, newStatus);
        
        const statusLabel = statusOptions.find(opt => opt.value === newStatus)?.label || newStatus;
        addToast(`${cert.examCode} marked as ${statusLabel}`);
      } else if (e.key === 'Enter') {
        window.open(cert.learnUrl, '_blank', 'noopener,noreferrer');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, cert.id, cert.learnUrl, cert.examCode, status, certIgnored, isPathExcluded, isRetiredExam, toggleCertIgnored, setStatus, addToast]);

  return (
    <>
      <div className="cert-detail__overlay" onClick={onClose} />
      <div className="cert-detail" style={{ '--detail-color': path.color }} id="cert-detail-panel">
        <div className="cert-detail__header">
          <div className="cert-detail__header-strip" />
          <button className="cert-detail__close" onClick={onClose} aria-label="Close detail panel">
            <X size={20} />
          </button>
          <div className="cert-detail__header-content">
            <div className="cert-detail__title-row">
              <div className="cert-detail__title-text">
                <h2 className="cert-detail__name">{cert.name}</h2>
                <span className="cert-detail__exam-code">{cert.examCode}</span>
              </div>
              {getBadgeUrl(cert.level, cert.id) && (
                <img 
                  src={getBadgeUrl(cert.level, cert.id)} 
                  alt={`${cert.level} Badge`} 
                  className="cert-detail__badge-icon" 
                  loading="lazy"
                />
              )}
            </div>
            <div className="cert-detail__badges">
              <Badge variant={levelVariant} outline>{cert.level}</Badge>
              {cert.roleData ? cert.roleData.map((r, i) => {
                const RoleIcon = r.icon ? IconMap[r.icon] : null;
                return (
                  <Badge key={`role-${i}`} color={r.color} outline>
                    {RoleIcon && <RoleIcon size={12} />}
                    Job role: {r.title}
                  </Badge>
                );
              }) : cert.role && (
                <Badge variant="default" outline>Job role: {cert.role}</Badge>
              )}
              <Badge color={path.color} outline>{path.shortName}</Badge>
              {retiring && (
                <Badge variant="retiring" outline>
                  <AlertTriangle size={10} />
                  Retiring
                </Badge>
              )}

              {cert.isNew && (
                <Badge variant="new">
                  New
                </Badge>
              )}
              {cert.isUpdated && (
                <Badge variant="updated">
                  Updated
                </Badge>
              )}
              {cert.isBeta && (
                <Badge variant="default">
                  {typeof cert.isBeta === 'string' ? cert.isBeta : 'Beta'}
                </Badge>
              )}
              {cert.isComingSoon && (
                <Badge variant="default">
                  Coming soon
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="cert-detail__body">
          <div className="cert-detail__section">
            <h3 className="cert-detail__section-title">Description</h3>
            <p className="cert-detail__description">{cert.description}</p>
          </div>

          {cert.skillsMeasured && cert.skillsMeasured.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Skills Measured</h3>
              <ul className="cert-detail__skills-list">
                {cert.skillsMeasured.map((skill, index) => (
                  <li key={index} className="cert-detail__skill-item">{skill}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="cert-detail__section">
            <h3 className="cert-detail__section-title">Validity & Renewal</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              {cert.level === 'Fundamentals' ? (
                <>
                  <Award size={20} style={{ color: path.color, flexShrink: 0 }} />
                  <span className="cert-detail__description">This certification does not expire.</span>
                </>
              ) : (
                <>
                  <Calendar size={20} style={{ color: path.color, flexShrink: 0 }} />
                  <span className="cert-detail__description">Valid for 1 year. Requires a free online renewal assessment every 12 months to maintain active status.</span>
                </>
              )}
            </div>
          </div>

          <div className="cert-detail__section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 className="cert-detail__section-title" style={{ margin: 0 }}>Estimated Exam Cost</h3>
              <select 
                className="cert-detail__currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {Object.entries(CURRENCIES).map(([code, data]) => (
                  <option key={code} value={code}>{data.label}</option>
                ))}
              </select>
            </div>
            <div className={`cert-detail__cost-display`}>
              <span className="cert-detail__cost-amount">{getFormattedExamCost(cert.level, currency)}</span>
              <span className="cert-detail__cost-note">Standard pricing. Exact cost may vary by specific location and applicable taxes.</span>
            </div>
          </div>

          {retiring && (
            <div className="cert-detail__alert cert-detail__alert--warning">
              <AlertTriangle size={16} />
              <div>
                <strong>Retirement Notice</strong>
                <p>This certification retires on {formatDate(cert.retirementDate)}. Consider transitioning to its replacement.</p>
              </div>
            </div>
          )}

          {status === CERT_STATUS.NEEDS_RENEWAL && (
            <div className="cert-detail__alert cert-detail__alert--danger">
              <AlertTriangle size={16} />
              <div>
                <strong>Needs Renewal</strong>
                <p>This certification has expired or is nearing expiration. Complete the renewal assessment on Microsoft Learn.</p>
                <button 
                  className="cert-detail__renew-btn"
                  onClick={() => setCompletionDate(cert.id, new Date().toISOString())}
                >
                  <Award size={14} />
                  Mark as Renewed
                </button>
              </div>
            </div>
          )}

          {cert.prerequisites && cert.prerequisites.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Prerequisites</h3>
              <div className="cert-detail__prereqs">
                {cert.prerequisites.map((preItem, i) => {
                  if (Array.isArray(preItem)) {
                    return (
                      <div key={`group-${i}`} className="cert-detail__prereq-group">
                        <div className="cert-detail__prereq-group-label">
                          Requires ONE of the following:
                        </div>
                        {preItem.map(subId => {
                          const preCertData = getCertById(subId);
                          const preCert = preCertData?.cert;
                          const prePath = preCertData?.path;
                          if (!preCert) return null;
                          return (
                            <div key={subId} className="cert-detail__prereq" style={{ '--prereq-color': prePath?.color || path.color }}>
                              <span className="cert-detail__prereq-name">{preCert.name}</span>
                              <span className="cert-detail__prereq-code">{preCert.examCode}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  const preCertData = getCertById(preItem);
                  const preCert = preCertData?.cert;
                  const prePath = preCertData?.path;
                  if (!preCert) return null;
                  return (
                    <div key={preItem} className="cert-detail__prereq" style={{ '--prereq-color': prePath?.color || path.color }}>
                      <span className="cert-detail__prereq-name">{preCert.name}</span>
                      <span className="cert-detail__prereq-code">{preCert.examCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {cert.recommendedPrereqs && cert.recommendedPrereqs.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Recommended Before Taking</h3>
              <div className="cert-detail__prereqs cert-detail__prereqs--recommended">
                {cert.recommendedPrereqs.map((preId) => {
                  const preCertData = getCertById(preId);
                  const preCert = preCertData?.cert;
                  const prePath = preCertData?.path;
                  if (!preCert) return null;
                  return (
                    <div key={preId} className="cert-detail__prereq" style={{ '--prereq-color': prePath?.color || path.color }}>
                      <span className="cert-detail__prereq-name">{preCert.name}</span>
                      <span className="cert-detail__prereq-code">{preCert.examCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {prerequisiteFor && prerequisiteFor.length > 0 && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">Prerequisite For</h3>
              <div className="cert-detail__prereqs">
                {prerequisiteFor.map((preCert) => {
                  return (
                    <div key={preCert.id} className="cert-detail__prereq" style={{ '--prereq-color': preCert.pathColor || path.color }}>
                      <span className="cert-detail__prereq-name">{preCert.name}</span>
                      <span className="cert-detail__prereq-code">{preCert.examCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isRetiredExam && (
            <div className="cert-detail__section">
              <h3 className="cert-detail__section-title">
                Tracking <span style={{fontSize: '10px', fontWeight: 'normal', opacity: 0.6, marginLeft: '6px'}}>(Press E)</span>
              </h3>
              <button
                className={`cert-detail__track-btn ${!isCertIgnored(cert.id) ? 'cert-detail__track-btn--tracked' : 'cert-detail__track-btn--untracked'}`}
                onClick={() => {
                  const wasTracked = !isCertIgnored(cert.id);
                  toggleCertIgnored(cert.id);
                  if (!wasTracked) {
                    addToast(`${cert.examCode} added to tracked learning`, 'success');
                  } else {
                    addToast(`${cert.examCode} removed from tracked learning`, 'info');
                  }
                }}
              >
                {!isCertIgnored(cert.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                <span>
                  {!isPathExcluded
                    ? (!isCertIgnored(cert.id) ? 'Tracked with Path' : 'Excluded from Path')
                    : (!isCertIgnored(cert.id) ? 'Tracked Individually' : 'Not Tracked')}
                </span>
              </button>
              <p className="cert-detail__ignore-hint">
                {!isPathExcluded
                  ? (!isCertIgnored(cert.id)
                      ? `Included in your learning journey as part of ${path.shortName}. Click to exclude.`
                      : `Excluded from your learning journey. Click to include.`)
                  : (!isCertIgnored(cert.id)
                      ? `Tracked individually in your learning dashboard. Click to untrack.`
                      : `Not currently tracked. Click to track individually in your learning dashboard, or set status below.`)}
              </p>
            </div>
          )}

          <div className="cert-detail__section">
            <h3 className="cert-detail__section-title">
              Your Status <span style={{fontSize: '10px', fontWeight: 'normal', opacity: 0.6, marginLeft: '6px'}}>(Press S to cycle)</span>
            </h3>
            <div className={`cert-detail__status-options`}>
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`cert-detail__status-btn ${opt.className} ${(status === opt.value || (status === CERT_STATUS.NEEDS_RENEWAL && opt.value === CERT_STATUS.COMPLETED)) ? 'cert-detail__status-btn--active' : ''}`}
                  onClick={() => {
                    setStatus(cert.id, opt.value);
                    if (opt.value === CERT_STATUS.COMPLETED && prerequisiteFor?.length > 0) {
                      const nextCert = prerequisiteFor.find(c => getStatus(c.id) === CERT_STATUS.NOT_STARTED);
                      if (nextCert) {
                        addToast(`🎉 You've unlocked ${nextCert.examCode}!`, 'success', {
                          action: {
                            label: 'Start it',
                            onClick: () => {
                              setStatus(nextCert.id, CERT_STATUS.IN_PROGRESS);
                              addToast(`${nextCert.examCode} marked as In Progress`);
                            }
                          }
                        });
                        return;
                      }
                    }
                    addToast(`${cert.examCode} marked as ${opt.label}`);
                  }}
                >
                  <span className="cert-detail__status-icon">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            {(status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) && (
              <div style={{ marginTop: '8px' }}>
                <label className="cert-detail__section-title" style={{ fontSize: '10px' }}>Completion Date</label>
                <input 
                  type="date" 
                  className="cert-detail__date-input"
                  value={completionDateStr ? completionDateStr.split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setCompletionDate(cert.id, new Date(e.target.value).toISOString());
                    }
                  }}
                />
                {expiryDate && (
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                    Expires: <strong>{formatDate(expiryDate.toISOString())}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          <a
            href={cert.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-detail__learn-btn"
          >
            <Microsoft size={16} />
            View on Microsoft Learn
          </a>
        </div>
      </div>
    </>
  );
};

export default CertDetail;
