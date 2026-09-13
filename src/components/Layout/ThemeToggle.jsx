import { useState, useRef, useEffect, useId } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  WeatherSunny16Regular,
  WeatherMoon16Regular,
  Desktop16Regular,
  ChevronDown12Regular,
  Checkmark16Regular,
} from '@fluentui/react-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * Defines the Fluent UI styles for the ThemeToggle dropdown.
 * Matches the atozazure-portfolio-site design system with dual light/dark theme support.
 */
const useStyles = makeStyles({
  container: {
    position: 'relative',
    display: 'inline-block',
    textAlign: 'left',
  },
  triggerBtn: {
    height: '2rem',
    ...shorthands.padding('0', tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    cursor: 'pointer',
    userSelect: 'none',
    boxSizing: 'border-box',
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':active': {
      transform: 'scale(0.97)',
    },
    ':focus-visible': {
      outlineStyle: 'none',
      boxShadow: `0 0 0 ${tokens.strokeWidthThick} ${tokens.colorBrandBackground}`,
    },
  },
  triggerDark: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  triggerDarkOpen: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    color: tokens.colorNeutralForeground1,
    boxShadow: tokens.shadow2,
  },
  triggerLight: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorNeutralForegroundOnBrand} 15%, transparent)`,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', `color-mix(in srgb, ${tokens.colorNeutralForegroundOnBrand} 25%, transparent)`),
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: `color-mix(in srgb, ${tokens.colorNeutralForegroundOnBrand} 25%, transparent)`,
      ...shorthands.borderColor(`color-mix(in srgb, ${tokens.colorNeutralForegroundOnBrand} 50%, transparent)`),
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  triggerLightOpen: {
    backgroundColor: `color-mix(in srgb, ${tokens.colorNeutralForegroundOnBrand} 30%, transparent)`,
    ...shorthands.borderColor(tokens.colorNeutralForegroundOnBrand),
    color: tokens.colorNeutralForegroundOnBrand,
    boxShadow: tokens.shadow2,
  },
  triggerIcon: {
    fontSize: tokens.fontSizeBase300,
    color: 'inherit',
    fill: 'currentColor',
    flexShrink: 0,
  },
  triggerLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    letterSpacing: '0.01rem',
    display: 'none',
    '@media (min-width: 640px)': {
      display: 'inline',
    },
  },
  chevronIcon: {
    fontSize: tokens.fontSizeBase100,
    transitionProperty: 'transform',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    opacity: 0.8,
  },
  chevronRotated: {
    transform: 'rotate(180deg)',
    opacity: 1,
  },
  menuFlyout: {
    position: 'absolute',
    right: 0,
    top: `calc(100% + ${tokens.spacingVerticalXS})`,
    width: '14.5rem',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow16,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalXS),
    zIndex: 200,
    color: tokens.colorNeutralForeground1,
    boxSizing: 'border-box',
  },
  menuHeader: {
    ...shorthands.padding(tokens.spacingVerticalXXS, tokens.spacingHorizontalS),
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.05rem',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    marginTop: tokens.spacingVerticalXXS,
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    textAlign: 'left',
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    userSelect: 'none',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  menuItemFocused: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    color: tokens.colorNeutralForeground1,
  },
  menuItemSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightMedium,
    ':hover': {
      backgroundColor: tokens.colorBrandBackground2,
      color: tokens.colorBrandForeground1,
    },
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
  },
  itemIconBox: {
    width: '1.25rem',
    height: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sunIcon: {
    color: tokens.colorPaletteMarigoldForeground1,
  },
  moonIcon: {
    color: tokens.colorBrandForeground1,
  },
  monitorIcon: {
    color: tokens.colorNeutralForeground2,
  },
  itemTextCol: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  itemLabel: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  itemDesc: {
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase100,
    color: tokens.colorNeutralForeground3,
  },
  checkIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
    marginLeft: tokens.spacingHorizontalS,
  },
});

/**
 * ThemeToggle Component
 *
 * A Fluent 2 flyout dropdown allowing users to select Light, Dark,
 * or Sync with System appearance preferences, matching the governance toolkit design.
 *
 * @param {Object} [props]
 * @param {('system'|'light'|'dark')} [props.themePref] - Optional theme preference override.
 * @param {Function} [props.onSetTheme] - Optional callback to set theme override.
 * @param {boolean} [props.systemPrefersDark] - Optional system preference override.
 * @returns {JSX.Element}
 */
export default function ThemeToggle({
  themePref: propThemePref,
  onSetTheme,
  systemPrefersDark: propSystemPrefersDark,
}) {
  const contextTheme = useTheme();
  const styles = useStyles();

  const activeThemePref = propThemePref || contextTheme.themePref;
  const setActiveTheme = onSetTheme || contextTheme.setTheme;
  const isDark = contextTheme.isDark;
  const isSystemDark =
    propSystemPrefersDark !== undefined
      ? propSystemPrefersDark
      : (contextTheme.systemPrefersDark ??
        (typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-color-scheme: dark)').matches));

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const options = [
    {
      id: 'light',
      label: 'Light',
      description: 'Always light appearance',
      icon: WeatherSunny16Regular,
      iconClass: styles.sunIcon,
    },
    {
      id: 'dark',
      label: 'Dark',
      description: 'Always dark appearance',
      icon: WeatherMoon16Regular,
      iconClass: styles.moonIcon,
    },
    {
      id: 'system',
      label: 'Sync with system',
      description: isSystemDark ? 'Matches device (Dark)' : 'Matches device (Light)',
      icon: Desktop16Regular,
      iconClass: styles.monitorIcon,
    },
  ];

  // Keyboard navigation within the dropdown
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(options.findIndex((opt) => opt.id === activeThemePref));
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          setActiveTheme(options[focusedIndex].id);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const currentOption =
    options.find((opt) => opt.id === activeThemePref) || options[2];
  const CurrentIcon = currentOption.icon;

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setFocusedIndex(options.findIndex((opt) => opt.id === activeThemePref));
          }
        }}
        className={mergeClasses(
          styles.triggerBtn,
          isDark
            ? isOpen
              ? styles.triggerDarkOpen
              : styles.triggerDark
            : isOpen
            ? styles.triggerLightOpen
            : styles.triggerLight
        )}
        aria-label={`Theme: ${currentOption.label}. Change appearance`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        title={`Theme: ${currentOption.label}`}
      >
        <CurrentIcon className={styles.triggerIcon} />
        <span className={styles.triggerLabel}>
          {activeThemePref === 'system' ? 'System' : currentOption.label}
        </span>
        <ChevronDown12Regular
          className={mergeClasses(
            styles.chevronIcon,
            isOpen && styles.chevronRotated
          )}
        />
      </button>

      {/* Flyout Popover Menu */}
      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label="Appearance options"
          className={styles.menuFlyout}
        >
          <div className={styles.menuHeader}>Theme Preference</div>

          <div className={styles.optionsList}>
            {options.map((option, index) => {
              const IconComponent = option.icon;
              const isSelected = activeThemePref === option.id;
              const isFocused = focusedIndex === index;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setActiveTheme(option.id);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={mergeClasses(
                    styles.menuItem,
                    isSelected && styles.menuItemSelected,
                    !isSelected && isFocused && styles.menuItemFocused
                  )}
                >
                  <div className={styles.itemLeft}>
                    <div className={styles.itemIconBox}>
                      <IconComponent className={option.iconClass} />
                    </div>
                    <div className={styles.itemTextCol}>
                      <span className={styles.itemLabel}>{option.label}</span>
                      <span className={styles.itemDesc}>
                        {option.description}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Checkmark16Regular className={styles.checkIcon} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
