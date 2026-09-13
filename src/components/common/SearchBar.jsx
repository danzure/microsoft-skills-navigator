import { useState, useRef, useEffect, useMemo } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  Search16Regular,
  Dismiss16Regular,
  ArrowClockwise16Regular,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { getAllCertifications } from '../../data/certificationPaths';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    width: '100%',
  },
  containerMobile: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '100%',
    height: '32px',
    ...shorthands.padding('0', tokens.spacingHorizontalS),
    paddingLeft: '32px',
    paddingRight: '60px',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
    boxSizing: 'border-box',
    outlineStyle: 'none',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    '::placeholder': {
      color: tokens.colorNeutralForeground4,
    },
    ':focus': {
      ...shorthands.borderColor(tokens.colorStrokeFocus2),
      boxShadow: `0 0 0 1px ${tokens.colorStrokeFocus2}`,
    },
  },
  searchIcon: {
    position: 'absolute',
    left: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground3,
    pointerEvents: 'none',
    fontSize: tokens.fontSizeBase300,
  },
  shortcut: {
    position: 'absolute',
    right: tokens.spacingHorizontalS,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('2px', tokens.spacingHorizontalXXS),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase100,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  spinner: {
    position: 'absolute',
    right: tokens.spacingHorizontalS,
    color: tokens.colorBrandForeground1,
  },
  clearBtn: {
    position: 'absolute',
    right: tokens.spacingHorizontalS,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    ...shorthands.padding(0),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
  },
  dropdown: {
    position: 'absolute',
    top: `calc(100% + ${tokens.spacingVerticalXXS})`,
    left: 0,
    right: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow8,
    maxHeight: '320px',
    overflowY: 'auto',
    zIndex: 100,
    ...shorthands.padding(tokens.spacingVerticalXXS, 0),
    boxSizing: 'border-box',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    width: '100%',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground1,
    textAlign: 'left',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transitionProperty: 'background-color',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':focus-visible': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      outlineStyle: 'none',
    },
  },
  resultDot: {
    width: '8px',
    height: '8px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    flexShrink: 0,
  },
  resultInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  resultName: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resultCode: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
  },
  resultPath: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
    marginLeft: tokens.spacingHorizontalS,
  },
  empty: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

/**
 * A search component with autocomplete dropdown that searches across all available certifications.
 * Displays results that match the query in name, code, path name, or description.
 * Built with @fluentui/react-components.
 *
 * @param {Object} props
 * @param {Function} [props.onClose] - Optional callback triggered when a search result is selected
 * @param {boolean} [props.autoFocus=false] - Whether to autofocus the input
 * @param {boolean} [props.isMobile=false] - Whether mobile rendering applies
 */
export default function SearchBar({ onClose, autoFocus = false, isMobile = false }) {
  const styles = useStyles();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown on click or touch outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const hasText = val.trim().length > 0;
    setIsOpen(hasText);
    if (hasText) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setDebouncedQuery('');
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const allCerts = getAllCertifications();

  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];
    return allCerts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.examCode.toLowerCase().includes(q) ||
          c.pathName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [debouncedQuery, allCerts]);

  const handleSelect = (cert) => {
    navigate(`/path/${cert.pathId}?cert=${cert.id}`);
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div
      ref={containerRef}
      className={mergeClasses(styles.container, isMobile && styles.containerMobile)}
    >
      <div className={styles.inputWrapper}>
        <Search16Regular className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search certifications..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setIsOpen(true)}
          id="search-certifications"
        />
        {!query && !isMobile && (
          <span className={styles.shortcut}>Ctrl K</span>
        )}
        {query && isSearching && (
          <ArrowClockwise16Regular className={styles.spinner} />
        )}
        {query && !isSearching && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setQuery('');
              setDebouncedQuery('');
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            <Dismiss16Regular />
          </button>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className={styles.dropdown} role="listbox">
          {results.map((cert) => (
            <button
              key={`${cert.pathId}-${cert.id}`}
              type="button"
              className={styles.resultItem}
              onClick={() => handleSelect(cert)}
            >
              <span
                className={styles.resultDot}
                style={{ backgroundColor: cert.pathColor }}
              />
              <div className={styles.resultInfo}>
                <span className={styles.resultName}>{cert.name}</span>
                <span className={styles.resultCode}>{cert.examCode}</span>
              </div>
              <span className={styles.resultPath}>{cert.pathName}</span>
            </button>
          ))}
        </div>
      )}
      {isOpen && query && results.length === 0 && (
        <div className={styles.dropdown}>
          <div className={styles.empty}>No certifications found</div>
        </div>
      )}
    </div>
  );
}
