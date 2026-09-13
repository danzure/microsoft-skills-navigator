import { useMemo } from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { getCertById, getCertificationsRequiring, CERT_LEVELS, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { isRetiring, isRetired, getBadgeUrl } from '../../utils/helpers';
import Badge from '../common/Badge';
import { IconMap as Icons } from '../common/IconMap';

const useClasses = makeStyles({
  listView: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalXXXL}`,
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
  listEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalXXXL,
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
    '& p': {
      fontSize: tokens.fontSizeBase300,
      margin: 0,
    },
    '& button': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '32px',
      padding: `0 ${tokens.spacingHorizontalL}`,
      borderRadius: tokens.borderRadiusMedium,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      backgroundColor: tokens.colorNeutralBackground1,
      color: tokens.colorNeutralForeground1,
      fontSize: tokens.fontSizeBase300,
      fontWeight: tokens.fontWeightSemibold,
      cursor: 'pointer',
      transitionProperty: 'all',
      transitionDuration: 'var(--duration-fast)',
      transitionTimingFunction: 'var(--curve-easy-ease)',
      ':hover': {
        backgroundColor: tokens.colorNeutralBackground1Hover,
      },
    },
  },
  listSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  listSectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    paddingLeft: '4px',
  },
  listSectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  listSectionDesc: {
    fontSize: 'var(--fs-caption1)',
    color: tokens.colorNeutralForeground2,
    margin: 0,
  },
  listCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  listCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    touchAction: 'manipulation',
    boxShadow: tokens.shadow2,
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover': {
      boxShadow: tokens.shadow4,
      borderColor: tokens.colorNeutralStroke1,
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'scale(0.99)',
    },
    ':focus-visible': {
      outline: '2px solid var(--border-focus)',
      outlineOffset: '2px',
    },
  },
  listCardCompleted: {
    borderColor: 'color-mix(in srgb, var(--card-color) 60%, transparent)',
  },
  listCardInProgress: {
    borderColor: 'color-mix(in srgb, var(--badge-inprogress-border) 80%, var(--colorNeutralStroke1))',
  },
  listCardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
  },
  listCardBadge: {
    width: '40px',
    height: '40px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
  },
  listCardTitleGroup: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  listCardCodeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  listCardCode: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--fs-caption1)',
    fontWeight: tokens.fontWeightBold,
    color: 'var(--card-color)',
  },
  listCardName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
    lineHeight: 'var(--lh-tight)',
  },
  listTrackBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    touchAction: 'manipulation',
    flexShrink: 0,
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderColor: tokens.colorNeutralStroke1,
      color: tokens.colorNeutralForeground1,
    },
  },
  listTrackBtnTracked: {
    color: 'var(--card-color)',
    backgroundColor: 'color-mix(in srgb, var(--card-color) 12%, transparent)',
    borderColor: 'color-mix(in srgb, var(--card-color) 35%, transparent)',
    ':hover': {
      backgroundColor: 'color-mix(in srgb, var(--card-color) 20%, transparent)',
    },
  },
  listCardDesc: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: 'var(--lh-normal)',
    margin: 0,
  },
  listCardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`,
  },
  listCardPrereqs: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  listStatusToggle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '3px',
  },
  listStatusBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalS,
    height: '38px',
    borderRadius: tokens.borderRadiusSmall,
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    fontSize: 'var(--fs-caption1)',
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer',
    touchAction: 'manipulation',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':active': {
      transform: 'scale(0.96)',
    },
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
  },
  listStatusBtnActive: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    boxShadow: tokens.shadow2,
    borderColor: tokens.colorNeutralStroke2,
  },
  listStatusBtnActiveInProgress: {
    color: 'var(--badge-inprogress-fg)',
    backgroundColor: 'var(--badge-inprogress-bg)',
    borderColor: 'var(--badge-inprogress-border)',
  },
  listStatusBtnActiveCompleted: {
    color: 'var(--badge-completed-fg)',
    backgroundColor: 'var(--badge-completed-bg)',
    borderColor: 'var(--badge-completed-border)',
  },
});

/**
 * PathMapListView Component
 * Renders the responsive list view for certification paths, organized by foundational,
 * pathway/branch, and advanced credentials with filtering and status controls.
 */
const PathMapListView = ({ path, onSelectCert, selectedBranch = 'all', statusFilter = 'all', onClearFilters }) => {
  const c = useClasses();
  const { getStatus, setStatus, isCertIgnored, toggleCertIgnored } = useProgressContext();
  const { addToast } = useToast();

  const handleSetStatus = (cert, newStatus, e) => {
    e.stopPropagation();
    setStatus(cert.id, newStatus);
    if (newStatus === CERT_STATUS.COMPLETED) {
      const requiring = getCertificationsRequiring(cert.id);
      if (requiring?.length > 0) {
        const nextCert = requiring.find(item => getStatus(item.id) === CERT_STATUS.NOT_STARTED);
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
    const trunkFundamentals = path.certifications.filter(item => !item.branch && item.level === CERT_LEVELS.FUNDAMENTALS);
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
        const branchCerts = path.certifications.filter(item => item.branch === branch.id);
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

    const trunkBottom = path.certifications.filter(item => !item.branch && item.level !== CERT_LEVELS.FUNDAMENTALS);
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
        certs: s.certs.filter(item => {
          const sStatus = getStatus(item.id);
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
    <div className={c.listView} id="path-list-view">
      {sections.length === 0 && (
        <div className={c.listEmpty}>
          <p>No certifications match your current filters.</p>
          <button type="button" onClick={onClearFilters}>Clear all filters</button>
        </div>
      )}
      {sections.map(section => (
        <div key={section.id} className={c.listSection}>
          <div className={c.listSectionHeader}>
            <h2 className={c.listSectionTitle}>{section.title}</h2>
            {section.description && (
              <p className={c.listSectionDesc}>{section.description}</p>
            )}
          </div>
          <div className={c.listCards}>
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
                  className={mergeClasses(
                    c.listCard,
                    status === CERT_STATUS.COMPLETED && c.listCardCompleted,
                    status === CERT_STATUS.IN_PROGRESS && c.listCardInProgress
                  )}
                  onClick={() => onSelectCert(cert)}
                  style={{ '--card-color': path.color }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectCert(cert)}
                >
                  <div className={c.listCardHeader}>
                    <div className={c.listCardBadge}>
                      {badgeUrl ? (
                        <img src={badgeUrl} alt={`${cert.examCode} badge`} loading="lazy" />
                      ) : (
                        <Icons.Award size={24} />
                      )}
                    </div>
                    <div className={c.listCardTitleGroup}>
                      <div className={c.listCardCodeRow}>
                        <span className={c.listCardCode}>{cert.examCode}</span>
                        <Badge variant={cert.level.toLowerCase()} small>{cert.level}</Badge>
                        {retiring && <Badge variant="retiring" small><Icons.AlertTriangle size={9} />Retiring</Badge>}
                        {retired && <Badge variant="retiring" small><Icons.ArchiveX size={9} />Retired</Badge>}
                        {cert.isNew && <Badge variant="new" small>New</Badge>}
                        {cert.isUpdated && <Badge variant="updated" small>Updated</Badge>}
                        {cert.isBeta && <Badge variant="beta" small>Beta</Badge>}
                      </div>
                      <h3 className={c.listCardName}>{cert.name}</h3>
                    </div>
                    {!isRetiredExam && (
                      <button
                        type="button"
                        className={mergeClasses(c.listTrackBtn, isTracked && c.listTrackBtnTracked)}
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
                  <p className={c.listCardDesc}>{cert.description}</p>
                  
                  <div className={c.listCardFooter}>
                    <div className={c.listCardPrereqs}>
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
                    <div className={c.listStatusToggle} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={mergeClasses(c.listStatusBtn, status === CERT_STATUS.NOT_STARTED && c.listStatusBtnActive)}
                        onClick={(e) => handleSetStatus(cert, CERT_STATUS.NOT_STARTED, e)}
                        aria-label="Set status: Not Started"
                      >
                        <Icons.Circle size={14} />
                        <span>Not Started</span>
                      </button>
                      <button
                        type="button"
                        className={mergeClasses(
                          c.listStatusBtn, 
                          status === CERT_STATUS.IN_PROGRESS && mergeClasses(c.listStatusBtnActive, c.listStatusBtnActiveInProgress)
                        )}
                        onClick={(e) => handleSetStatus(cert, CERT_STATUS.IN_PROGRESS, e)}
                        aria-label="Set status: In Progress"
                      >
                        <Icons.Clock size={14} />
                        <span>In Progress</span>
                      </button>
                      <button
                        type="button"
                        className={mergeClasses(
                          c.listStatusBtn, 
                          (status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) && mergeClasses(c.listStatusBtnActive, c.listStatusBtnActiveCompleted)
                        )}
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
