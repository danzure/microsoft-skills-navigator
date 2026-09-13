import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mergeClasses } from '@fluentui/react-components';
import { CERT_STATUS, getCertById, getCertificationsRequiring } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { isRetiring, isRetired, getBadgeUrl } from '../../utils/helpers';
import Badge from '../common/Badge';
import { IconMap } from '../common/IconMap';
import { useCertNodeStyles } from './useCertNodeStyles';

const { AlertTriangle, Link, ArchiveX, Eye, EyeOff } = IconMap;

/**
 * Represents a single node (cert-node) on the certification path map.
 * Displays the certification's status, level badges, and basic information.
 * Allows interacting to cycle status or open the detailed view.
 * 
 * @param {Object} props
 * @param {Object} props.data - The data injected by React Flow
 */
const CertNode = ({ data }) => {
  const classes = useCertNodeStyles();
  const { cert, pathColor, onSelect, index, isUnlocked, isPathIgnored } = data;
  const { getStatus, setStatus, isCertIgnored, toggleCertIgnored } = useProgressContext();
  const { addToast } = useToast();
  const status = getStatus(cert.id);
  const retiring = isRetiring(cert);
  const retired = isRetired(cert);
  const isRetiredExam = retiring || retired;
  const isTracked = !isCertIgnored(cert.id);
  const isExplicitlyExcluded = !isRetiredExam && !isPathIgnored && !isTracked;

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

  const badgeUrl = getBadgeUrl(cert.level, cert.id);

  const infoStateClass = !isUnlocked && status === CERT_STATUS.NOT_STARTED
    ? classes.infoNotStartedLocked
    : isUnlocked && status === CERT_STATUS.NOT_STARTED
    ? classes.infoUnlocked
    : (status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL)
    ? classes.infoCompleted
    : undefined;

  const infoIgnoredClass = isExplicitlyExcluded ? classes.infoIgnored : undefined;

  return (
    <div
      className={classes.root}
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
        className={mergeClasses(classes.info, infoStateClass, infoIgnoredClass)} 
        onClick={handleOpenDetail}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleOpenDetail(e);
          }
        }}
      >
        <div className={classes.infoHeader}>
          <div className={classes.iconTitle}>
            <div 
              className={mergeClasses(
                classes.icon, 
                badgeUrl && classes.iconImage,
                isExplicitlyExcluded && !badgeUrl && classes.iconIgnored,
                isExplicitlyExcluded && badgeUrl && classes.iconImageIgnored
              )}
            >
              {badgeUrl ? (
                <img 
                  src={badgeUrl} 
                  alt={`${cert.examCode} Badge`} 
                  className={classes.badgeImage}
                  loading="lazy"
                />
              ) : (
                <IconMap.Award size={20} />
              )}
            </div>
            <div className={classes.titleGroup}>
              <h3 className={classes.name}>{cert.name}</h3>
              <div className={classes.badgeStats}>
                <span className={mergeClasses(classes.examCode, isExplicitlyExcluded && classes.examCodeIgnored)}>
                  {cert.examCode}
                </span>
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
              className={mergeClasses(classes.trackBtn, isTracked ? classes.trackBtnTracked : classes.trackBtnUntracked)}
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
        
        <div className={classes.infoBody}>
          <p className={classes.description}>{cert.description}</p>
        </div>
        
        <div className={classes.infoFooter}>
          <div className={classes.actions} style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
              <Badge variant={levelVariant} small>{cert.level}</Badge>
              {/* Prerequisite Tags */}
              {cert.prerequisites?.length > 0 && (
                cert.prerequisites.map((prereqItem, prereqIdx) => {
                  if (Array.isArray(prereqItem)) {
                    return (
                      <Badge key={`prereq-group-${prereqIdx}`} variant="default" small>
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
            <div className={classes.statusToggle} style={{ flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
              <button
                className={mergeClasses(classes.toggleBtn, status === CERT_STATUS.NOT_STARTED && classes.toggleBtnActiveNotStarted)}
                onClick={(e) => handleSetStatus(CERT_STATUS.NOT_STARTED, e)}
                title="Not Started"
                aria-label="Set status: Not Started"
              >
                <IconMap.Circle size={12} />
              </button>
              <button
                className={mergeClasses(classes.toggleBtn, status === CERT_STATUS.IN_PROGRESS && classes.toggleBtnActiveInProgress)}
                onClick={(e) => handleSetStatus(CERT_STATUS.IN_PROGRESS, e)}
                title="In Progress"
                aria-label="Set status: In Progress"
              >
                <IconMap.Clock size={12} />
              </button>
              <button
                className={mergeClasses(
                  classes.toggleBtn, 
                  status === CERT_STATUS.COMPLETED && classes.toggleBtnActivePassed,
                  status === CERT_STATUS.NEEDS_RENEWAL && classes.toggleBtnActiveRenewal
                )}
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
