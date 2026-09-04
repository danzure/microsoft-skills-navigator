import Badge from '../common/Badge';
import { IconMap as Icons } from '../common/IconMap';
import { APPLIED_SKILL_STATUS } from '../../data/appliedSkills';

/**
 * AppliedSkillCard Component
 * Displays a single Applied Skill scenario lab with badges, title, summary,
 * quick completion toggle, and metadata.
 * 
 * @param {Object} props
 * @param {Object} props.skill - Applied skill data object
 * @param {string} props.status - Current progress status (not_started, in_progress, completed)
 * @param {Function} props.onToggleStatus - Callback to cycle or update progress status
 * @param {Function} props.onClick - Callback when the card is clicked to view details
 */
const AppliedSkillCard = ({ skill, status = APPLIED_SKILL_STATUS.NOT_STARTED, onToggleStatus, onClick }) => {
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
      className={`skill-card ${isCompleted ? 'skill-card--completed' : ''} ${isInProgress ? 'skill-card--in-progress' : ''}`}
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
      <div className="skill-card__header">
        <div className="skill-card__badges">
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
          className={`skill-card__toggle-btn ${isCompleted ? 'skill-card__toggle-btn--completed' : ''} ${isInProgress ? 'skill-card__toggle-btn--in-progress' : ''}`}
          onClick={handleToggleClick}
          title={`Status: ${status}. Click to cycle.`}
          aria-label={`Cycle status for ${skill.title}`}
        >
          {getStatusIcon()}
        </button>
      </div>

      <h3 className="skill-card__title">{skill.title}</h3>
      <p className="skill-card__summary">{skill.summary}</p>

      <div className="skill-card__footer">
        <span>{skill.duration} • Free</span>
        {skill.relatedCerts && skill.relatedCerts.length > 0 && (
          <div className="skill-card__related-certs" title={`Reinforces: ${skill.relatedCerts.join(', ').toUpperCase()}`}>
            <Badge variant="default" small outline>
              {skill.relatedCerts.length} {skill.relatedCerts.length === 1 ? 'Exam' : 'Exams'}
            </Badge>
          </div>
        )}
      </div>
    </article>
  );
};

export default AppliedSkillCard;
