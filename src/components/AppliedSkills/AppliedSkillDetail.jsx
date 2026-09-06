import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { IconMap as Icons } from '../common/IconMap';
import { APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { getCertById } from '../../data/certificationPaths';
import './AppliedSkills.css';

/**
 * AppliedSkillDetail Component
 * Slide-over drawer / modal displaying detailed lab scenario information,
 * direct Microsoft Learn launch button, status changer, and related certifications.
 * 
 * @param {Object} props
 * @param {Object} props.skill - Applied skill data object
 * @param {string} props.status - Current progress status
 * @param {Function} props.onClose - Callback to close the detail drawer
 * @param {Function} props.onSetStatus - Callback to update progress status
 */
const AppliedSkillDetail = ({ skill, status = APPLIED_SKILL_STATUS.NOT_STARTED, onClose, onSetStatus }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!skill) return null;

  return (
    <>
      <div className="skill-detail-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="skill-detail-drawer" role="dialog" aria-modal="true" aria-label={skill.title}>
        <header className="skill-detail__header">
          <div className="skill-detail__header-title-group">
            <div className="skill-detail__badge-wrapper">
              <Icons.AppliedSkills size={56} />
            </div>
            <div className="skill-detail__header-text">
              <div className="skill-card__badges">
                <Badge variant={skill.focus.toLowerCase()}>
                  {skill.focus}
                </Badge>
                <Badge variant="default">
                  {skill.level}
                </Badge>
                {skill.isNew && (
                  <Badge variant="new">
                    New
                  </Badge>
                )}
              </div>
              <h2 className="skill-detail__title">{skill.title}</h2>
            </div>
          </div>
          <button
            className="skill-detail__close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            <Icons.X size={20} />
          </button>
        </header>

        <div className="skill-detail__body">
          {/* Status Selector */}
          <section className="skill-detail__section">
            <span className="skill-detail__section-title">Your Progress</span>
            <div className="skill-detail__status-selector">
              <button
                className={`skill-detail__status-btn ${status === APPLIED_SKILL_STATUS.NOT_STARTED ? 'skill-detail__status-btn--active' : ''}`}
                onClick={() => onSetStatus(skill.id, APPLIED_SKILL_STATUS.NOT_STARTED)}
              >
                <Icons.Circle size={16} />
                Not Started
              </button>
              <button
                className={`skill-detail__status-btn ${status === APPLIED_SKILL_STATUS.IN_PROGRESS ? 'skill-detail__status-btn--active skill-detail__status-btn--in-progress' : ''}`}
                onClick={() => onSetStatus(skill.id, APPLIED_SKILL_STATUS.IN_PROGRESS)}
              >
                <Icons.Clock size={16} />
                In Progress
              </button>
              <button
                className={`skill-detail__status-btn ${status === APPLIED_SKILL_STATUS.COMPLETED ? 'skill-detail__status-btn--active skill-detail__status-btn--completed' : ''}`}
                onClick={() => onSetStatus(skill.id, APPLIED_SKILL_STATUS.COMPLETED)}
              >
                <Icons.CheckCircle2 size={16} />
                Earned
              </button>
            </div>
          </section>

          {/* Scenario Overview */}
          <section className="skill-detail__section">
            <span className="skill-detail__section-title">Scenario Overview</span>
            <p className="skill-detail__desc">{skill.summary}</p>
          </section>

          {/* Assessment Metadata */}
          <section className="skill-detail__section">
            <span className="skill-detail__section-title">Lab Details</span>
            <div className="skill-detail__meta-grid">
              <div className="skill-detail__meta-item">
                <span className="skill-detail__meta-label">Duration</span>
                <span className="skill-detail__meta-val">{skill.duration}</span>
              </div>
              <div className="skill-detail__meta-item">
                <span className="skill-detail__meta-label">Cost</span>
                <span className="skill-detail__meta-val">Free</span>
              </div>
              <div className="skill-detail__meta-item">
                <span className="skill-detail__meta-label">Format</span>
                <span className="skill-detail__meta-val">Interactive Sandbox Lab</span>
              </div>
              <div className="skill-detail__meta-item">
                <span className="skill-detail__meta-label">Pillar</span>
                <span className="skill-detail__meta-val">{skill.pillar}</span>
              </div>
            </div>
          </section>

          {/* Related Role-Based Certifications */}
          {skill.relatedCerts && skill.relatedCerts.length > 0 && (
            <section className="skill-detail__section">
              <span className="skill-detail__section-title">Reinforces Certifications</span>
              <p className="skill-detail__desc">
                Completing this scenario lab directly validates knowledge measured in the following role-based certifications:
              </p>
              <div className="skill-detail__cert-chips">
                {skill.relatedCerts.map((certId) => {
                  const certInfo = getCertById(certId);
                  const examCode = certInfo?.cert?.examCode || certId.toUpperCase();
                  const certName = certInfo?.cert?.name || '';
                  const pathId = certInfo?.path?.id;

                  return (
                    <Link
                      key={certId}
                      to={pathId ? `/path/${pathId}?cert=${certId}` : `/`}
                      className="skill-detail__cert-chip"
                      title={certName}
                    >
                      <Icons.Award size={16} />
                      <span>{examCode}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <footer className="skill-detail__footer">
          <a
            href={skill.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="skill-detail__launch-btn"
          >
            <span>Launch Assessment on Microsoft Learn</span>
            <Icons.ExternalLink size={16} />
          </a>
        </footer>
      </aside>
    </>
  );
};

export default AppliedSkillDetail;
