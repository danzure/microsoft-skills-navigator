import { Link, useLocation } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  LineHorizontal320Regular,
  Search16Regular,
  Search20Regular,
  Database16Regular,
} from '@fluentui/react-icons';
import { useTheme } from '../../context/ThemeContext';
import { certificationPaths } from '../../data/certificationPaths';
import ThemeToggle from './ThemeToggle';

const useStyles = makeStyles({
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding(0, '16px'),
    zIndex: 300,
    boxSizing: 'border-box',
    fontFamily:
      "'Segoe UI Variable Text', 'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
    transitionProperty: 'background, background-color, border-color, box-shadow',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  headerLight: {
    backgroundImage: 'linear-gradient(135deg, #0078d4, #005a9e)',
    backgroundColor: '#0078d4',
    color: '#ffffff',
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', 'transparent'),
    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
  },
  headerDark: {
    backgroundImage: 'none',
    backgroundColor: '#1b1a19',
    color: tokens.colorNeutralForeground1,
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    boxShadow: 'none',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexGrow: 1,
    minWidth: 0,
  },
  menuBtn: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    ...shorthands.padding(0),
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    transitionProperty: 'background-color, color',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    '@media (max-width: 1024px)': {
      display: 'inline-flex',
    },
  },
  menuBtnLight: {
    color: '#ffffff',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  menuBtnDark: {
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
  },
  brand: {
    display: 'flex',
    alignItems: 'baseline',
    minWidth: 0,
    color: 'inherit',
    textDecorationLine: 'none',
  },
  brandPrefix: {
    fontWeight: 600,
    fontSize: '18px',
    letterSpacing: '-0.45px',
    fontFamily:
      "'Segoe UI Variable Text', 'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
    color: 'inherit',
    textDecorationLine: 'none',
    flexShrink: 0,
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease',
    ':hover': {
      opacity: 0.8,
    },
  },
  brandDivider: {
    display: 'none',
    fontSize: '14px',
    fontWeight: 400,
    margin: '0 8px',
    opacity: 0.4,
    color: 'inherit',
    userSelect: 'none',
    '@media (min-width: 640px)': {
      display: 'inline',
    },
  },
  brandTitle: {
    display: 'none',
    fontSize: '14px',
    fontWeight: 400,
    opacity: 0.85,
    letterSpacing: '0.35px',
    fontFamily:
      "'Segoe UI Variable Text', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecorationLine: 'none',
    color: 'inherit',
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease',
    ':hover': {
      opacity: 1,
    },
    '@media (min-width: 640px)': {
      display: 'inline',
    },
  },
  center: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '440px',
    minWidth: 0,
    ...shorthands.margin(0, tokens.spacingHorizontalS),
    '@media (max-width: 640px)': {
      display: 'none',
    },
  },
  searchTrigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '32px',
    ...shorthands.padding(0, '12px'),
    ...shorthands.borderRadius('4px'),
    cursor: 'pointer',
    userSelect: 'none',
    boxSizing: 'border-box',
    transitionProperty: 'background-color, border-color, box-shadow, transform',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':active': {
      transform: 'scale(0.99)',
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: '#0078d4',
      outlineOffset: '0px',
    },
  },
  searchTriggerLight: {
    backgroundColor: '#ffffff',
    ...shorthands.border(tokens.strokeWidthThin, 'solid', 'rgba(255, 255, 255, 0.3)'),
    color: '#616161',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      ...shorthands.borderColor('rgba(255, 255, 255, 0.6)'),
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    },
  },
  searchTriggerDark: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    color: tokens.colorNeutralForeground3,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
    },
  },
  searchTriggerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: 0,
    overflow: 'hidden',
  },
  searchTriggerIcon: {
    color: 'inherit',
    flexShrink: 0,
    fontSize: '16px',
  },
  searchTriggerPlaceholder: {
    fontSize: '13px',
    fontWeight: 400,
    color: 'inherit',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  searchTriggerKbd: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('2px', '6px'),
    ...shorthands.borderRadius('3px'),
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: '10.5px',
    fontWeight: 600,
    lineHeight: 1,
    flexShrink: 0,
    userSelect: 'none',
  },
  searchTriggerKbdLight: {
    backgroundColor: '#f0f0f0',
    ...shorthands.border(tokens.strokeWidthThin, 'solid', '#e0e0e0'),
    color: '#616161',
  },
  searchTriggerKbdDark: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    color: tokens.colorNeutralForeground2,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    flexGrow: 1,
    minWidth: 0,
  },
  mobileSearchBtn: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    ...shorthands.padding(0),
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    '@media (max-width: 640px)': {
      display: 'inline-flex',
    },
  },
  mobileSearchBtnLight: {
    color: '#ffffff',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  mobileSearchBtnDark: {
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
  },
  dataBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: '32px',
    ...shorthands.padding(0, '10px'),
    ...shorthands.borderRadius('6px'),
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    boxSizing: 'border-box',
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':active': {
      transform: 'scale(0.97)',
    },
  },
  dataBtnLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    ...shorthands.border(tokens.strokeWidthThin, 'solid', 'rgba(255, 255, 255, 0.2)'),
    color: '#ffffff',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      ...shorthands.borderColor('rgba(255, 255, 255, 0.3)'),
    },
  },
  dataBtnDark: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  dataBtnLabel: {
    display: 'none',
    '@media (min-width: 480px)': {
      display: 'inline',
    },
  },
});

/**
 * Determines the current page title for the header brand area.
 * Matches app.atozazure.com pattern (e.g. atozazure | Dashboard).
 */
const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/career-paths')) return 'Career Paths';
  if (pathname.startsWith('/applied-skills')) return 'Applied Skills';
  if (pathname.startsWith('/path/')) {
    const pathId = pathname.replace('/path/', '').split('/')[0];
    const foundPath = certificationPaths.find((p) => p.id === pathId);
    return foundPath ? foundPath.shortName || foundPath.name : 'Path Map';
  }
  return 'Skills Navigator';
};

/**
 * Header Component
 *
 * Displays the top navigation bar matching the atozazure governance toolkit design (app.atozazure.com).
 * Built with @fluentui/react-components and makeStyles.
 *
 * @param {Object} props
 * @param {Function} props.onToggleSidebar - Callback to toggle sidebar state
 * @param {Function} props.onOpenCommandPalette - Callback to open the Command Palette
 * @param {Function} props.onOpenDataModal - Callback to open the Data & Preferences Modal
 */
export default function Header({
  onToggleSidebar,
  onOpenCommandPalette,
  onOpenDataModal,
}) {
  const styles = useStyles();
  const { isDark } = useTheme();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <header
      className={mergeClasses(
        styles.header,
        isDark ? styles.headerDark : styles.headerLight
      )}
      id="app-header"
    >
      {/* Left section: Sidebar toggle & Brand link */}
      <div className={styles.left}>
        <button
          type="button"
          className={mergeClasses(
            styles.menuBtn,
            isDark ? styles.menuBtnDark : styles.menuBtnLight
          )}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          id="toggle-sidebar"
        >
          <LineHorizontal320Regular />
        </button>
        <div className={styles.brand} id="brand-link">
          <a
            href="https://atozazure.com"
            className={styles.brandPrefix}
            title="atozazure"
          >
            atozazure
          </a>
          <span className={styles.brandDivider}>|</span>
          <Link
            to="/"
            className={styles.brandTitle}
            title={pageTitle}
          >
            {pageTitle}
          </Link>
        </div>
      </div>

      {/* Center section: Command Palette Search Trigger */}
      <div className={styles.center}>
        <button
          type="button"
          className={mergeClasses(
            styles.searchTrigger,
            isDark ? styles.searchTriggerDark : styles.searchTriggerLight
          )}
          onClick={onOpenCommandPalette}
          aria-label="Search or open command palette"
          title={
            isMac
              ? 'Search certifications, roles, skills & actions (⌘K or /)'
              : 'Search certifications, roles, skills & actions (Ctrl+K or /)'
          }
          id="header-search-trigger"
        >
          <div className={styles.searchTriggerLeft}>
            <Search16Regular className={styles.searchTriggerIcon} />
            <span className={styles.searchTriggerPlaceholder}>
              Search or jump to...
            </span>
          </div>
          <span
            className={mergeClasses(
              styles.searchTriggerKbd,
              isDark
                ? styles.searchTriggerKbdDark
                : styles.searchTriggerKbdLight
            )}
          >
            {isMac ? '⌘K' : 'Ctrl K'}
          </span>
        </button>
      </div>

      {/* Right section: Mobile search button, Data preferences & Theme toggle */}
      <div className={styles.right}>
        <button
          type="button"
          className={mergeClasses(
            styles.mobileSearchBtn,
            isDark ? styles.mobileSearchBtnDark : styles.mobileSearchBtnLight
          )}
          onClick={onOpenCommandPalette}
          aria-label="Search certifications"
          title={
            isMac
              ? 'Search certifications (⌘K or /)'
              : 'Search certifications (Ctrl+K or /)'
          }
        >
          <Search20Regular />
        </button>

        <button
          type="button"
          className={mergeClasses(
            styles.dataBtn,
            isDark ? styles.dataBtnDark : styles.dataBtnLight
          )}
          onClick={onOpenDataModal}
          aria-label="Data & preferences"
          title="Data backup, restore & settings"
        >
          <Database16Regular />
          <span className={styles.dataBtnLabel}>Data</span>
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
