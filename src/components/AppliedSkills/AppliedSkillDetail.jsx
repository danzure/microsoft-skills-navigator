import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import Badge from '../common/Badge';
import { IconMap as Icons } from '../common/IconMap';
import { APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { getCertById } from '../../data/certificationPaths';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'var(--bg-overlay, rgba(0, 0, 0, 0.5))',
    zIndex: 500, // --z-modal
    backdropFilter: 'blur(2px)',
    animationDuration: '150ms',
    animationTimingFunction: 'ease-out',
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: '520px',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow64,
    zIndex: 501,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorNeutralStroke2,
    boxSizing: 'border-box',
    animationDuration: '200ms',
    animationTimingFunction: 'cubic-bezier(0, 0, 0, 1)',
    animationName: {
      from: { transform: 'translateX(100%)' },
      to: { transform: 'translateX(0)' },
    },
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke3,
    gap: tokens.spacingHorizontalL,
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 10,
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalL,
    flexGrow: 1,
  },
  badgeWrapper: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: 'drop-shadow(0 3px 10px rgba(0, 120, 212, 0.28))',
    marginTop: tokens.spacingVerticalXXS,
  },
  headerText: {
    flexGrow: 1,
  },
  badgeList: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    flexWrap: 'wrap',
  },
  title: {
    ...shorthands.margin(tokens.spacingVerticalS, 0, 0, 0),
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase600,
  },
  closeBtn: {
    backgroundColor: 'transparent',
    ...shorthands.borderWidth(0),
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    ...shorthands.padding(tokens.spacingVerticalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'background-color, color',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
      color: tokens.colorNeutralForeground1,
    },
  },
  body: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    flexGrow: 1,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  sectionTitle: {
    ...shorthands.margin(0),
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  desc: {
    ...shorthands.margin(0),
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke3),
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  metaLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: '0.5px',
  },
  metaVal: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  statusSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('4px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  statusBtn: {
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalXS,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: 'transparent',
    ...shorthands.borderWidth(0),
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '150ms',
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
  statusBtnActive: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  statusBtnActiveCompleted: {
    color: 'var(--status-completed, #107c41)',
  },
  statusBtnActiveInProgress: {
    color: 'var(--status-in-progress, #c19c00)',
  },
  certChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
  },
  certChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    color: tokens.colorNeutralForeground1,
    textDecorationLine: 'none',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    transitionProperty: 'all',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      color: tokens.colorBrandForeground1,
      textDecorationLine: 'none',
    },
    ':active': {
      transform: 'scale(0.96)',
    },
  },
  footer: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalXL),
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke3,
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'sticky',
    bottom: 0,
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    zIndex: 10,
  },
  launchBtn: {
    flexGrow: 1,
    height: '38px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.border('1px', 'solid', tokens.colorBrandStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    textDecorationLine: 'none',
    transitionProperty: 'all',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      textDecorationLine: 'none',
    },
    ':active': {
      transform: 'scale(0.97)',
    },
  },
});

/**
 * AppliedSkillDetail Component
 * Slide-over drawer / modal displaying detailed lab scenario information,
 * direct Microsoft Learn launch button, status changer, and related certifications.
 * Built with @fluentui/react-components and makeStyles.
 * 
 * @param {Object} props
 * @param {Object} props.skill - Applied skill data object
 * @param {string} props.status - Current progress status
 * @param {Function} props.onClose - Callback to close the detail drawer
 * @param {Function} props.onSetStatus - Callback to update progress status
 */
export default function AppliedSkillDetail({
  skill,
  status = APPLIED_SKILL_STATUS.NOT_STARTED,
  onClose,
  onSetStatus,
}) {
  const styles = useStyles();

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
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={skill.title}
      >
        <header className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.badgeWrapper}>
              <Icons.AppliedSkills size={52} />
            </div>
            <div className={styles.headerText}>
              <div className={styles.badgeList}>
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
              <h2 className={styles.title}>{skill.title}</h2>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close details"
          >
            <Icons.X size={20} />
          </button>
        </header>

        <div className={styles.body}>
          {/* Status Selector */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Your Progress</h3>
            <div className={styles.statusSelector}>
              <button
                type="button"
                className={mergeClasses(
                  styles.statusBtn,
                  status === APPLIED_SKILL_STATUS.NOT_STARTED && styles.statusBtnActive
                )}
                onClick={() => onSetStatus(skill.id, APPLIED_SKILL_STATUS.NOT_STARTED)}
              >
                <Icons.Circle size={16} />
                Not Started
              </button>
              <button
                type="button"
                className={mergeClasses(
                  styles.statusBtn,
                  status === APPLIED_SKILL_STATUS.IN_PROGRESS && mergeClasses(styles.statusBtnActive, styles.statusBtnActiveInProgress)
                )}
                onClick={() => onSetStatus(skill.id, APPLIED_SKILL_STATUS.IN_PROGRESS)}
              >
                <Icons.Clock size={16} />
                In Progress
              </button>
              <button
                type="button"
                className={mergeClasses(
                  styles.statusBtn,
                  status === APPLIED_SKILL_STATUS.COMPLETED && mergeClasses(styles.statusBtnActive, styles.statusBtnActiveCompleted)
                )}
                onClick={() => onSetStatus(skill.id, APPLIED_SKILL_STATUS.COMPLETED)}
              >
                <Icons.CheckCircle2 size={16} />
                Earned
              </button>
            </div>
          </section>

          {/* Scenario Overview */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Scenario Overview</h3>
            <p className={styles.desc}>{skill.summary}</p>
          </section>

          {/* Assessment Metadata */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Lab Details</h3>
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Duration</span>
                <span className={styles.metaVal}>{skill.duration}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Cost</span>
                <span className={styles.metaVal}>Free</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Format</span>
                <span className={styles.metaVal}>Interactive Sandbox Lab</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Pillar</span>
                <span className={styles.metaVal}>{skill.pillar}</span>
              </div>
            </div>
          </section>

          {/* Related Role-Based Certifications */}
          {skill.relatedCerts && skill.relatedCerts.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Reinforces Certifications</h3>
              <p className={styles.desc}>
                Completing this scenario lab directly validates knowledge measured in the following role-based certifications:
              </p>
              <div className={styles.certChips}>
                {skill.relatedCerts.map((certId) => {
                  const certInfo = getCertById(certId);
                  const examCode = certInfo?.cert?.examCode || certId.toUpperCase();
                  const certName = certInfo?.cert?.name || '';
                  const pathId = certInfo?.path?.id;

                  return (
                    <Link
                      key={certId}
                      to={pathId ? `/path/${pathId}?cert=${certId}` : `/`}
                      className={styles.certChip}
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

        <footer className={styles.footer}>
          <a
            href={skill.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.launchBtn}
          >
            <span>Launch Assessment on Microsoft Learn</span>
            <Icons.ExternalLink size={16} />
          </a>
        </footer>
      </aside>
    </>
  );
}
