import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  ChevronDoubleLeft20Regular,
  ChevronDoubleRight20Regular,
  Dismiss20Regular,
} from '@fluentui/react-icons';
import { certificationPaths, PILLARS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { IconMap as Icons } from '../common/IconMap';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 199,
    '@media (min-width: 1025px)': {
      display: 'none',
    },
  },
  sidebar: {
    position: 'fixed',
    top: '48px',
    left: 0,
    bottom: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRight(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    flexDirection: 'column',
    zIndex: 200,
    overflowY: 'auto',
    overflowX: 'hidden',
    transitionProperty: 'width, transform',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    boxShadow: tokens.shadow2,
    boxSizing: 'border-box',
    '@media (max-width: 1024px)': {
      width: '280px',
      transform: 'translateX(-100%)',
    },
  },
  sidebarOpen: {
    width: '280px',
    '@media (max-width: 1024px)': {
      transform: 'translateX(0)',
      boxShadow: tokens.shadow28,
    },
  },
  sidebarCollapsed: {
    width: '64px',
    '@media (max-width: 1024px)': {
      transform: 'translateX(-100%)',
    },
  },
  header: {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    boxSizing: 'border-box',
  },
  headerOpen: {
    ...shorthands.padding(0, tokens.spacingHorizontalM),
    justifyContent: 'space-between',
  },
  headerCollapsed: {
    justifyContent: 'center',
    ...shorthands.padding(0),
  },
  headerTitle: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    ...shorthands.padding(0),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    flexShrink: 0,
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
  },
  toggleDesktop: {
    display: 'flex',
    '@media (max-width: 1024px)': {
      display: 'none',
    },
  },
  toggleMobile: {
    display: 'none',
    '@media (max-width: 1024px)': {
      display: 'flex',
    },
  },
  nav: {
    flexGrow: 1,
    ...shorthands.padding(tokens.spacingVerticalS, 0, 0),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  pillarGroup: {
    marginBottom: tokens.spacingVerticalS,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  pillarTitle: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.05rem',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
  },
  link: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    ...shorthands.padding(0, tokens.spacingHorizontalM),
    textDecorationLine: 'none',
    color: tokens.colorNeutralForeground2,
    transitionProperty: 'background-color, color',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
  },
  linkActive: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: '6px',
    bottom: '6px',
    width: '3px',
    ...shorthands.borderRadius(0, tokens.borderRadiusMedium, tokens.borderRadiusMedium, 0),
    backgroundColor: 'transparent',
    transitionProperty: 'background-color',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  iconBox: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'inherit',
  },
  linkContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
    marginLeft: tokens.spacingHorizontalS,
    overflow: 'hidden',
  },
  linkName: {
    fontSize: tokens.fontSizeBase200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  progressBar: {
    height: '2px',
    backgroundColor: tokens.colorNeutralStroke2,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    marginTop: '4px',
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    transitionProperty: 'width',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  countBadge: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
    marginLeft: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
});

/**
 * Navigation sidebar component displaying all available certification paths.
 * Built with @fluentui/react-components.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the sidebar is currently expanded
 * @param {Function} props.onClose - Callback to close the sidebar (mobile)
 * @param {Function} props.onToggle - Callback to toggle the sidebar state
 */
export default function Sidebar({ isOpen, onClose, onToggle }) {
  const styles = useStyles();
  const { getPathProgress, getAppliedSkillsProgress } = useProgressContext();
  const appliedSkillsStats = getAppliedSkillsProgress();

  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={20} /> : <Icons.Circle size={20} />;
  };

  const sortedPaths = useMemo(() => {
    const active = certificationPaths
      .filter((p) => p.pillar !== PILLARS.RETIRED)
      .slice()
      .sort((a, b) => a.shortName.localeCompare(b.shortName));
    const retired = certificationPaths
      .filter((p) => p.pillar === PILLARS.RETIRED)
      .slice()
      .sort((a, b) => a.shortName.localeCompare(b.shortName));
    return { active, retired };
  }, []);

  const renderNavLink = (path) => {
    const prog = getPathProgress(path.id);
    return (
      <NavLink
        key={path.id}
        to={`/path/${path.id}`}
        className={({ isActive }) =>
          mergeClasses(styles.link, isActive && styles.linkActive)
        }
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
            onClose();
          }
        }}
        id={`sidebar-${path.id}`}
        title={path.shortName}
      >
        {({ isActive }) => (
          <>
            <div
              className={styles.indicator}
              style={{
                backgroundColor: isActive ? path.color : 'transparent',
              }}
            />
            <div className={styles.iconBox} title={path.shortName}>
              {getIcon(path.icon)}
            </div>
            {isOpen && (
              <>
                <div className={styles.linkContent}>
                  <span className={styles.linkName}>{path.shortName}</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${prog.percent}%`,
                        backgroundColor: path.color,
                      }}
                    />
                  </div>
                </div>
                <span className={styles.countBadge}>
                  {prog.completed}/{prog.total}
                </span>
              </>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside
        className={mergeClasses(
          styles.sidebar,
          isOpen ? styles.sidebarOpen : styles.sidebarCollapsed
        )}
        id="path-sidebar"
      >
        <div
          className={mergeClasses(
            styles.header,
            isOpen ? styles.headerOpen : styles.headerCollapsed
          )}
        >
          {isOpen && <span className={styles.headerTitle}>Navigation</span>}
          <button
            type="button"
            className={mergeClasses(styles.toggleBtn, styles.toggleDesktop)}
            onClick={onToggle}
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <ChevronDoubleLeft20Regular />
            ) : (
              <ChevronDoubleRight20Regular />
            )}
          </button>
          <button
            type="button"
            className={mergeClasses(styles.toggleBtn, styles.toggleMobile)}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <Dismiss20Regular />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.pillarGroup}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                mergeClasses(styles.link, isActive && styles.linkActive)
              }
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                  onClose();
                }
              }}
              title="Dashboard"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={styles.indicator}
                    style={{
                      backgroundColor: isActive ? 'var(--colorBrandBackground)' : 'transparent',
                    }}
                  />
                  <div className={styles.iconBox} title="Dashboard">
                    <Icons.LayoutDashboard size={20} />
                  </div>
                  {isOpen && (
                    <div className={styles.linkContent}>
                      <span className={styles.linkName}>Dashboard</span>
                    </div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/career-paths"
              className={({ isActive }) =>
                mergeClasses(styles.link, isActive && styles.linkActive)
              }
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                  onClose();
                }
              }}
              title="Career Paths"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={styles.indicator}
                    style={{
                      backgroundColor: isActive ? 'var(--colorBrandBackground)' : 'transparent',
                    }}
                  />
                  <div className={styles.iconBox} title="Career Paths">
                    <Icons.CareerPath size={20} />
                  </div>
                  {isOpen && (
                    <div className={styles.linkContent}>
                      <span className={styles.linkName}>Career Paths</span>
                    </div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/applied-skills"
              className={({ isActive }) =>
                mergeClasses(styles.link, isActive && styles.linkActive)
              }
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                  onClose();
                }
              }}
              title="Applied Skills"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={styles.indicator}
                    style={{
                      backgroundColor: isActive ? 'var(--colorBrandBackground)' : 'transparent',
                    }}
                  />
                  <div className={styles.iconBox} title="Applied Skills">
                    <Icons.AppliedSkills size={20} />
                  </div>
                  {isOpen && (
                    <>
                      <div className={styles.linkContent}>
                        <span className={styles.linkName}>Applied Skills</span>
                      </div>
                      <span className={styles.countBadge}>
                        {appliedSkillsStats.completed}/{appliedSkillsStats.total}
                      </span>
                    </>
                  )}
                </>
              )}
            </NavLink>
          </div>

          <div className={styles.pillarGroup}>
            {isOpen && (
              <div className={styles.pillarTitle}>Certification Paths</div>
            )}
            {sortedPaths.active.map(renderNavLink)}
          </div>

          {sortedPaths.retired.length > 0 && (
            <div className={styles.pillarGroup}>
              {isOpen && (
                <div className={styles.pillarTitle}>{PILLARS.RETIRED}</div>
              )}
              {sortedPaths.retired.map(renderNavLink)}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
