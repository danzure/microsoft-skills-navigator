import { memo, useMemo } from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CERT_STATUS, getCertById } from '../../data/certificationPaths';
import { getAppliedSkillsForCert, APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { IconMap as Icons } from '../common/IconMap';
import Badge from '../common/Badge';
import { getBadgeUrl } from '../../utils/helpers';
import { AlignedAppliedSkills } from './AlignedAppliedSkills';
import '../PathMap/CertNode.css';

const useClasses = makeStyles({
  /* ─── Sortable Step Wrapper ───────────────────────────────────────────── */
  stepRoot: {
    position: 'relative',
    width: '100%',
  },
  stepLayout: {
    display: 'flex',
    gap: tokens.spacingHorizontalXL,
    position: 'relative',
    zIndex: 1,
  },
  /* ─── Timeline Indicator & Node ───────────────────────────────────────── */
  timelineIndicator: {
    width: '72px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    '@media (max-width: 768px)': {
      width: '40px',
    },
  },
  timelineNode: {
    width: '36px',
    height: '36px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralBackground2,
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    '@media (max-width: 768px)': {
      width: '32px',
      height: '32px',
    },
  },
  timelineNodeCompleted: {
    backgroundColor: 'var(--status-completed)',
    borderColor: 'var(--status-completed)',
    color: '#ffffff',
    boxShadow: '0 0 10px color-mix(in srgb, var(--status-completed) 40%, transparent)',
  },
  timelineNodeInProgress: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderColor: 'var(--status-in-progress)',
    color: 'var(--status-in-progress)',
    boxShadow: '0 0 10px color-mix(in srgb, var(--status-in-progress) 40%, transparent)',
  },
  timelineNodeNeedsRenewal: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderColor: 'var(--line-security)',
    color: 'var(--line-security)',
    boxShadow: '0 0 10px color-mix(in srgb, var(--line-security) 40%, transparent)',
  },
  /* ─── Action Buttons Bar ──────────────────────────────────────────────── */
  actionsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    padding: 0,
    '@media (pointer: coarse)': {
      width: '38px',
      height: '38px',
    },
  },
  moveBtn: {
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
    ':active': {
      transform: 'scale(0.92)',
    },
  },
  removeBtn: {
    ':hover': {
      backgroundColor: 'color-mix(in srgb, var(--line-security) 12%, transparent)',
      color: 'var(--line-security)',
    },
    ':active': {
      transform: 'scale(0.96)',
    },
  },
  dragHandle: {
    cursor: 'grab',
    touchAction: 'none',
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
    ':active': {
      cursor: 'grabbing',
    },
  },
  /* ─── Stage Container (When Aligned Labs Exist) ───────────────────────── */
  stageCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    padding: tokens.spacingVerticalXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: tokens.shadow2,
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-normal)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    flex: 1,
    minWidth: 0,
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: 'var(--cert-node-color, var(--colorBrandForeground1))',
      borderTopLeftRadius: tokens.borderRadiusXLarge,
      borderBottomLeftRadius: tokens.borderRadiusXLarge,
    },
    ':hover': {
      borderColor: 'color-mix(in srgb, var(--cert-node-color) 40%, var(--colorNeutralStroke2))',
      boxShadow: tokens.shadow4,
    },
    '@media (max-width: 768px)': {
      padding: tokens.spacingVerticalL,
      gap: tokens.spacingVerticalS,
    },
  },
  stageStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    position: 'relative',
  },
  stageStepHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  stageStepBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '3px 8px',
    borderRadius: tokens.borderRadiusSmall,
    lineHeight: 1,
  },
  stageStepBadgePrep: {
    color: 'var(--line-azure)',
    backgroundColor: 'color-mix(in srgb, var(--line-azure) 12%, transparent)',
    border: '1px solid color-mix(in srgb, var(--line-azure) 30%, transparent)',
  },
  stageStepBadgeExam: {
    color: 'var(--cert-node-color, var(--colorBrandForeground1))',
    backgroundColor: 'color-mix(in srgb, var(--cert-node-color, var(--colorBrandForeground1)) 12%, transparent)',
    border: '1px solid color-mix(in srgb, var(--cert-node-color, var(--colorBrandForeground1)) 30%, transparent)',
  },
  stageStepSubtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  stageConnector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    userSelect: 'none',
    margin: '-4px 0',
    zIndex: 2,
  },
  stageConnectorStem: {
    width: '2px',
    height: '12px',
    background: 'linear-gradient(180deg, var(--colorNeutralStroke2) 0%, color-mix(in srgb, var(--cert-node-color) 40%, var(--colorNeutralStroke2)) 100%)',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-normal)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
  },
  stageConnectorStemBottom: {
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--cert-node-color) 40%, var(--colorNeutralStroke2)) 0%, var(--colorNeutralStroke2) 100%)',
  },
  stageConnectorStemComplete: {
    background: 'var(--status-completed)',
    boxShadow: '0 0 6px color-mix(in srgb, var(--status-completed) 40%, transparent)',
  },
  stageConnectorBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: '6px 16px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: '1px solid color-mix(in srgb, var(--cert-node-color) 30%, var(--colorNeutralStroke2))',
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: `${tokens.shadow4}, 0 2px 8px color-mix(in srgb, var(--cert-node-color) 8%, transparent)`,
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    position: 'relative',
    ':hover': {
      transform: 'translateY(-1px)',
      borderColor: 'var(--cert-node-color)',
      boxShadow: `${tokens.shadow8}, 0 0 14px color-mix(in srgb, var(--cert-node-color) 20%, transparent)`,
    },
  },
  stageConnectorBadgeReady: {
    borderColor: 'color-mix(in srgb, var(--status-completed) 50%, var(--colorNeutralStroke2))',
    boxShadow: `${tokens.shadow4}, 0 0 12px color-mix(in srgb, var(--status-completed) 20%, transparent)`,
  },
  stageConnectorIconWrap: {
    width: '24px',
    height: '24px',
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'color-mix(in srgb, var(--cert-node-color) 12%, transparent)',
    color: 'var(--cert-node-color)',
    flexShrink: 0,
  },
  stageConnectorIconWrapReady: {
    backgroundColor: 'color-mix(in srgb, var(--status-completed) 15%, transparent)',
    color: 'var(--status-completed)',
  },
  stageConnectorContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  stageConnectorTitle: {
    fontSize: '10px',
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.2,
  },
  stageConnectorFlow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.3,
  },
  stageConnectorStepName: {
    whiteSpace: 'nowrap',
  },
  stageConnectorChevron: {
    color: 'var(--cert-node-color, var(--colorBrandForeground1))',
    flexShrink: 0,
    opacity: 0.8,
  },
  stageConnectorStatus: {
    marginLeft: tokens.spacingHorizontalXS,
    display: 'flex',
    alignItems: 'center',
  },
  stageConnectorTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '2px 7px',
    borderRadius: tokens.borderRadiusSmall,
    whiteSpace: 'nowrap',
    lineHeight: 1.4,
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  stageConnectorTagReady: {
    color: 'var(--status-completed)',
    backgroundColor: 'color-mix(in srgb, var(--status-completed) 12%, transparent)',
    border: '1px solid color-mix(in srgb, var(--status-completed) 30%, transparent)',
  },
  stageConnectorTagProgress: {
    color: 'var(--status-in-progress)',
    backgroundColor: 'color-mix(in srgb, var(--status-in-progress) 12%, transparent)',
    border: '1px solid color-mix(in srgb, var(--status-in-progress) 30%, transparent)',
  },
});

/**
 * SortableCertItem Component
 * 
 * A draggable list item used within the dnd-kit context to display a certification 
 * in the custom career timeline. It supports drag-and-drop reordering, removal, 
 * displays official Microsoft credential badges, provides interactive status toggles 
 * to start/track the certification, and reveals aligned Applied Skills labs with 
 * a two-stage sequential learning flow.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.id - The unique identifier used by dnd-kit for sorting.
 * @param {number} props.index - The 0-based index of this item in the list.
 * @param {boolean} props.isFirst - Whether this item is the first in the playlist.
 * @param {boolean} props.isLast - Whether this item is the last in the playlist.
 * @param {Object} props.certInfo - The certification data object.
 * @param {string} props.status - The current tracking status of the certification.
 * @param {string} props.nodeClass - The CSS class applied to the timeline node based on status.
 * @param {Function} props.onNavigate - Callback to navigate to a path or details page.
 * @param {Function} props.onRemove - Callback to remove this item from the custom timeline.
 * @param {Function} [props.onMoveUp] - Callback to move step up.
 * @param {Function} [props.onMoveDown] - Callback to move step down.
 * @param {Function} [props.onSelectSkill] - Callback when an aligned applied skill is selected for details.
 * @returns {JSX.Element}
 */
export const SortableCertItem = memo(({ 
  id, 
  index, 
  isFirst, 
  isLast, 
  certInfo, 
  status, 
  onNavigate, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onSelectSkill 
}) => {
  const c = useClasses();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { setStatus, isCertIgnored, toggleCertIgnored, getAppliedSkillStatus } = useProgressContext();
  const { addToast } = useToast();

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const badgeUrl = getBadgeUrl(certInfo.level, certInfo.id);

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
    Specialty: 'default',
  }[certInfo.level] || 'default';

  const alignedSkills = useMemo(() => getAppliedSkillsForCert(certInfo.id), [certInfo.id]);
  const hasAlignedSkills = alignedSkills && alignedSkills.length > 0;

  const completedLabsCount = useMemo(() => {
    if (!hasAlignedSkills || !getAppliedSkillStatus) return 0;
    return alignedSkills.filter(s => getAppliedSkillStatus(s.id) === APPLIED_SKILL_STATUS.COMPLETED).length;
  }, [hasAlignedSkills, alignedSkills, getAppliedSkillStatus]);

  const isPrepComplete = hasAlignedSkills && completedLabsCount === alignedSkills.length;

  const nodeStatusClass = mergeClasses(
    c.timelineNode,
    (status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) && c.timelineNodeCompleted,
    status === CERT_STATUS.IN_PROGRESS && c.timelineNodeInProgress,
    status === CERT_STATUS.NEEDS_RENEWAL && c.timelineNodeNeedsRenewal,
  );

  const handleSetStatus = (newStatus, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setStatus(certInfo.id, newStatus);
    if (newStatus === CERT_STATUS.COMPLETED) {
      addToast(`🎉 Congratulations on earning ${certInfo.examCode}!`, 'success');
    } else if (newStatus === CERT_STATUS.IN_PROGRESS) {
      addToast(`🚀 Started ${certInfo.examCode}! Added to in-progress learning.`, 'info');
    }
  };

  const handleToggleTracking = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const wasTracked = !isCertIgnored(certInfo.id);
    toggleCertIgnored(certInfo.id);
    if (!wasTracked) {
      addToast(`${certInfo.examCode} added to tracked learning`, 'success');
    } else {
      addToast(`${certInfo.examCode} removed from tracked learning`, 'info');
    }
  };

  const actionsBar = (
    <div className={c.actionsBar} onClick={(e) => e.stopPropagation()}>
      {onMoveUp && !isFirst && (
        <button 
          type="button"
          className={mergeClasses(c.actionBtn, c.moveBtn)} 
          onClick={(e) => { e.stopPropagation(); onMoveUp(index); }}
          title="Move step up"
          aria-label="Move step up"
        >
          <Icons.ArrowUp size={16} />
        </button>
      )}
      {onMoveDown && !isLast && (
        <button 
          type="button"
          className={mergeClasses(c.actionBtn, c.moveBtn)} 
          onClick={(e) => { e.stopPropagation(); onMoveDown(index); }}
          title="Move step down"
          aria-label="Move step down"
        >
          <Icons.ArrowDown size={16} />
        </button>
      )}
      {onRemove && (
        <button 
          type="button"
          className={mergeClasses(c.actionBtn, c.removeBtn)} 
          onClick={(e) => { e.stopPropagation(); onRemove(id); }}
          title="Remove from custom list"
          aria-label="Remove certification"
        >
          <Icons.X size={16} />
        </button>
      )}
      <div 
        className={mergeClasses(c.actionBtn, c.dragHandle)} 
        {...attributes} 
        {...listeners}
        title="Drag to reorder"
        role="button"
        tabIndex={0}
        aria-label="Drag to reorder"
      >
        <Icons.GripVertical size={20} />
      </div>
    </div>
  );

  const examCard = (
    <div 
      className="cert-node__info"
      onClick={() => onNavigate(`/path/${certInfo.pathId}`)}
      style={{ 
        '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)', 
        height: 'auto', 
        margin: 0,
        flex: 1,
        minWidth: 0,
        ...(hasAlignedSkills ? {
          background: 'var(--colorNeutralBackground1)',
          border: '1px solid var(--colorNeutralStroke1)',
          cursor: 'pointer',
        } : {}),
      }}
    >
      <div className="cert-node__info-header">
        <div className="cert-node__icon-title">
          <div className={`cert-node__icon ${badgeUrl ? 'cert-node__icon--image' : ''}`}>
            {badgeUrl ? (
              <img 
                src={badgeUrl} 
                alt={`${certInfo.level} Badge`} 
                className="cert-node__badge-image" 
                loading="lazy"
              />
            ) : (
              <Icons.Award size={20} />
            )}
          </div>
          <div className="cert-node__title-group">
            <h3 className="cert-node__name">
              {certInfo.name.startsWith('Microsoft') ? certInfo.name : `Microsoft Certified: ${certInfo.name}`}
            </h3>
            <div className="cert-node__badge-stats">
              <span className="cert-node__exam-code">{certInfo.examCode}</span>
            </div>
          </div>
        </div>

        {!hasAlignedSkills && actionsBar}
      </div>
      
      <div className="cert-node__info-body">
        <p className="cert-node__description">
          {certInfo.description}
        </p>
      </div>

      <div 
        className="cert-node__info-footer" 
        style={{ 
          marginTop: 'auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: 'var(--space-3)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant={levelVariant} small>{certInfo.level}</Badge>
          {certInfo.prerequisites?.length > 0 && (
            certInfo.prerequisites.map((prereqGroup, idx) => {
              const prereqList = Array.isArray(prereqGroup) ? prereqGroup : [prereqGroup];
              const prereqTexts = prereqList.map(pId => {
                const targetCert = getCertById(pId)?.cert;
                return targetCert ? targetCert.examCode : pId.toUpperCase();
              });
              return (
                <Badge key={`prereq-${idx}`} variant="default" small outline>
                  <Icons.Link size={10} />
                  Prereq: {prereqTexts.join(' OR ')}
                </Badge>
              );
            })
          )}
          <a
            href={certInfo.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-node__learn-link"
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.Microsoft size={12} />
            Microsoft Learn
          </a>
          <button
            type="button"
            className={`cert-node__track-btn ${!isCertIgnored(certInfo.id) ? 'cert-node__track-btn--tracked' : 'cert-node__track-btn--untracked'}`}
            onClick={handleToggleTracking}
            title={!isCertIgnored(certInfo.id) ? 'Tracked in learning dashboard (Click to untrack)' : 'Not tracked (Click to track in dashboard)'}
            aria-label="Toggle dashboard tracking"
          >
            {!isCertIgnored(certInfo.id) ? <Icons.Eye size={14} /> : <Icons.EyeOff size={14} />}
          </button>
        </div>
        
        <div className="cert-node__status-toggle" style={{ flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
          <button
            type="button"
            className={`cert-node__toggle-btn ${status === CERT_STATUS.NOT_STARTED ? 'cert-node__toggle-btn--active' : ''}`}
            onClick={(e) => handleSetStatus(CERT_STATUS.NOT_STARTED, e)}
            title="Not Started"
            aria-label="Mark as Not Started"
          >
            <Icons.Circle size={14} />
          </button>
          <button
            type="button"
            className={`cert-node__toggle-btn ${status === CERT_STATUS.IN_PROGRESS ? 'cert-node__toggle-btn--active' : ''}`}
            onClick={(e) => handleSetStatus(CERT_STATUS.IN_PROGRESS, e)}
            title="In Progress"
            aria-label="Mark as In Progress"
          >
            <Icons.Clock size={14} />
          </button>
          <button
            type="button"
            className={`cert-node__toggle-btn ${(status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) ? 'cert-node__toggle-btn--active' : ''}`}
            onClick={(e) => handleSetStatus(CERT_STATUS.COMPLETED, e)}
            title="Passed"
            aria-label="Mark as Passed"
          >
            <Icons.CheckCircle2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={setNodeRef} style={dndStyle} className={c.stepRoot}>
      <div className={c.stepLayout}>
        {/* Timeline step indicator */}
        <div className={c.timelineIndicator}>
          <div className={nodeStatusClass}>
            {(status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) ? (
              <Icons.Check size={20} />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
        </div>

        {!hasAlignedSkills ? (
          <div style={{ flex: 1, minWidth: 0 }}>
            {examCard}
          </div>
        ) : (
          <div 
            className={c.stageCard}
            style={{ '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)' }}
          >
            {/* Stage Step 1: Preparatory Applied Skills Labs */}
            <div className={c.stageStep}>
              <div className={c.stageStepHeader} style={{ alignItems: 'flex-start' }}>
                <div>
                  <span className={mergeClasses(c.stageStepBadge, c.stageStepBadgePrep)}>
                    <Icons.AppliedSkills size={13} />
                    Step 1 • Optional Lab Preparation
                  </span>
                  <span className={c.stageStepSubtitle}>
                    Optional scenario-based labs recommended before studying for the full certification
                  </span>
                </div>
                {actionsBar}
              </div>
              
              <AlignedAppliedSkills 
                certId={certInfo.id} 
                certCode={certInfo.examCode} 
                onSelectSkill={onSelectSkill} 
              />
            </div>

            {/* Directional Progression Flow Connector */}
            <div className={c.stageConnector} aria-hidden="true">
              <div className={mergeClasses(c.stageConnectorStem, isPrepComplete && c.stageConnectorStemComplete)} />
              <div className={mergeClasses(c.stageConnectorBadge, isPrepComplete && c.stageConnectorBadgeReady)}>
                <div className={mergeClasses(c.stageConnectorIconWrap, isPrepComplete && c.stageConnectorIconWrapReady)}>
                  {isPrepComplete ? (
                    <Icons.CheckCircle2 size={14} />
                  ) : (
                    <Icons.ArrowDown size={14} />
                  )}
                </div>
                <div className={c.stageConnectorContent}>
                  <span className={c.stageConnectorTitle}>
                    Progression Route
                  </span>
                  <div className={c.stageConnectorFlow}>
                    <span className={c.stageConnectorStepName}>Step 1: Optional Labs</span>
                    <Icons.ChevronRight size={11} className={c.stageConnectorChevron} />
                    <span className={c.stageConnectorStepName}>Step 2: Proctored Exam</span>
                  </div>
                </div>
                <div className={c.stageConnectorStatus}>
                  {isPrepComplete ? (
                    <span className={mergeClasses(c.stageConnectorTag, c.stageConnectorTagReady)}>
                      <Icons.Check size={11} />
                      Exam Ready
                    </span>
                  ) : completedLabsCount > 0 ? (
                    <span className={mergeClasses(c.stageConnectorTag, c.stageConnectorTagProgress)}>
                      {completedLabsCount}/{alignedSkills.length} Labs Earned
                    </span>
                  ) : (
                    <span className={c.stageConnectorTag}>
                      Recommended Prep
                    </span>
                  )}
                </div>
              </div>
              <div className={mergeClasses(c.stageConnectorStem, c.stageConnectorStemBottom, isPrepComplete && c.stageConnectorStemComplete)} />
            </div>

            {/* Stage Step 2: Capstone Proctored Exam */}
            <div className={c.stageStep}>
              <div className={c.stageStepHeader}>
                <span className={mergeClasses(c.stageStepBadge, c.stageStepBadgeExam)}>
                  <Icons.Award size={13} />
                  Step 2 • Proctored Certification Exam
                </span>
              </div>
              {examCard}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
