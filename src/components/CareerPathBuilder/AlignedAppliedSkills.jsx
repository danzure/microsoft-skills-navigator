import { useState, useMemo, memo } from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { getAppliedSkillsForCert, APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { IconMap as Icons } from '../common/IconMap';
import Badge from '../common/Badge';

const useClasses = makeStyles({
  root: {
    margin: `${tokens.spacingVerticalM} 0`,
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    borderRadius: tokens.borderRadiusLarge,
    overflow: 'hidden',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: 'var(--duration-faster)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover': {
      borderColor: tokens.colorNeutralStroke2,
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: '1px solid transparent',
    transitionProperty: 'background-color',
    transitionDuration: 'var(--duration-faster)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '-2px',
    },
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    minWidth: 0,
  },
  badgeIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: 'color-mix(in srgb, var(--line-azure) 12%, transparent)',
    color: 'var(--line-azure)',
    flexShrink: 0,
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '@media (max-width: 900px)': {
      display: 'none',
    },
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexShrink: 0,
    marginLeft: tokens.spacingHorizontalM,
  },
  progressTrack: {
    width: '72px',
    height: '6px',
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: tokens.borderRadiusCircular,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--status-in-progress), var(--status-completed))',
    borderRadius: tokens.borderRadiusCircular,
    transitionProperty: 'width',
    transitionDuration: 'var(--duration-gentle)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
  },
  toggleBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: tokens.borderRadiusMedium,
    transitionProperty: 'transform, color',
    transitionDuration: 'var(--duration-normal)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    padding: 0,
  },
  toggleBtnExpanded: {
    transform: 'rotate(180deg)',
  },
  list: {
    padding: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`,
    animationName: {
      from: { opacity: 0, transform: 'translateY(-4px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animationDuration: 'var(--duration-fast)',
    animationTimingFunction: 'var(--curve-easy-ease)',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    borderRadius: tokens.borderRadiusMedium,
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-faster)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover': {
      borderColor: tokens.colorNeutralStroke2,
      boxShadow: tokens.shadow2,
      transform: 'translateX(2px)',
    },
    '@media (max-width: 900px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: tokens.spacingVerticalM,
    },
  },
  itemCompleted: {
    borderLeft: '3px solid var(--status-completed)',
  },
  itemInProgress: {
    borderLeft: '3px solid var(--status-in-progress)',
  },
  itemMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: 0,
  },
  itemTop: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  itemBadges: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap',
  },
  duration: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightMedium,
  },
  itemTitle: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
    margin: 0,
    fontFamily: 'inherit',
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    textAlign: 'left',
    cursor: 'pointer',
    lineHeight: tokens.lineHeightBase300,
    transitionProperty: 'color',
    transitionDuration: 'var(--duration-fast)',
    ':hover': {
      color: tokens.colorBrandForeground1,
      textDecoration: 'underline',
    },
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexShrink: 0,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    '@media (max-width: 900px)': {
      justifyContent: 'space-between',
      width: '100%',
    },
  },
  statusToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '2px',
    gap: '2px',
    '@media (max-width: 600px)': {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
  statusBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    height: '24px',
    border: 'none',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground3,
    fontFamily: 'inherit',
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightMedium,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-faster)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
    ':active': {
      transform: 'scale(0.96)',
    },
    '@media (max-width: 600px)': {
      flex: 1,
      justifyContent: 'center',
    },
  },
  statusBtnActive: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    boxShadow: tokens.shadow2,
  },
  statusBtnInProgress: {
    color: 'var(--status-in-progress)',
  },
  statusBtnCompleted: {
    color: 'var(--status-completed)',
  },
  linksGroup: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  linkBase: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: `0 ${tokens.spacingHorizontalS}`,
    height: '26px',
    fontFamily: 'inherit',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    borderRadius: tokens.borderRadiusMedium,
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':active': {
      transform: 'scale(0.96)',
    },
    '@media (max-width: 600px)': {
      flex: 1,
      justifyContent: 'center',
    },
  },
  detailBtn: {
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    color: tokens.colorNeutralForeground2,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
      borderColor: tokens.colorNeutralStroke2,
    },
  },
  launchBtn: {
    backgroundColor: 'color-mix(in srgb, var(--line-azure) 10%, transparent)',
    border: '1px solid color-mix(in srgb, var(--line-azure) 30%, transparent)',
    color: 'var(--line-azure)',
    ':hover': {
      backgroundColor: 'color-mix(in srgb, var(--line-azure) 18%, transparent)',
      borderColor: 'var(--line-azure)',
      transform: 'translateY(-1px)',
      boxShadow: tokens.shadow2,
    },
  },
});

/**
 * AlignedAppliedSkills Component
 * 
 * Displays the scenario-based Applied Skills credentials associated with a specific
 * Microsoft certification inside Career Pathways. Allows users to directly track lab progress
 * (Not Started, In Progress, Earned), launch interactive sandbox assessments, and inspect details.
 * 
 * @param {Object} props
 * @param {string} props.certId - Certification unique ID (e.g. 'ai-103', 'az-104')
 * @param {string} [props.certCode] - Uppercase exam code for display/toast (e.g. 'AI-103')
 * @param {Function} [props.onSelectSkill] - Callback to open full Applied Skill detail drawer
 */
export const AlignedAppliedSkills = memo(({ certId, certCode, onSelectSkill }) => {
  const c = useClasses();
  const [isExpanded, setIsExpanded] = useState(true);
  const { getAppliedSkillStatus, setAppliedSkillStatus } = useProgressContext();
  const { addToast } = useToast();

  const skills = useMemo(() => getAppliedSkillsForCert(certId), [certId]);

  const { completedCount, percent } = useMemo(() => {
    if (!skills || skills.length === 0) return { completedCount: 0, percent: 0 };
    const completed = skills.filter(
      (s) => getAppliedSkillStatus(s.id) === APPLIED_SKILL_STATUS.COMPLETED
    ).length;
    return {
      completedCount: completed,
      percent: Math.round((completed / skills.length) * 100),
    };
  }, [skills, getAppliedSkillStatus]);

  if (!skills || skills.length === 0) {
    return null;
  }

  const handleStatusChange = (skill, newStatus, e) => {
    e.stopPropagation();
    e.preventDefault();
    setAppliedSkillStatus(skill.id, newStatus);

    const title = skill.title.length > 38 ? `${skill.title.slice(0, 36)}...` : skill.title;

    if (newStatus === APPLIED_SKILL_STATUS.COMPLETED) {
      if (completedCount + 1 === skills.length) {
        addToast(`🎉 All ${skills.length} Applied Skills for ${certCode || certId.toUpperCase()} earned!`, 'success');
      } else {
        addToast(`Marked '${title}' as Earned`, 'success');
      }
    } else if (newStatus === APPLIED_SKILL_STATUS.IN_PROGRESS) {
      addToast(`Marked '${title}' as In Progress`, 'info');
    } else {
      addToast(`Reset '${title}' to Not Started`, 'info');
    }
  };

  const badgeVariant = completedCount === skills.length 
    ? 'completed' 
    : completedCount > 0 
      ? 'in-progress' 
      : 'default';

  return (
    <div className={c.root} onClick={(e) => e.stopPropagation()}>
      <div 
        className={c.header}
        onClick={() => setIsExpanded(prev => !prev)}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(prev => !prev);
          }
        }}
      >
        <div className={c.headerLeft}>
          <div className={c.badgeIcon} aria-hidden="true">
            <Icons.AppliedSkills size={18} />
          </div>
          <div className={c.headerText}>
            <div className={c.titleRow}>
              <span className={c.title}>Aligned Applied Skills Labs</span>
              <Badge variant={badgeVariant} small>
                {completedCount}/{skills.length} Earned
              </Badge>
            </div>
            <span className={c.subtitle}>
              Optional scenario-based labs recommended before studying for the full certification
            </span>
          </div>
        </div>

        <div className={c.headerRight}>
          <div className={c.progressTrack} title={`${percent}% completed`}>
            <div 
              className={c.progressFill} 
              style={{ width: `${percent}%` }} 
            />
          </div>
          <button 
            type="button" 
            className={mergeClasses(c.toggleBtn, isExpanded && c.toggleBtnExpanded)}
            aria-label={isExpanded ? 'Collapse aligned applied skills' : 'Expand aligned applied skills'}
            tabIndex={-1}
          >
            <Icons.ChevronDown size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={c.list}>
          {skills.map((skill) => {
            const skillStatus = getAppliedSkillStatus(skill.id);
            const isCompleted = skillStatus === APPLIED_SKILL_STATUS.COMPLETED;
            const isInProgress = skillStatus === APPLIED_SKILL_STATUS.IN_PROGRESS;

            return (
              <div 
                key={skill.id} 
                className={mergeClasses(
                  c.item,
                  isCompleted && c.itemCompleted,
                  isInProgress && c.itemInProgress
                )}
              >
                <div className={c.itemMain}>
                  <div className={c.itemTop}>
                    <div className={c.itemBadges}>
                      <Badge variant={skill.focus.toLowerCase()} small>
                        {skill.focus}
                      </Badge>
                      <Badge variant="default" small>
                        {skill.level}
                      </Badge>
                      {skill.isNew && (
                        <Badge variant="new" small>
                          New
                        </Badge>
                      )}
                    </div>
                    <span className={c.duration}>
                      <Icons.Clock size={12} />
                      {skill.duration} • Free
                    </span>
                  </div>

                  <button
                    type="button"
                    className={c.itemTitle}
                    onClick={() => onSelectSkill?.(skill)}
                    title="View lab scenario and reinforced objectives"
                  >
                    {skill.title}
                  </button>
                </div>

                <div className={c.itemActions}>
                  <div className={c.statusToggle}>
                    <button
                      type="button"
                      className={mergeClasses(
                        c.statusBtn,
                        skillStatus === APPLIED_SKILL_STATUS.NOT_STARTED && c.statusBtnActive
                      )}
                      onClick={(e) => handleStatusChange(skill, APPLIED_SKILL_STATUS.NOT_STARTED, e)}
                      title="Not Started"
                      aria-label="Mark as Not Started"
                    >
                      <Icons.Circle size={12} />
                      <span>Not Started</span>
                    </button>
                    <button
                      type="button"
                      className={mergeClasses(
                        c.statusBtn,
                        isInProgress && c.statusBtnActive,
                        isInProgress && c.statusBtnInProgress
                      )}
                      onClick={(e) => handleStatusChange(skill, APPLIED_SKILL_STATUS.IN_PROGRESS, e)}
                      title="In Progress"
                      aria-label="Mark as In Progress"
                    >
                      <Icons.Clock size={12} />
                      <span>In Progress</span>
                    </button>
                    <button
                      type="button"
                      className={mergeClasses(
                        c.statusBtn,
                        isCompleted && c.statusBtnActive,
                        isCompleted && c.statusBtnCompleted
                      )}
                      onClick={(e) => handleStatusChange(skill, APPLIED_SKILL_STATUS.COMPLETED, e)}
                      title="Earned"
                      aria-label="Mark as Earned"
                    >
                      <Icons.CheckCircle2 size={12} />
                      <span>Earned</span>
                    </button>
                  </div>

                  <div className={c.linksGroup}>
                    <button
                      type="button"
                      className={mergeClasses(c.linkBase, c.detailBtn)}
                      onClick={() => onSelectSkill?.(skill)}
                      title="View lab details and objectives"
                    >
                      <Icons.Info size={12} />
                      <span>Details</span>
                    </button>
                    <a
                      href={skill.learnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={mergeClasses(c.linkBase, c.launchBtn)}
                      title="Open interactive assessment lab on Microsoft Learn"
                    >
                      <Icons.Microsoft size={12} />
                      <span>Launch Lab</span>
                      <Icons.ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default AlignedAppliedSkills;
