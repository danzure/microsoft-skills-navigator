import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressContext } from '../../context/ProgressContext';
import { CERT_STATUS, getCertById } from '../../data/certificationPaths';
import { getAppliedSkillsForCert, APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { IconMap as Icons } from '../common/IconMap';
import Badge from '../common/Badge';
import { getBadgeUrl } from '../../utils/helpers';
import { AlignedAppliedSkills } from './AlignedAppliedSkills';
import '../PathMap/CertNode.css';
import './CareerPathCertCard.css';

/**
 * CareerPathCertCard Component
 * 
 * Displays a progressive milestone stage within the Career Pathways view.
 * When aligned Applied Skills labs exist, presents a sequential learning flow:
 *   Step 1: Hands-on Lab Preparation (Applied Skills credentials)
 *   ↓ Flow Connector
 *   Step 2: Target Certification Exam (Capstone Proctored Exam)
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.certInfo - The certification data to display.
 * @param {Array<string>} props.customPlaylist - Array of cert IDs in custom playlist.
 * @param {Function} props.onAdd - Callback to add cert to custom playlist.
 * @param {Function} props.onRemove - Callback to remove cert from custom playlist.
 * @param {Function} [props.onSelectSkill] - Callback to view lab scenario details.
 * @returns {JSX.Element}
 */
export const CareerPathCertCard = memo(({ certInfo, customPlaylist, onAdd, onRemove, onSelectSkill }) => {
  const navigate = useNavigate();
  const { getStatus, setStatus, getAppliedSkillStatus } = useProgressContext();
  
  const status = getStatus(certInfo.id);
  const isAdded = customPlaylist.includes(certInfo.id);

  const alignedSkills = useMemo(() => getAppliedSkillsForCert(certInfo.id), [certInfo.id]);
  const hasAlignedSkills = alignedSkills && alignedSkills.length > 0;

  const completedLabsCount = useMemo(() => {
    if (!hasAlignedSkills || !getAppliedSkillStatus) return 0;
    return alignedSkills.filter(s => getAppliedSkillStatus(s.id) === APPLIED_SKILL_STATUS.COMPLETED).length;
  }, [hasAlignedSkills, alignedSkills, getAppliedSkillStatus]);

  const isPrepComplete = hasAlignedSkills && completedLabsCount === alignedSkills.length;

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
    Specialty: 'default',
  }[certInfo.level];

  const handleSetStatus = (newStatus, e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus(certInfo.id, newStatus);
  };

  const examCard = (
    <div 
      className={`cert-node__info ${hasAlignedSkills ? 'cpb-stage__exam-info' : ''}`}
      onClick={() => navigate(`/path/${certInfo.pathId}`)}
      style={{ 
        '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)', 
        height: 'auto', 
        margin: 0
      }}
    >
      <div className="cert-node__info-header">
        <div className="cert-node__icon-title">
          <div className={`cert-node__icon ${getBadgeUrl(certInfo.level, certInfo.id) ? 'cert-node__icon--image' : ''}`}>
            {getBadgeUrl(certInfo.level, certInfo.id) ? (
              <img 
                src={getBadgeUrl(certInfo.level, certInfo.id)} 
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
              const prereqTexts = prereqList.map(id => {
                const targetCert = getCertById(id)?.cert;
                return targetCert ? targetCert.examCode : id.toUpperCase();
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
            className={`cert-node__learn-link ${isAdded ? 'cert-node__learn-link--added' : ''}`}
            style={{ 
              border: '1px solid',
              borderColor: isAdded ? 'var(--status-completed)' : 'var(--border-subtle)', 
              color: isAdded ? 'var(--status-completed)' : 'var(--text-secondary)',
              background: isAdded ? 'color-mix(in srgb, var(--status-completed) 10%, transparent)' : 'var(--bg-surface-2)',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              isAdded ? onRemove(certInfo.id) : onAdd(certInfo.id);
            }}
          >
            {isAdded ? <Icons.Check size={12} /> : <Icons.Plus size={12} />}
            {isAdded ? 'Added to Custom' : 'Add to Custom'}
          </button>
        </div>
        
        <div className="cert-node__status-toggle" style={{ flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
          <button
            className={`cert-node__toggle-btn ${status === CERT_STATUS.NOT_STARTED ? 'cert-node__toggle-btn--active' : ''}`}
            onClick={(e) => handleSetStatus(CERT_STATUS.NOT_STARTED, e)}
            title="Not Started"
            aria-label="Mark as Not Started"
          >
            <Icons.Circle size={14} />
          </button>
          <button
            className={`cert-node__toggle-btn ${status === CERT_STATUS.IN_PROGRESS ? 'cert-node__toggle-btn--active' : ''}`}
            onClick={(e) => handleSetStatus(CERT_STATUS.IN_PROGRESS, e)}
            title="In Progress"
            aria-label="Mark as In Progress"
          >
            <Icons.Clock size={14} />
          </button>
          <button
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

  if (!hasAlignedSkills) {
    return examCard;
  }

  return (
    <div 
      className="cpb-stage-card" 
      style={{ '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)' }}
    >
      {/* Stage Step 1: Preparatory Applied Skills Labs */}
      <div className="cpb-stage__step cpb-stage__step--prep">
        <div className="cpb-stage__step-header">
          <span className="cpb-stage__step-badge cpb-stage__step-badge--prep">
            <Icons.AppliedSkills size={13} />
            Step 1 • Optional Lab Preparation
          </span>
          <span className="cpb-stage__step-subtitle">
            Optional scenario-based labs recommended before studying for the full certification
          </span>
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
          {hasAlignedSkills && (
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
                <span className="cpb-stage__connector-tag cpb-stage__connector-tag--prep">
                  Recommended Prep
                </span>
              )}
            </div>
          )}
        </div>
        <div className={`cpb-stage__connector-stem cpb-stage__connector-stem--bottom ${isPrepComplete ? 'cpb-stage__connector-stem--complete' : ''}`} />
      </div>

      {/* Stage Step 2: Target Certification Exam */}
      <div className="cpb-stage__step cpb-stage__step--exam">
        <div className="cpb-stage__step-header">
          <span className="cpb-stage__step-badge cpb-stage__step-badge--exam">
            <Icons.Award size={13} />
            Step 2 • Target Certification Exam
          </span>
        </div>

        {examCard}
      </div>
    </div>
  );
});

export default CareerPathCertCard;
