import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CERT_STATUS, getCertById, getCertificationsRequiring } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { isRetiring, isRetired, getBadgeUrl } from '../../utils/helpers';
import Badge from '../common/Badge';
import { IconMap } from '../common/IconMap';
const { AlertTriangle, Link, ArchiveX, Eye, EyeOff } = IconMap;
import './CertNode.css';

/**
 * Represents a single node (cert-node) on the certification path map.
 * Displays the certification's status, level badges, and basic information.
 * Allows interacting to cycle status or open the detailed view.
 * 
 * @param {Object} props
 * @param {Object} props.data - The data injected by React Flow
 */
const CertNode = ({ data }) => {
  const { cert, pathColor, onSelect, index, isUnlocked, isPathIgnored } = data;
  const { getStatus, setStatus, isCertIgnored, toggleCertIgnored } = useProgressContext();
  const { addToast } = useToast();
  const status = getStatus(cert.id);
  const retiring = isRetiring(cert);
  const retired = isRetired(cert);
  const isRetiredExam = retiring || retired;
  const isTracked = !isCertIgnored(cert.id);
  const isExplicitlyExcluded = !isRetiredExam && !isPathIgnored && !isTracked;

  const statusClass = {
    [CERT_STATUS.NOT_STARTED]: 'cert-node--not-started',
    [CERT_STATUS.IN_PROGRESS]: 'cert-node--in-progress',
    [CERT_STATUS.COMPLETED]: 'cert-node--completed',
    [CERT_STATUS.NEEDS_RENEWAL]: 'cert-node--needs-renewal',
  }[status];

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
    Specialty: 'default',
  }[cert.level];

  const handleOpenDetail = (e) => {
    e.stopPropagation();
    onSelect?.(cert);
  };

  const handleSetStatus = (newStatus, e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus(cert.id, newStatus);
    
    if (newStatus === CERT_STATUS.COMPLETED) {
      const prerequisiteFor = getCertificationsRequiring(cert.id);
      if (prerequisiteFor?.length > 0) {
        const nextCert = prerequisiteFor.find(c => getStatus(c.id) === CERT_STATUS.NOT_STARTED);
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

  const getTrackTooltip = () => {
    if (!isPathIgnored) {
      return isTracked ? "Tracked with path • Click to exclude" : "Excluded from path • Click to track";
    }
    return isTracked ? "Tracked individually • Click to untrack" : "Track individual exam in My Learning";
  };

  return (
    <div
      className={`cert-node ${statusClass} ${isUnlocked ? 'cert-node--unlocked' : ''} ${isExplicitlyExcluded ? 'cert-node--ignored' : ''}`}
      style={{
        '--cert-node-color': pathColor,
        '--cert-node-index': index,
        '--cert-node-delay': `${index * 100 + 200}ms`,
      }}
      id={`cert-node-${cert.id}`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      {/* CertNode Info Card */}
      <div 
        className="cert-node__info" 
        onClick={handleOpenDetail}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleOpenDetail(e);
          }
        }}
      >
        <div className="cert-node__info-header">
          <div className="cert-node__icon-title">
            <div className={`cert-node__icon ${getBadgeUrl(cert.level, cert.id) ? 'cert-node__icon--image' : ''}`}>
              {getBadgeUrl(cert.level, cert.id) ? (
                <img 
                  src={getBadgeUrl(cert.level, cert.id)} 
                  alt={`${cert.examCode} Badge`} 
                  className="cert-node__badge-image"
                  loading="lazy"
                />
              ) : (
                <IconMap.Award size={20} />
              )}
            </div>
            <div className="cert-node__title-group">
              <h3 className="cert-node__name">{cert.name}</h3>
              <div className="cert-node__badge-stats">
                <span className="cert-node__exam-code">{cert.examCode}</span>
                {retiring && (
                  <Badge variant="retiring" small>
                    <AlertTriangle size={9} />
                    Retiring
                  </Badge>
                )}
                {retired && (
                  <Badge variant="retiring" small>
                    <ArchiveX size={9} />
                    Retired
                  </Badge>
                )}
                {cert.isNew && (
                  <Badge variant="new" small>
                    New
                  </Badge>
                )}
                {cert.isUpdated && (
                  <Badge variant="updated" small>
                    Updated
                  </Badge>
                )}
                {cert.isBeta && (
                  <Badge variant="beta" small>
                    Beta
                  </Badge>
                )}
                {cert.isComingSoon && (
                  <Badge variant="default" small>
                    Coming soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {!isRetiredExam && (
            <button
              className={`cert-node__track-btn ${isTracked ? 'cert-node__track-btn--tracked' : 'cert-node__track-btn--untracked'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCertIgnored(cert.id);
                if (!isTracked) {
                  addToast(`${cert.examCode} added to tracked learning`, 'success');
                } else {
                  addToast(`${cert.examCode} removed from tracked learning`, 'info');
                }
              }}
              title={getTrackTooltip()}
              aria-label={isTracked ? "Untrack exam" : "Track exam"}
            >
              {isTracked ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          )}
        </div>
        
        <div className="cert-node__info-body">
          <p className="cert-node__description">{cert.description}</p>
        </div>
        
        <div className="cert-node__info-footer">
          <div className="cert-node__actions" style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
              <Badge variant={levelVariant} small>{cert.level}</Badge>
              {/* Prerequisite Tags */}
              {cert.prerequisites?.length > 0 && (
                cert.prerequisites.map((prereqItem, index) => {
                  if (Array.isArray(prereqItem)) {
                    return (
                      <Badge key={`prereq-group-${index}`} variant="default" small>
                        <Link size={9} />
                        1 of {prereqItem.length}
                      </Badge>
                    );
                  }
                  const prereqCert = getCertById(prereqItem)?.cert;
                  if (!prereqCert) return null;
                  return (
                    <Badge key={`prereq-${prereqItem}`} variant={prereqCert.level.toLowerCase()} small>
                      <Link size={9} />
                      Prereq: {prereqCert.examCode}
                    </Badge>
                  );
                })
              )}
            </div>
            <div className="cert-node__status-toggle" style={{ flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
              <button
                className={`cert-node__toggle-btn ${status === CERT_STATUS.NOT_STARTED ? 'cert-node__toggle-btn--active' : ''}`}
                onClick={(e) => handleSetStatus(CERT_STATUS.NOT_STARTED, e)}
                title="Not Started"
                aria-label="Set status: Not Started"
              >
                <IconMap.Circle size={12} />
              </button>
              <button
                className={`cert-node__toggle-btn ${status === CERT_STATUS.IN_PROGRESS ? 'cert-node__toggle-btn--active' : ''}`}
                onClick={(e) => handleSetStatus(CERT_STATUS.IN_PROGRESS, e)}
                title="In Progress"
                aria-label="Set status: In Progress"
              >
                <IconMap.Clock size={12} />
              </button>
              <button
                className={`cert-node__toggle-btn ${(status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) ? 'cert-node__toggle-btn--active' : ''}`}
                onClick={(e) => handleSetStatus(CERT_STATUS.COMPLETED, e)}
                title={status === CERT_STATUS.NEEDS_RENEWAL ? "Needs Renewal" : "Passed"}
                aria-label="Set status: Passed"
              >
                {status === CERT_STATUS.NEEDS_RENEWAL ? <IconMap.RefreshCw size={12} /> : <IconMap.CheckCircle2 size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default memo(CertNode);
