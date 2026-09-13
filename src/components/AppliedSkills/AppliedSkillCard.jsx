import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import Badge from '../common/Badge';
import { IconMap as Icons } from '../common/IconMap';
import { APPLIED_SKILL_STATUS } from '../../data/appliedSkills';

const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    cursor: 'pointer',
    position: 'relative',
    textAlign: 'left',
    transitionProperty: 'background-color, border-color, box-shadow, transform',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
      boxShadow: tokens.shadow4,
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'scale(0.98)',
    },
    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: '2px',
    },
  },
  cardCompleted: {
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorPaletteGreenForeground1,
    backgroundColor: 'color-mix(in srgb, var(--status-completed, #107c41) 5%, var(--colorNeutralBackground2))',
  },
  cardInProgress: {
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorPaletteMarigoldForeground1,
    backgroundColor: 'color-mix(in srgb, var(--status-in-progress, #c19c00) 5%, var(--colorNeutralBackground2))',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalXS,
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    flexWrap: 'wrap',
  },
  toggleBtn: {
    backgroundColor: 'transparent',
    ...shorthands.borderWidth(0),
    cursor: 'pointer',
    color: tokens.colorNeutralForeground3,
    ...shorthands.padding('2px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    transitionProperty: 'color, background-color',
    transitionDuration: '150ms',
    flexShrink: 0,
    ':hover': {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  toggleBtnCompleted: {
    color: 'var(--status-completed, #107c41)',
  },
  toggleBtnInProgress: {
    color: 'var(--status-in-progress, #c19c00)',
  },
  title: {
    ...shorthands.margin(0),
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
  summary: {
    ...shorthands.margin(0),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
    display: '-webkit-box',
    WebkitLineClamp: '2',
    lineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: tokens.spacingVerticalXS,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke3,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  relatedCerts: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    overflow: 'hidden',
  },
});

/**
 * AppliedSkillCard Component
 * Displays a single Applied Skill scenario lab with badges, title, summary,
 * quick completion toggle, and metadata.
 * Built with @fluentui/react-components and makeStyles.
 * 
 * @param {Object} props
 * @param {Object} props.skill - Applied skill data object
 * @param {string} props.status - Current progress status (not_started, in_progress, completed)
 * @param {Function} props.onToggleStatus - Callback to cycle or update progress status
 * @param {Function} props.onClick - Callback when the card is clicked to view details
 */
export default function AppliedSkillCard({
  skill,
  status = APPLIED_SKILL_STATUS.NOT_STARTED,
  onToggleStatus,
  onClick,
}) {
  const styles = useStyles();
  const isCompleted = status === APPLIED_SKILL_STATUS.COMPLETED;
  const isInProgress = status === APPLIED_SKILL_STATUS.IN_PROGRESS;

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (onToggleStatus) {
      onToggleStatus(skill.id);
    }
  };

  const getStatusIcon = () => {
    if (isCompleted) return <Icons.CheckCircle2 size={18} />;
    if (isInProgress) return <Icons.Clock size={18} />;
    return <Icons.Circle size={18} />;
  };

  return (
    <article
      className={mergeClasses(
        styles.card,
        isCompleted && styles.cardCompleted,
        isInProgress && styles.cardInProgress
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${skill.title} - ${status}`}
    >
      <div className={styles.header}>
        <div className={styles.badges}>
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

        <button
          type="button"
          className={mergeClasses(
            styles.toggleBtn,
            isCompleted && styles.toggleBtnCompleted,
            isInProgress && styles.toggleBtnInProgress
          )}
          onClick={handleToggleClick}
          title={`Status: ${status}. Click to cycle.`}
          aria-label={`Cycle status for ${skill.title}`}
        >
          {getStatusIcon()}
        </button>
      </div>

      <h3 className={styles.title}>{skill.title}</h3>
      <p className={styles.summary}>{skill.summary}</p>

      <div className={styles.footer}>
        <span>{skill.duration} • Free</span>
        {skill.relatedCerts && skill.relatedCerts.length > 0 && (
          <div
            className={styles.relatedCerts}
            title={`Reinforces: ${skill.relatedCerts.join(', ').toUpperCase()}`}
          >
            <Badge variant="default" small outline>
              {skill.relatedCerts.length}{' '}
              {skill.relatedCerts.length === 1 ? 'Exam' : 'Exams'}
            </Badge>
          </div>
        )}
      </div>
    </article>
  );
}
