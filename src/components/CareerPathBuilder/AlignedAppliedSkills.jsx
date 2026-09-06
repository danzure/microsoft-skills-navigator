import { useState, useMemo, memo } from 'react';
import { getAppliedSkillsForCert, APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { IconMap as Icons } from '../common/IconMap';
import Badge from '../common/Badge';
import './AlignedAppliedSkills.css';

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
    <div className="cpb-aligned-skills" onClick={(e) => e.stopPropagation()}>
      <div 
        className="cpb-aligned-skills__header"
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
        <div className="cpb-aligned-skills__header-left">
          <div className="cpb-aligned-skills__badge-icon" aria-hidden="true">
            <Icons.AppliedSkills size={18} />
          </div>
          <div className="cpb-aligned-skills__header-text">
            <div className="cpb-aligned-skills__title-row">
              <span className="cpb-aligned-skills__title">Aligned Applied Skills Labs</span>
              <Badge variant={badgeVariant} small>
                {completedCount}/{skills.length} Earned
              </Badge>
            </div>
            <span className="cpb-aligned-skills__subtitle">
              Complete these scenario-based hands-on lab credentials before taking the exam
            </span>
          </div>
        </div>

        <div className="cpb-aligned-skills__header-right">
          <div className="cpb-aligned-skills__progress-track" title={`${percent}% completed`}>
            <div 
              className="cpb-aligned-skills__progress-fill" 
              style={{ width: `${percent}%` }} 
            />
          </div>
          <button 
            type="button" 
            className={`cpb-aligned-skills__toggle-btn ${isExpanded ? 'cpb-aligned-skills__toggle-btn--expanded' : ''}`}
            aria-label={isExpanded ? 'Collapse aligned applied skills' : 'Expand aligned applied skills'}
            tabIndex={-1}
          >
            <Icons.ChevronDown size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="cpb-aligned-skills__list">
          {skills.map((skill) => {
            const skillStatus = getAppliedSkillStatus(skill.id);
            const isCompleted = skillStatus === APPLIED_SKILL_STATUS.COMPLETED;
            const isInProgress = skillStatus === APPLIED_SKILL_STATUS.IN_PROGRESS;

            return (
              <div 
                key={skill.id} 
                className={`cpb-aligned-skills__item ${isCompleted ? 'cpb-aligned-skills__item--completed' : ''} ${isInProgress ? 'cpb-aligned-skills__item--in-progress' : ''}`}
              >
                <div className="cpb-aligned-skills__item-main">
                  <div className="cpb-aligned-skills__item-top">
                    <div className="cpb-aligned-skills__item-badges">
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
                    <span className="cpb-aligned-skills__duration">
                      <Icons.Clock size={12} />
                      {skill.duration} • Free
                    </span>
                  </div>

                  <button
                    type="button"
                    className="cpb-aligned-skills__item-title"
                    onClick={() => onSelectSkill?.(skill)}
                    title="View lab scenario and reinforced objectives"
                  >
                    {skill.title}
                  </button>
                </div>

                <div className="cpb-aligned-skills__item-actions">
                  <div className="cpb-aligned-skills__status-toggle">
                    <button
                      type="button"
                      className={`cpb-aligned-skills__status-btn ${skillStatus === APPLIED_SKILL_STATUS.NOT_STARTED ? 'cpb-aligned-skills__status-btn--active' : ''}`}
                      onClick={(e) => handleStatusChange(skill, APPLIED_SKILL_STATUS.NOT_STARTED, e)}
                      title="Not Started"
                      aria-label="Mark as Not Started"
                    >
                      <Icons.Circle size={12} />
                      <span>Not Started</span>
                    </button>
                    <button
                      type="button"
                      className={`cpb-aligned-skills__status-btn ${isInProgress ? 'cpb-aligned-skills__status-btn--active cpb-aligned-skills__status-btn--in-progress' : ''}`}
                      onClick={(e) => handleStatusChange(skill, APPLIED_SKILL_STATUS.IN_PROGRESS, e)}
                      title="In Progress"
                      aria-label="Mark as In Progress"
                    >
                      <Icons.Clock size={12} />
                      <span>In Progress</span>
                    </button>
                    <button
                      type="button"
                      className={`cpb-aligned-skills__status-btn ${isCompleted ? 'cpb-aligned-skills__status-btn--active cpb-aligned-skills__status-btn--completed' : ''}`}
                      onClick={(e) => handleStatusChange(skill, APPLIED_SKILL_STATUS.COMPLETED, e)}
                      title="Earned"
                      aria-label="Mark as Earned"
                    >
                      <Icons.CheckCircle2 size={12} />
                      <span>Earned</span>
                    </button>
                  </div>

                  <div className="cpb-aligned-skills__links-group">
                    <button
                      type="button"
                      className="cpb-aligned-skills__detail-btn"
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
                      className="cpb-aligned-skills__launch-btn"
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
