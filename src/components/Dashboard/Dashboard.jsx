import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  Certificate20Regular,
  CheckmarkCircle20Regular,
  Clock20Regular,
  Sparkle20Regular,
  ChevronRight16Regular,
  Warning16Regular,
  BookOpen16Regular,
  Add16Regular,
  Subtract16Regular,
  ArrowTrending24Regular,
} from '@fluentui/react-icons';
import { certificationPaths, CERT_STATUS, PILLARS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import Badge from '../common/Badge';
import SEO from '../common/SEO';
import { IconMap as Icons } from '../common/IconMap';

const useStyles = makeStyles({
  dashboard: {
    maxWidth: '1440px',
    margin: '0 auto',
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    boxSizing: 'border-box',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    ...shorthands.padding(0),
    ...shorthands.margin('-1px'),
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
    '@media (min-width: 1024px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  heroMain: {
    flexGrow: 1,
  },
  title: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalS,
    letterSpacing: '-0.02em',
    lineHeight: tokens.lineHeightHero700,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground2,
    maxWidth: '620px',
    lineHeight: tokens.lineHeightBase400,
    marginTop: 0,
  },
  updateLinksRow: {
    marginTop: tokens.spacingVerticalL,
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
  },
  updateBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    height: '32px',
    ...shorthands.padding(0, tokens.spacingHorizontalM),
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    textDecorationLine: 'none',
    boxShadow: tokens.shadow2,
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
      boxShadow: tokens.shadow4,
    },
  },
  heroOverview: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.padding(tokens.spacingVerticalL),
    boxShadow: tokens.shadow4,
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  heroProgress: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  heroProgressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroProgressLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  heroProgressPercent: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  heroProgressTrack: {
    height: '8px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    transitionProperty: 'width',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  heroStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: tokens.spacingHorizontalS,
  },
  statMini: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    boxSizing: 'border-box',
  },
  statMiniClickable: {
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  statMiniIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: tokens.colorBrandForeground1,
  },
  statMiniInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  statMiniValue: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.2,
  },
  statMiniLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
  },
  actionCenter: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingHorizontalL,
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  activityPanel: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalL),
    boxShadow: tokens.shadow2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  activityPanelWarning: {
    ...shorthands.borderColor(tokens.colorPaletteDarkOrangeBorder1),
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
  },
  activityTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  activityCount: {
    marginLeft: 'auto',
    fontSize: tokens.fontSizeBase100,
    ...shorthands.padding('2px', tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightBold,
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      transform: 'translateX(2px)',
    },
  },
  activityItemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: tokens.colorBrandForeground1,
  },
  activityItemContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  activityItemName: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activityItemCode: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
  },
  sectionWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  sectionTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  sectionDesc: {
    margin: 0,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  pathsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  pathCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalL),
    boxShadow: tokens.shadow2,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '160px',
    boxSizing: 'border-box',
    transitionProperty: 'transform, box-shadow, border-color',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-2px)',
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  pathCardIgnored: {
    opacity: 0.85,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  pathCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
  },
  pathIconTitle: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    flexGrow: 1,
    minWidth: 0,
  },
  pathIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    flexShrink: 0,
  },
  pathTitleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    flexGrow: 1,
    minWidth: 0,
  },
  pathBadgeStats: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  pathStatsMini: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  pathName: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase400,
  },
  pathToggleBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding(0),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    flexShrink: 0,
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  pathCardBody: {
    marginTop: tokens.spacingVerticalM,
    flexGrow: 1,
  },
  pathDesc: {
    margin: 0,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  pathProgressContainer: {
    height: '3px',
    backgroundColor: tokens.colorNeutralStroke3,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    marginTop: tokens.spacingVerticalM,
    overflow: 'hidden',
  },
  pathProgressFill: {
    height: '100%',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    transitionProperty: 'width',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalL),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'dashed', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    gap: tokens.spacingVerticalS,
  },
  catalogGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
});

/**
 * Dashboard Component
 *
 * Provides an overview of the user's certification tracking progress.
 * Displays total statistics, an action center for active/expiring certs,
 * tracked paths, and an explore catalog for untracked paths.
 * Built with @fluentui/react-components and makeStyles.
 */
export default function Dashboard() {
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    getOverallProgress,
    getPathProgress,
    getStatus,
    togglePathIgnored,
    isPathIgnored,
    isCertIgnored,
    customPlaylist,
    getAppliedSkillsProgress,
  } = useProgressContext();

  const overall = useMemo(() => getOverallProgress(), [getOverallProgress]);
  const appliedSkillsStats = useMemo(
    () => getAppliedSkillsProgress(),
    [getAppliedSkillsProgress]
  );

  const { inProgressCerts, needsRenewalCerts } = useMemo(() => {
    const inProgress = [];
    const needsRenewal = [];
    const seenInProgress = new Set();
    const seenRenewal = new Set();

    certificationPaths.forEach((path) => {
      path.certifications.forEach((cert) => {
        const stat = getStatus(cert.id);
        if (stat === CERT_STATUS.IN_PROGRESS && !seenInProgress.has(cert.id)) {
          inProgress.push({
            ...cert,
            pathName: path.shortName,
            pathColor: path.color,
            pathId: path.id,
          });
          seenInProgress.add(cert.id);
        } else if (
          stat === CERT_STATUS.NEEDS_RENEWAL &&
          !seenRenewal.has(cert.id)
        ) {
          needsRenewal.push({
            ...cert,
            pathName: path.shortName,
            pathColor: path.color,
            pathId: path.id,
          });
          seenRenewal.add(cert.id);
        }
      });
    });

    return { inProgressCerts: inProgress, needsRenewalCerts: needsRenewal };
  }, [getStatus]);

  const trackedPaths = useMemo(
    () => certificationPaths.filter((p) => !isPathIgnored(p.id)),
    [isPathIgnored]
  );
  const ignoredPaths = useMemo(
    () => certificationPaths.filter((p) => isPathIgnored(p.id)),
    [isPathIgnored]
  );

  const individuallyTrackedCerts = useMemo(() => {
    const certs = [];
    const seen = new Set();

    // Find all cert IDs belonging to a currently tracked path
    const certsInTrackedPaths = new Set();
    certificationPaths.forEach((path) => {
      if (!isPathIgnored(path.id)) {
        path.certifications.forEach((c) => certsInTrackedPaths.add(c.id));
      }
    });

    certificationPaths.forEach((path) => {
      path.certifications.forEach((cert) => {
        const isIndividuallyTracked = !isCertIgnored(cert.id);
        const stat = getStatus(cert.id);
        const hasProgress =
          stat === CERT_STATUS.COMPLETED ||
          stat === CERT_STATUS.IN_PROGRESS ||
          stat === CERT_STATUS.NEEDS_RENEWAL;

        if (
          (isIndividuallyTracked || hasProgress) &&
          !certsInTrackedPaths.has(cert.id) &&
          !seen.has(cert.id)
        ) {
          certs.push({
            ...cert,
            pathName: path.shortName,
            pathColor: path.color,
            pathId: path.id,
          });
          seen.add(cert.id);
        }
      });
    });
    return certs;
  }, [isPathIgnored, isCertIgnored, getStatus]);

  const activeIgnoredPaths = useMemo(
    () =>
      [...ignoredPaths.filter((p) => p.pillar !== PILLARS.RETIRED)].sort(
        (a, b) =>
          (a.shortName || a.name).localeCompare(b.shortName || b.name)
      ),
    [ignoredPaths]
  );
  const retiredIgnoredPaths = useMemo(
    () =>
      [...ignoredPaths.filter((p) => p.pillar === PILLARS.RETIRED)].sort(
        (a, b) =>
          (a.shortName || a.name).localeCompare(b.shortName || b.name)
      ),
    [ignoredPaths]
  );

  const renderPathCard = (path, isIgnored) => {
    const prog = getPathProgress(path.id);
    const Icon = Icons[path.icon] || Icons.Circle;

    return (
      <div
        key={path.id}
        className={mergeClasses(
          styles.pathCard,
          isIgnored && styles.pathCardIgnored
        )}
        onClick={() => navigate(`/path/${path.id}`)}
        id={`dashboard-path-${path.id}`}
      >
        <div className={styles.pathCardHeader}>
          <div className={styles.pathIconTitle}>
            <div className={styles.pathIcon}>
              <Icon size={20} />
            </div>
            <div className={styles.pathTitleGroup}>
              <div className={styles.pathBadgeStats}>
                <Badge color={path.color} small>
                  {path.pillar}
                </Badge>
                {path.id !== 'retired-exams' && (
                  <div className={styles.pathStatsMini}>
                    <span title="Total Available Certifications">
                      {prog.total} exams
                    </span>
                    {prog.completed > 0 && (
                      <span title="Completed">✓ {prog.completed}</span>
                    )}
                    {prog.inProgress > 0 && (
                      <span title="In Progress">◐ {prog.inProgress}</span>
                    )}
                  </div>
                )}
              </div>
              <h2 className={styles.pathName}>{path.shortName}</h2>
            </div>
          </div>
          {path.id !== 'retired-exams' && (
            <button
              type="button"
              className={styles.pathToggleBtn}
              onClick={(e) => {
                e.stopPropagation();
                togglePathIgnored(path.id);
              }}
              title={
                isIgnored
                  ? 'Track this path in My Learning'
                  : 'Remove path from My Learning'
              }
            >
              {isIgnored ? <Add16Regular /> : <Subtract16Regular />}
              <span className={styles.srOnly}>
                {isIgnored ? 'Track' : 'Remove'}
              </span>
            </button>
          )}
        </div>

        <div className={styles.pathCardBody}>
          <p className={styles.pathDesc}>{path.description}</p>
        </div>

        {!isIgnored && path.id !== 'retired-exams' && (
          <div className={styles.pathProgressContainer}>
            <div
              className={styles.pathProgressFill}
              style={{
                width: `${prog.percent}%`,
                backgroundColor: path.color,
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.dashboard} id="dashboard">
      <SEO
        title="Microsoft Skills Navigator & Certification Roadmap | atozazure"
        description="Interactive Microsoft Skills Navigator: visualize certification prerequisites on an interactive metro map, plan role-based career pathways, track exam completion dates, and manage annual renewals across 11 technology tracks."
        canonical="https://skills.atozazure.com/"
      />

      {/* Hero Overview Panel */}
      <div className={styles.hero}>
        <div className={styles.heroMain}>
          <h1 className={styles.title}>
            Microsoft Skills Navigator & Certification Roadmap
          </h1>
          <p className={styles.subtitle}>
            Your interactive guide to the Microsoft certification ecosystem.
            Visualize prerequisite paths on a metro-style map, build role-tailored
            career journeys, track exam completions and annual renewals, and
            budget with real-time exam pricing across {certificationPaths.length}{' '}
            technology paths.
          </p>
          <div className={styles.updateLinksRow}>
            <a
              href="https://techcommunity.microsoft.com/category/skills-hub/blog/skills-hub-blog"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updateBtn}
            >
              <Icons.Microsoft size={16} />
              Skills & Certifications Updates
            </a>
            <a
              href="https://arch-center.azureedge.net/Credentials/Certification-Poster_en-us.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updateBtn}
            >
              <Icons.Microsoft size={16} />
              Official Certification Poster
            </a>
            <a
              href="https://arch-center.azureedge.net/Credentials/microsoft-applied-skills-poster.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.updateBtn}
            >
              <Icons.AppliedSkills size={16} />
              Official Applied Skills Poster
            </a>
          </div>
        </div>

        <div className={styles.heroOverview}>
          <div className={styles.heroProgress}>
            <div className={styles.heroProgressHeader}>
              <span className={styles.heroProgressLabel}>Overall Progress</span>
              <span className={styles.heroProgressPercent}>
                {overall.percent}%
              </span>
            </div>
            <div className={styles.heroProgressTrack}>
              <div
                className={styles.heroProgressFill}
                style={{ width: `${overall.percent}%` }}
              />
            </div>
          </div>

          <div className={styles.heroStatsRow}>
            <div className={styles.statMini}>
              <div className={styles.statMiniIcon}>
                <Certificate20Regular />
              </div>
              <div className={styles.statMiniInfo}>
                <span className={styles.statMiniValue}>{overall.total}</span>
                <span className={styles.statMiniLabel}>Total Exams</span>
              </div>
            </div>

            <div className={styles.statMini}>
              <div className={styles.statMiniIcon}>
                <CheckmarkCircle20Regular />
              </div>
              <div className={styles.statMiniInfo}>
                <span className={styles.statMiniValue}>{overall.completed}</span>
                <span className={styles.statMiniLabel}>Completed</span>
              </div>
            </div>

            <div className={styles.statMini}>
              <div className={styles.statMiniIcon}>
                <Clock20Regular />
              </div>
              <div className={styles.statMiniInfo}>
                <span className={styles.statMiniValue}>
                  {overall.inProgress}
                </span>
                <span className={styles.statMiniLabel}>In Progress</span>
              </div>
            </div>

            <div
              className={mergeClasses(
                styles.statMini,
                styles.statMiniClickable
              )}
              onClick={() => navigate('/applied-skills')}
              title="Open Applied Skills Hub"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/applied-skills');
                }
              }}
            >
              <div className={styles.statMiniIcon}>
                <Sparkle20Regular />
              </div>
              <div className={styles.statMiniInfo}>
                <span className={styles.statMiniValue}>
                  {appliedSkillsStats.completed}/{appliedSkillsStats.total}
                </span>
                <span className={styles.statMiniLabel}>Applied Skills</span>
              </div>
              <ChevronRight16Regular style={{ color: tokens.colorNeutralForeground3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Center */}
      {(inProgressCerts.length > 0 || needsRenewalCerts.length > 0) && (
        <div className={styles.actionCenter}>
          {needsRenewalCerts.length > 0 && (
            <div
              className={mergeClasses(
                styles.activityPanel,
                styles.activityPanelWarning
              )}
            >
              <h2 className={styles.activityTitle}>
                <Warning16Regular />
                Needs Renewal
                <span className={styles.activityCount}>
                  {needsRenewalCerts.length}
                </span>
              </h2>
              <div className={styles.activityList}>
                {needsRenewalCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className={styles.activityItem}
                    onClick={() => navigate(`/path/${cert.pathId}?cert=${cert.id}`)}
                  >
                    <div className={styles.activityItemIcon}>
                      <Warning16Regular />
                    </div>
                    <div className={styles.activityItemContent}>
                      <span className={styles.activityItemName}>
                        {cert.name}
                      </span>
                      <span className={styles.activityItemCode}>
                        {cert.examCode}
                      </span>
                    </div>
                    <Badge color={cert.pathColor} small>
                      {cert.pathName}
                    </Badge>
                    <ChevronRight16Regular />
                  </div>
                ))}
              </div>
            </div>
          )}

          {inProgressCerts.length > 0 && (
            <div className={styles.activityPanel}>
              <h2 className={styles.activityTitle}>
                <Clock20Regular />
                Continue Learning
                <span className={styles.activityCount}>
                  {inProgressCerts.length}
                </span>
              </h2>
              <div className={styles.activityList}>
                {inProgressCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className={styles.activityItem}
                    onClick={() => navigate(`/path/${cert.pathId}?cert=${cert.id}`)}
                  >
                    <div className={styles.activityItemIcon}>
                      <BookOpen16Regular />
                    </div>
                    <div className={styles.activityItemContent}>
                      <span className={styles.activityItemName}>
                        {cert.name}
                      </span>
                      <span className={styles.activityItemCode}>
                        {cert.examCode}
                      </span>
                    </div>
                    <Badge color={cert.pathColor} small>
                      {cert.pathName}
                    </Badge>
                    <ChevronRight16Regular />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Tracked Learning */}
      <div className={styles.sectionWrap}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>My Tracked Learning</h2>
        </div>

        {trackedPaths.length === 0 &&
        individuallyTrackedCerts.length === 0 &&
        (!customPlaylist || customPlaylist.length === 0) ? (
          <div className={styles.emptyState}>
            <ArrowTrending24Regular />
            <p style={{ margin: 0 }}>
              You aren't tracking any paths or individual exams yet. Explore the
              catalog below to start your journey.
            </p>
          </div>
        ) : (
          <>
            {(trackedPaths.length > 0 ||
              (customPlaylist && customPlaylist.length > 0)) && (
              <div className={styles.pathsGrid}>
                {customPlaylist && customPlaylist.length > 0 && (
                  <div
                    className={styles.pathCard}
                    onClick={() => navigate('/career-paths?role=custom')}
                  >
                    <div className={styles.pathCardHeader}>
                      <div className={styles.pathIconTitle}>
                        <div className={styles.pathIcon}>
                          <Icons.SettingsColor size={20} />
                        </div>
                        <div className={styles.pathTitleGroup}>
                          <div className={styles.pathBadgeStats}>
                            <Badge color="var(--colorBrandForeground1)" small>
                              Custom Track
                            </Badge>
                          </div>
                          <h2 className={styles.pathName}>Your Custom Career</h2>
                        </div>
                      </div>
                    </div>

                    <div className={styles.pathCardBody}>
                      <p className={styles.pathDesc}>
                        A personalized playlist of {customPlaylist.length}{' '}
                        certifications tailored to your unique goals.
                      </p>
                    </div>
                  </div>
                )}
                {trackedPaths.map((path) => renderPathCard(path, false))}
              </div>
            )}

            {individuallyTrackedCerts.length > 0 && (
              <div
                style={{
                  marginTop:
                    trackedPaths.length > 0 ||
                    (customPlaylist && customPlaylist.length > 0)
                      ? '24px'
                      : '0',
                }}
              >
                <h3
                  className={styles.sectionTitle}
                  style={{ fontSize: '18px', marginBottom: '16px' }}
                >
                  Individually Tracked Exams
                </h3>
                <div className={styles.activityList}>
                  {individuallyTrackedCerts.map((cert) => (
                    <div
                      key={cert.id}
                      className={styles.activityItem}
                      onClick={() => navigate(`/path/${cert.pathId}?cert=${cert.id}`)}
                    >
                      <div className={styles.activityItemIcon}>
                        <Certificate20Regular />
                      </div>
                      <div className={styles.activityItemContent}>
                        <span className={styles.activityItemName}>
                          {cert.name}
                        </span>
                        <span className={styles.activityItemCode}>
                          {cert.examCode}
                        </span>
                      </div>
                      <Badge color={cert.pathColor} small>
                        {cert.pathName}
                      </Badge>
                      <ChevronRight16Regular />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Explore Catalog */}
      {ignoredPaths.length > 0 && (
        <div className={styles.sectionWrap}>
          {activeIgnoredPaths.length > 0 && (
            <div className={styles.catalogGroup}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Explore Catalog</h2>
                <p className={styles.sectionDesc}>
                  Discover new certification paths, or pick and choose individual
                  exams to add to your tracked learning.
                </p>
              </div>

              <div className={styles.pathsGrid}>
                {activeIgnoredPaths.map((path) => renderPathCard(path, true))}
              </div>
            </div>
          )}

          {retiredIgnoredPaths.length > 0 && (
            <div
              className={styles.catalogGroup}
              style={{
                marginTop: activeIgnoredPaths.length > 0 ? '40px' : '0',
              }}
            >
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Retired Certifications</h2>
                <p className={styles.sectionDesc}>
                  Historically retired or soon-to-be retired certifications.
                </p>
              </div>

              <div className={styles.pathsGrid}>
                {retiredIgnoredPaths.map((path) => renderPathCard(path, true))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
