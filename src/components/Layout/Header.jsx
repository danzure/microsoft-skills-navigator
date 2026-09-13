import { Link } from 'react-router-dom';
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
    ...shorthands.padding(0, tokens.spacingHorizontalM),
    zIndex: 300,
    boxSizing: 'border-box',
    transitionProperty: 'background-color, border-color',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  headerLight: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', 'transparent'),
    boxShadow: tokens.shadow4,
  },
  headerDark: {
    backgroundColor: tokens.colorNeutralBackground5,
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
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    flexShrink: 0,
    transitionProperty: 'background-color',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    '@media (max-width: 1024px)': {
      display: 'inline-flex',
    },
  },
  menuBtnLight: {
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  menuBtnDark: {
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
  },
  brand: {
    display: 'flex',
    alignItems: 'baseline',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
    color: 'inherit',
    textDecorationLine: 'none',
  },
  brandPrefix: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase500,
    letterSpacing: '-0.25px',
    color: 'inherit',
    textDecorationLine: 'none',
    flexShrink: 0,
    ':hover': {
      opacity: 0.85,
    },
  },
  brandDivider: {
    display: 'none',
    fontSize: tokens.fontSizeBase300,
    opacity: 0.4,
    margin: `0 ${tokens.spacingHorizontalXXS}`,
    '@media (min-width: 640px)': {
      display: 'inline',
    },
  },
  brandTitle: {
    display: 'none',
    fontSize: tokens.fontSizeBase300,
    opacity: 0.9,
    letterSpacing: '0.25px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecorationLine: 'none',
    color: 'inherit',
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
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
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
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: '2px',
    },
  },
  searchTriggerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    ...shorthands.border(tokens.strokeWidthThin, 'solid', 'rgba(255, 255, 255, 0.25)'),
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.22)',
      ...shorthands.borderColor('rgba(255, 255, 255, 0.4)'),
    },
  },
  searchTriggerDark: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
    },
  },
  searchTriggerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
    overflow: 'hidden',
  },
  searchTriggerPlaceholder: {
    fontSize: tokens.fontSizeBase300,
    opacity: 0.8,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  searchTriggerKbd: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('2px', tokens.spacingHorizontalXXS),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase100,
    flexShrink: 0,
    userSelect: 'none',
  },
  searchTriggerKbdLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    color: 'inherit',
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
    gap: tokens.spacingHorizontalS,
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
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    flexShrink: 0,
    '@media (max-width: 640px)': {
      display: 'inline-flex',
    },
  },
  mobileSearchBtnLight: {
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  mobileSearchBtnDark: {
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
  },
  dataBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalXXS,
    height: '32px',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    cursor: 'pointer',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
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
    ...shorthands.border(tokens.strokeWidthThin, 'solid', 'rgba(255, 255, 255, 0.25)'),
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      ...shorthands.borderColor('rgba(255, 255, 255, 0.5)'),
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
 * Header Component
 *
 * Displays the top navigation bar containing the sidebar toggle,
 * application brand, search trigger button, data preferences trigger, and theme toggle.
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
          >
            atozazure
          </a>
          <span className={styles.brandDivider}>|</span>
          <Link to="/" className={styles.brandTitle}>
            Skills Navigator
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
            <Search16Regular />
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
