import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { IconMap as Icons } from '../common/IconMap';
import './ThemeToggle.css';

/**
 * ThemeToggle Component
 * 
 * A Fluent 2 flyout dropdown allowing users to select Light, Dark,
 * or Sync with System appearance preferences.
 * 
 * @param {Object} [props]
 * @param {('system'|'light'|'dark')} [props.themePref] - Optional theme preference override.
 * @param {Function} [props.onSetTheme] - Optional callback to set theme override.
 * @param {boolean} [props.systemPrefersDark] - Optional system preference override.
 * @returns {JSX.Element}
 */
export default function ThemeToggle({ themePref: propThemePref, onSetTheme, systemPrefersDark: propSystemPrefersDark }) {
  const contextTheme = useTheme();
  const activeThemePref = propThemePref || contextTheme.themePref;
  const setActiveTheme = onSetTheme || contextTheme.setTheme;
  const isSystemDark = propSystemPrefersDark !== undefined 
    ? propSystemPrefersDark 
    : (contextTheme.systemPrefersDark ?? (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches));

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Close on click outside
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
      icon: Icons.Sun,
      iconClass: 'theme-toggle__item-icon--sun',
    },
    {
      id: 'dark',
      label: 'Dark',
      description: 'Always dark appearance',
      icon: Icons.Moon,
      iconClass: 'theme-toggle__item-icon--moon',
    },
    {
      id: 'system',
      label: 'Sync with system',
      description: isSystemDark ? 'Matches device (Dark)' : 'Matches device (Light)',
      icon: Icons.Desktop,
      iconClass: 'theme-toggle__item-icon--system',
    },
  ];

  // Keyboard navigation
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

  const currentOption = options.find((opt) => opt.id === activeThemePref) || options[2];
  const CurrentIcon = currentOption.icon;

  return (
    <div ref={containerRef} className="theme-toggle" onKeyDown={handleKeyDown}>
      {/* Toggle Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setFocusedIndex(options.findIndex((opt) => opt.id === activeThemePref));
          }
        }}
        className={`theme-toggle__trigger ${isOpen ? 'theme-toggle__trigger--open' : ''}`}
        aria-label={`Theme: ${currentOption.label}. Change appearance`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title={`Theme: ${currentOption.label}`}
      >
        <CurrentIcon size={16} className="theme-toggle__trigger-icon" />
        <span className="theme-toggle__trigger-label">
          {activeThemePref === 'system' ? 'System' : currentOption.label}
        </span>
        <Icons.ChevronDown
          size={14}
          className={`theme-toggle__chevron ${isOpen ? 'theme-toggle__chevron--open' : ''}`}
        />
      </button>

      {/* Flyout Popover Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Appearance options"
          className="theme-toggle__flyout"
        >
          <div className="theme-toggle__header">
            Theme Preference
          </div>

          <div className="theme-toggle__list">
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
                  className={`theme-toggle__item ${isSelected ? 'theme-toggle__item--selected' : ''} ${isFocused ? 'theme-toggle__item--focused' : ''}`}
                >
                  <div className="theme-toggle__item-left">
                    <div className="theme-toggle__item-icon-wrapper">
                      <IconComponent size={16} className={`theme-toggle__item-icon ${option.iconClass}`} />
                    </div>
                    <div className="theme-toggle__item-text">
                      <span className="theme-toggle__item-title">
                        {option.label}
                      </span>
                      <span className="theme-toggle__item-desc">
                        {option.description}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Icons.Check size={14} className="theme-toggle__item-check" />
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
