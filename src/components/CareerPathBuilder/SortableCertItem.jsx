import { memo, useMemo } from 'react';
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
import './CareerPathCertCard.css';

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
 * @param {string} props.statusText - The localized text label for the current status.
 * @param {string} props.nodeClass - The CSS class applied to the timeline node based on status.
 * @param {string} props.badgeClass - The CSS class applied to the status badge based on status.
 * @param {React.ElementType} props.StatusIcon - The icon component to display for the current status.
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
  nodeClass, 
  onNavigate, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onSelectSkill 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { setStatus, isCertIgnored, toggleCertIgnored, getAppliedSkillStatus } = useProgressContext();
  const { addToast } = useToast();

  const style = {
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
    <div className="cpb-timeline-card-actions" onClick={(e) => e.stopPropagation()}>
      {onMoveUp && !isFirst && (
        <button 
          type="button"
          className="cpb-timeline-action-btn cpb-timeline-move-btn" 
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
          className="cpb-timeline-action-btn cpb-timeline-move-btn" 
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
          className="cpb-timeline-action-btn cpb-timeline-remove-btn" 
          onClick={(e) => { e.stopPropagation(); onRemove(id); }}
          title="Remove from custom list"
          aria-label="Remove certification"
        >
          <Icons.X size={16} />
        </button>
      )}
      <div 
        className="cpb-timeline-action-btn cpb-timeline-drag-handle" 
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
      className={`cert-node__info ${hasAlignedSkills ? 'cpb-stage__exam-info' : ''}`}
      onClick={() => onNavigate(`/path/${certInfo.pathId}`)}
      style={{ 
        '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)', 
        height: 'auto', 
        margin: 0
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
    <div ref={setNodeRef} style={style} className="cpb-timeline-step cpb-timeline-step--sortable">
      <div className="cpb-timeline-indicator">
        <div className={`cpb-timeline-node ${nodeClass}`}>
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
          className="cpb-stage-card cpb-stage-card--sortable" 
          style={{ '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)', flex: 1, minWidth: 0 }}
        >
          {/* Stage Step 1: Preparatory Applied Skills Labs */}
          <div className="cpb-stage__step cpb-stage__step--prep">
            <div className="cpb-stage__step-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <div>
                <span className="cpb-stage__step-badge cpb-stage__step-badge--prep">
                  <Icons.AppliedSkills size={13} />
                  Step 1 • Optional Lab Preparation
                </span>
                <span className="cpb-stage__step-subtitle">
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
          <div className="cpb-stage__connector" aria-hidden="true">
            <div className={`cpb-stage__connector-stem cpb-stage__connector-stem--top ${isPrepComplete ? 'cpb-stage__connector-stem--complete' : ''}`} />
            <div className={`cpb-stage__connector-badge ${isPrepComplete ? 'cpb-stage__connector-badge--ready' : ''}`}>
              <div className="cpb-stage__connector-icon-wrap">
                {isPrepComplete ? (
                  <Icons.CheckCircle2 size={14} className="cpb-stage__connector-icon" />
                ) : (
                  <Icons.ArrowDown size={14} className="cpb-stage__connector-icon" />
                )}
              </div>
              <div className="cpb-stage__connector-content">
                <span className="cpb-stage__connector-title">
                  Progression Route
                </span>
                <div className="cpb-stage__connector-flow">
                  <span className="cpb-stage__connector-step-name">Step 1: Optional Labs</span>
                  <Icons.ChevronRight size={11} className="cpb-stage__connector-chevron" />
                  <span className="cpb-stage__connector-step-name">Step 2: Proctored Exam</span>
                </div>
              </div>
              <div className="cpb-stage__connector-status">
                {isPrepComplete ? (
                  <span className="cpb-stage__connector-tag cpb-stage__connector-tag--ready">
                    <Icons.Check size={11} />
                    Exam Ready
                  </span>
                ) : completedLabsCount > 0 ? (
                  <span className="cpb-stage__connector-tag cpb-stage__connector-tag--progress">
                    {completedLabsCount}/{alignedSkills.length} Labs Earned
                  </span>
                ) : (
                  <span className="cpb-stage__connector-tag">
                    Recommended Prep
                  </span>
                )}
              </div>
            </div>
            <div className={`cpb-stage__connector-stem cpb-stage__connector-stem--bottom ${isPrepComplete ? 'cpb-stage__connector-stem--complete' : ''}`} />
          </div>

          {/* Stage Step 2: Capstone Proctored Exam */}
          <div className="cpb-stage__step cpb-stage__step--exam">
            <div className="cpb-stage__step-header">
              <span className="cpb-stage__step-badge cpb-stage__step-badge--exam">
                <Icons.Award size={13} />
                Step 2 • Proctored Certification Exam
              </span>
            </div>
            {examCard}
          </div>
        </div>
      )}
    </div>
  );
});
