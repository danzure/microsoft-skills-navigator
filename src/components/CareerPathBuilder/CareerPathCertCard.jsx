import { memo, useMemo } from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';
import { useProgressContext } from '../../context/ProgressContext';
import { CERT_STATUS, getCertById } from '../../data/certificationPaths';
import { getAppliedSkillsForCert, APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { IconMap as Icons } from '../common/IconMap';
import Badge from '../common/Badge';
import { getBadgeUrl } from '../../utils/helpers';
import { AlignedAppliedSkills } from './AlignedAppliedSkills';
import { useCertNodeStyles } from '../PathMap/useCertNodeStyles';

const useClasses = makeStyles({
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
  /* ─── Step Containers ─────────────────────────────────────────────────── */
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
  /* ─── Directional Flow Connector ─────────────────────────────────────── */
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
    '@media (max-width: 768px)': {
      padding: '5px 12px',
      gap: tokens.spacingHorizontalS,
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
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
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
    '@media (max-width: 768px)': {
      fontSize: tokens.fontSizeBase100,
    },
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
    '@media (max-width: 768px)': {
      display: 'none',
    },
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
  const c = useClasses();
  const certClasses = useCertNodeStyles();
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

  const badgeUrl = getBadgeUrl(certInfo.level, certInfo.id);

  // Exam card — reused in both simple and stage layouts
  const examCard = (
    <div 
      className={certClasses.info}
      onClick={() => navigate(`/path/${certInfo.pathId}`)}
      style={{ 
        '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)', 
        height: 'auto', 
        margin: 0,
        ...(hasAlignedSkills ? {
          background: 'var(--colorNeutralBackground1)',
          border: '1px solid var(--colorNeutralStroke1)',
        } : {}),
      }}
    >
      <div className={certClasses.infoHeader}>
        <div className={certClasses.iconTitle}>
          <div className={mergeClasses(certClasses.icon, badgeUrl && certClasses.iconImage)}>
            {badgeUrl ? (
              <img 
                src={badgeUrl} 
                alt={`${certInfo.level} Badge`} 
                className={certClasses.badgeImage} 
                loading="lazy"
              />
            ) : (
              <Icons.Award size={20} />
            )}
          </div>
          <div className={certClasses.titleGroup}>
            <h3 className={certClasses.name}>
              {certInfo.name.startsWith('Microsoft') ? certInfo.name : `Microsoft Certified: ${certInfo.name}`}
            </h3>
            <div className={certClasses.badgeStats}>
              <span className={certClasses.examCode}>{certInfo.examCode}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={certClasses.infoBody}>
        <p className={certClasses.description}>
          {certInfo.description}
        </p>
      </div>

      <div 
        className={certClasses.infoFooter} 
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
            className={certClasses.learnLink}
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.Microsoft size={12} />
            Microsoft Learn
          </a>
          <button
            className={certClasses.learnLink}
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
        
        <div className={certClasses.statusToggle} style={{ flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
          <button
            className={mergeClasses(certClasses.toggleBtn, status === CERT_STATUS.NOT_STARTED && certClasses.toggleBtnActiveNotStarted)}
            onClick={(e) => handleSetStatus(CERT_STATUS.NOT_STARTED, e)}
            title="Not Started"
            aria-label="Mark as Not Started"
          >
            <Icons.Circle size={14} />
          </button>
          <button
            className={mergeClasses(certClasses.toggleBtn, status === CERT_STATUS.IN_PROGRESS && certClasses.toggleBtnActiveInProgress)}
            onClick={(e) => handleSetStatus(CERT_STATUS.IN_PROGRESS, e)}
            title="In Progress"
            aria-label="Mark as In Progress"
          >
            <Icons.Clock size={14} />
          </button>
          <button
            className={mergeClasses(certClasses.toggleBtn, (status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) && certClasses.toggleBtnActivePassed)}
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
      className={c.stageCard} 
      style={{ '--cert-node-color': certInfo.pathColor || 'var(--colorBrandForeground1)' }}
    >
      {/* Stage Step 1: Preparatory Applied Skills Labs */}
      <div className={c.stageStep}>
        <div className={c.stageStepHeader}>
          <span className={mergeClasses(c.stageStepBadge, c.stageStepBadgePrep)}>
            <Icons.AppliedSkills size={13} />
            Step 1 • Optional Lab Preparation
          </span>
          <span className={c.stageStepSubtitle}>
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
          {hasAlignedSkills && (
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
          )}
        </div>
        <div className={mergeClasses(c.stageConnectorStem, c.stageConnectorStemBottom, isPrepComplete && c.stageConnectorStemComplete)} />
      </div>

      {/* Stage Step 2: Target Certification Exam */}
      <div className={c.stageStep}>
        <div className={c.stageStepHeader}>
          <span className={mergeClasses(c.stageStepBadge, c.stageStepBadgeExam)}>
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
