import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Dialog,
  DialogSurface,
  Input,
  Text,
  Badge,
  mergeClasses,
} from '@fluentui/react-components';
import {
  Search20Regular,
  Dismiss20Regular,
  ArrowRight16Regular,
  Open16Regular,
  Certificate16Regular,
  WeatherMoon16Regular,
  WeatherSunny16Regular,
  ArrowSwap16Regular,
  Database16Regular,
  NavigationRegular,
  Sparkle16Regular,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { getAllCertifications, certificationPaths } from '../../data/certificationPaths';
import { careerRoles } from '../../data/careerRoles';
import { appliedSkills } from '../../data/appliedSkills';
import { CURRENCIES } from '../../utils/pricing';
import { isRetiring, isRetired } from '../../utils/helpers';
import { IconMap as Icons } from './IconMap';

const useStyles = makeStyles({
  dialogSurface: {
    ...shorthands.padding(0),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow28,
    maxWidth: '44rem',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  searchHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    gap: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  searchInputWrapper: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    fontSize: tokens.fontSizeBase400,
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    outlineStyle: 'none',
    color: tokens.colorNeutralForeground1,
    '& input': {
      fontSize: tokens.fontSizeBase400,
      backgroundColor: 'transparent',
    },
  },
  escBadge: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding(tokens.spacingVerticalXXS, tokens.spacingHorizontalXS),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    fontSize: tokens.fontSizeBase100,
    lineHeight: tokens.lineHeightBase100,
    fontWeight: tokens.fontWeightSemibold,
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
    flexShrink: 0,
    userSelect: 'none',
    '@media (min-width: 640px)': {
      display: 'inline-flex',
    },
  },
  resultsContainer: {
    maxHeight: '28rem',
    minHeight: '12rem',
    overflowY: 'auto',
    scrollBehavior: 'auto',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    overscrollBehavior: 'contain',
  },
  categoryGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    marginBottom: tokens.spacingVerticalXS,
  },
  categoryHeader: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.05rem',
    userSelect: 'none',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: `background-color ${tokens.durationFast} ${tokens.curveEasyEase}, color ${tokens.durationFast} ${tokens.curveEasyEase}`,
    userSelect: 'none',
    textDecoration: 'none',
    color: 'inherit',
    gap: tokens.spacingHorizontalM,
    ...shorthands.border('none'),
    width: '100%',
    textAlign: 'left',
    boxSizing: 'border-box',
  },
  resultItemActive: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    color: tokens.colorNeutralForeground1,
  },
  resultItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    minWidth: 0,
    flexGrow: 1,
  },
  resultIconBox: {
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    flexShrink: 0,
    transition: `background-color ${tokens.durationFast} ${tokens.curveEasyEase}, color ${tokens.durationFast} ${tokens.curveEasyEase}`,
  },
  resultIconBoxActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  resultMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
    flexGrow: 1,
  },
  resultTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
  },
  resultTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resultSubtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resultRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
  actionIcon: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  footerBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalL),
    ...shorthands.borderTop(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    '@media (max-width: 639px)': {
      justifyContent: 'center',
    },
  },
  shortcutPillsGroup: {
    display: 'none',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    '@media (min-width: 640px)': {
      display: 'flex',
    },
  },
  shortcutPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalL),
    gap: tokens.spacingVerticalS,
    textAlign: 'center',
  },
  emptyTitle: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  emptyDesc: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
});

/**
 * CommandPaletteContent Component
 * 
 * Renders the search input, comprehensive multi-entity index,
 * categorized search results, and handles full keyboard navigation.
 */
function CommandPaletteContent({ onOpenChange, onOpenDataModal, onToggleSidebar }) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { themePref = 'system', setTheme, isDark } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { getStatus, progress } = useProgressContext();
  const { addToast } = useToast();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resultsContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const lastMousePosRef = useRef({ x: -1, y: -1 });
  const isKeyboardNavRef = useRef(false);
  const lastKeyboardTimeRef = useRef(0);

  // Autofocus search input upon mounting
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Build the comprehensive unified search index
  const searchIndex = useMemo(() => {
    const items = [];

    // 1. Navigation & Main Views
    items.push(
      {
        id: 'nav-dashboard',
        category: 'Navigation',
        title: 'Dashboard Overview',
        subtitle: 'Global progress metrics, Action Center, and tracked paths',
        keywords: 'dashboard home overview stats action center progress summary',
        icon: <Icons.LayoutDashboard size={18} />,
        actionType: 'route',
        target: '/',
      },
      {
        id: 'nav-career-paths',
        category: 'Navigation',
        title: 'Career Path Builder',
        subtitle: 'Guided Microsoft role roadmaps & drag-and-drop playlist builder',
        keywords: 'career paths roles roadmaps builder custom plan job skills',
        icon: <Icons.CareerPath size={18} />,
        actionType: 'route',
        target: '/career-paths',
      },
      {
        id: 'nav-applied-skills',
        category: 'Navigation',
        title: 'Applied Skills Hub',
        subtitle: 'Scenario-based hands-on lab assessment credentials & poster',
        keywords: 'applied skills labs hands-on scenario assessments poster directory',
        icon: <Icons.AppliedSkills size={18} />,
        actionType: 'route',
        target: '/applied-skills',
      }
    );

    // 2. All 11 Certification Tracks
    certificationPaths.forEach((path) => {
      const PathIcon = Icons[path.icon] || Icons.Compass;
      const trackName = path.shortName || path.name || 'Certification Track';
      items.push({
        id: `track-${path.id}`,
        category: 'Certification Tracks',
        title: path.name || path.shortName || 'Certification Track',
        subtitle: `${trackName} Track • Full metro map & directory`,
        keywords: `${path.name || ''} ${path.shortName || ''} track path metro roadmap certs`,
        icon: PathIcon ? <PathIcon size={18} /> : <Icons.Compass size={18} />,
        badge: 'Track',
        badgeColor: 'informative',
        actionType: 'path',
        pathId: path.id,
      });
    });

    // 3. Career Roles
    careerRoles.forEach((role) => {
      const RoleIcon = Icons[role.icon] || Icons.CareerPath;
      items.push({
        id: `role-${role.id}`,
        category: 'Career Roles',
        title: `${role.title} Roadmap`,
        subtitle: role.description,
        keywords: `${role.title} career role roadmap architect engineer analyst developer administrator`,
        icon: RoleIcon ? <RoleIcon size={18} /> : <Icons.CareerPath size={18} />,
        badge: 'Role',
        badgeColor: 'brand',
        actionType: 'role',
        roleId: role.id,
      });
    });

    // 4. Certifications & Exams (All active, retiring, and beta credentials)
    const allCerts = getAllCertifications();
    allCerts.forEach((cert) => {
      const retiring = isRetiring(cert);
      const retired = isRetired(cert);
      const status = getStatus ? getStatus(cert.id) : (progress?.[cert.id] || 'not_started');

      let badgeColor = 'informative';
      let badgeLabel = cert.level;

      if (retired) {
        badgeColor = 'danger';
        badgeLabel = 'Retired';
      } else if (retiring) {
        badgeColor = 'warning';
        badgeLabel = 'Retiring';
      } else if (cert.isBeta) {
        badgeColor = 'brand';
        badgeLabel = 'Beta';
      } else if (cert.isNew) {
        badgeColor = 'success';
        badgeLabel = 'New';
      } else if (status === 'completed') {
        badgeColor = 'success';
        badgeLabel = 'Passed';
      } else if (status === 'in_progress') {
        badgeColor = 'brand';
        badgeLabel = 'In Progress';
      } else if (cert.level === 'Fundamentals') {
        badgeColor = 'informative';
      } else if (cert.level === 'Associate') {
        badgeColor = 'brand';
      } else if (cert.level === 'Expert') {
        badgeColor = 'important';
      }

      items.push({
        id: `cert-${cert.pathId}-${cert.id}`,
        category: 'Certifications & Exams',
        title: `${cert.examCode}: ${cert.name}`,
        subtitle: `${cert.pathName} • ${cert.level}${cert.retirementDate ? ` (Retires ${cert.retirementDate})` : ''}`,
        keywords: `${cert.examCode} ${cert.name} ${cert.pathName} ${cert.level} ${cert.description} certification exam credential`,
        icon: <Certificate16Regular />,
        badge: badgeLabel,
        badgeColor,
        actionType: 'cert',
        pathId: cert.pathId,
        certId: cert.id,
      });
    });

    // 5. Applied Skills Labs
    appliedSkills.forEach((skill) => {
      items.push({
        id: `applied-skill-${skill.id}`,
        category: 'Applied Skills Labs',
        title: skill.title,
        subtitle: `${skill.pillar} • ${skill.focus} • ${skill.level} (${skill.duration})`,
        keywords: `${skill.title} ${skill.pillar} ${skill.focus} ${skill.level} applied skill lab assessment`,
        icon: <Sparkle16Regular />,
        badge: skill.focus,
        badgeColor: skill.focus?.toLowerCase() === 'technical' ? 'brand' : 'subtle',
        actionType: 'applied-skill',
        skillId: skill.id,
      });
    });

    // 6. Quick Actions & Preferences
    const nextThemePref = themePref === 'light' ? 'dark' : themePref === 'dark' ? 'system' : 'light';
    const currentThemeLabel = themePref ? themePref.charAt(0).toUpperCase() + themePref.slice(1) : 'System';
    const nextThemeLabel = nextThemePref.charAt(0).toUpperCase() + nextThemePref.slice(1);

    items.push(
      {
        id: 'action-toggle-theme',
        category: 'Quick Actions',
        title: `Switch Theme (Next: ${nextThemeLabel})`,
        subtitle: `Currently using ${currentThemeLabel} mode (${isDark ? 'Dark appearance' : 'Light appearance'})`,
        keywords: 'theme dark light mode toggle appearance color switch',
        icon: isDark ? <WeatherSunny16Regular /> : <WeatherMoon16Regular />,
        actionType: 'toggle-theme',
      },
      {
        id: 'action-switch-currency',
        category: 'Quick Actions',
        title: `Change Exam Currency (Current: ${currency})`,
        subtitle: 'Cycle between GBP (£), USD ($), and EUR (€)',
        keywords: 'currency price pricing exam cost gbp usd eur switch change',
        icon: <ArrowSwap16Regular />,
        actionType: 'switch-currency',
      },
      {
        id: 'action-open-data',
        category: 'Quick Actions',
        title: 'Data Backup & Restore Preferences',
        subtitle: 'Export certification progress to JSON, restore from backup, or reset',
        keywords: 'data backup restore export import reset settings progress json preferences',
        icon: <Database16Regular />,
        actionType: 'open-data-modal',
      },
      {
        id: 'action-toggle-sidebar',
        category: 'Quick Actions',
        title: 'Toggle Navigation Sidebar',
        subtitle: 'Expand or collapse the left-hand navigation sidebar (Ctrl+B)',
        keywords: 'sidebar menu navigation collapse expand toggle drawer',
        icon: <NavigationRegular />,
        actionType: 'toggle-sidebar',
      },
      {
        id: 'action-ms-learn',
        category: 'Quick Actions',
        title: 'Microsoft Learn Credentials Profile',
        subtitle: 'View official verified Microsoft certifications and transcript',
        keywords: 'microsoft learn official credentials transcript certs verify credly profile',
        icon: <Open16Regular />,
        actionType: 'external',
        target: 'https://learn.microsoft.com/credentials/',
      },
      {
        id: 'action-applied-skills-poster',
        category: 'Quick Actions',
        title: 'Official Applied Skills Poster (PDF)',
        subtitle: 'Download or view the official visual Microsoft Applied Skills roadmap poster',
        keywords: 'applied skills poster pdf download official map roadmap aka.ms/appliedskillsposter',
        icon: <Open16Regular />,
        actionType: 'external',
        target: 'https://aka.ms/appliedskillsposter',
      },
      {
        id: 'action-github-repo',
        category: 'Quick Actions',
        title: 'Skills Navigator Source Code (GitHub)',
        subtitle: 'github.com/danzure/microsoft-skills-navigator',
        keywords: 'github open source code repository git star fork danzure',
        icon: <Open16Regular />,
        actionType: 'external',
        target: 'https://github.com/danzure/microsoft-skills-navigator',
      },
      {
        id: 'action-portfolio',
        category: 'Quick Actions',
        title: 'atozazure.com Architecture Portfolio',
        subtitle: 'Cloud architecture guides, CAF tools, and engineering resources',
        keywords: 'atozazure daniel powley portfolio cloud architecture caf tools blog',
        icon: <Open16Regular />,
        actionType: 'external',
        target: 'https://atozazure.com',
      }
    );

    return items;
  }, [themePref, isDark, currency, getStatus, progress]);

  // Filter items matching query
  const filteredResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return searchIndex;
    }

    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

    return searchIndex.filter((item) => {
      const matchCorpus = `${item.title} ${item.subtitle} ${item.category} ${item.keywords}`.toLowerCase();
      return queryTokens.every((token) => matchCorpus.includes(token));
    });
  }, [query, searchIndex]);

  // Group filtered results by category
  const groupedResults = useMemo(() => {
    const groups = {};
    filteredResults.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredResults]);

  const flatItems = filteredResults;

  // Execute selected command or navigation
  const executeAction = useCallback(
    (item) => {
      if (!item) return;

      if (item.actionType === 'route') {
        onOpenChange(false);
        navigate(item.target);
      } else if (item.actionType === 'path') {
        onOpenChange(false);
        navigate(`/path/${item.pathId}`);
      } else if (item.actionType === 'cert') {
        onOpenChange(false);
        navigate(`/path/${item.pathId}?cert=${item.certId}`);
      } else if (item.actionType === 'role') {
        onOpenChange(false);
        navigate(`/career-paths?role=${item.roleId}`);
      } else if (item.actionType === 'applied-skill') {
        onOpenChange(false);
        navigate(`/applied-skills?skill=${item.skillId}`);
      } else if (item.actionType === 'toggle-theme') {
        const nextTheme = themePref === 'light' ? 'dark' : themePref === 'dark' ? 'system' : 'light';
        setTheme(nextTheme);
        const label = nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1);
        addToast(`Switched appearance to ${label}`, 'info');
      } else if (item.actionType === 'switch-currency') {
        const currencies = Object.keys(CURRENCIES);
        const currentIndex = currencies.indexOf(currency);
        const nextCurrency = currencies[(currentIndex + 1) % currencies.length];
        setCurrency(nextCurrency);
        addToast(`Pricing currency set to ${nextCurrency}`, 'info');
      } else if (item.actionType === 'open-data-modal') {
        onOpenChange(false);
        onOpenDataModal?.();
      } else if (item.actionType === 'toggle-sidebar') {
        onOpenChange(false);
        onToggleSidebar?.();
      } else if (item.actionType === 'external') {
        if (item.target) {
          window.open(item.target, '_blank', 'noopener,noreferrer');
        }
        onOpenChange(false);
      }
    },
    [navigate, onOpenChange, setTheme, themePref, addToast, currency, setCurrency, onOpenDataModal, onToggleSidebar]
  );

  // Keyboard navigation within the open palette
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        lastKeyboardTimeRef.current = Date.now();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        lastKeyboardTimeRef.current = Date.now();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
      } else if (e.key === 'Home') {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        lastKeyboardTimeRef.current = Date.now();
        setSelectedIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        lastKeyboardTimeRef.current = Date.now();
        setSelectedIndex(Math.max(0, flatItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems.length > 0 && flatItems[selectedIndex]) {
          executeAction(flatItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    },
    [executeAction, flatItems, onOpenChange, selectedIndex]
  );

  // Mouse move handler with anti-jitter protection
  const handleItemMouseMove = useCallback(
    (e) => {
      const indexAttr = e.currentTarget.getAttribute('data-index');
      if (indexAttr === null) return;
      const itemIndex = Number(indexAttr);

      if (lastMousePosRef.current.x === -1 && lastMousePosRef.current.y === -1) {
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        if (!isKeyboardNavRef.current && selectedIndex !== itemIndex) {
          setSelectedIndex(itemIndex);
        }
        return;
      }

      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (isKeyboardNavRef.current) {
        const timeSinceKey = Date.now() - lastKeyboardTimeRef.current;
        if (timeSinceKey > 150 && distance > 6) {
          isKeyboardNavRef.current = false;
          lastMousePosRef.current = { x: e.clientX, y: e.clientY };
          setSelectedIndex(itemIndex);
        }
        return;
      }

      if (distance > 0) {
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        if (selectedIndex !== itemIndex) {
          setSelectedIndex(itemIndex);
        }
      }
    },
    [selectedIndex]
  );

  // Scroll active item smoothly into view without ancestor scroll jank
  useEffect(() => {
    const container = resultsContainerRef.current;
    if (!container) return;

    const activeEl = container.querySelector('[data-active="true"]');
    if (!activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    if (activeRect.bottom > containerRect.bottom) {
      container.scrollTop += activeRect.bottom - containerRect.bottom + 6;
    } else if (activeRect.top < containerRect.top) {
      container.scrollTop -= containerRect.top - activeRect.top + 6;
    }
  }, [selectedIndex]);

  let currentGlobalIndex = -1;

  return (
    <DialogSurface className={styles.dialogSurface}>
      {/* Header Search Input */}
      <div className={styles.searchHeader}>
        <div className={styles.searchInputWrapper}>
          <Input
            ref={searchInputRef}
            className={styles.searchInput}
            contentBefore={<Search20Regular />}
            placeholder="Search certifications, roles, skills, tracks, or actions..."
            value={query}
            onChange={(_, data) => {
              setQuery(data.value);
              setSelectedIndex(0);
              if (resultsContainerRef.current) {
                resultsContainerRef.current.scrollTop = 0;
              }
            }}
            onKeyDown={handleKeyDown}
            aria-label="Search certifications and commands"
            contentAfter={
              query ? (
                <Dismiss20Regular
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setQuery('');
                    setSelectedIndex(0);
                    searchInputRef.current?.focus();
                  }}
                  title="Clear search"
                />
              ) : null
            }
          />
        </div>
        <span className={styles.escBadge} title="Press Escape to close">
          ESC
        </span>
      </div>

      {/* Results Container */}
      <div
        ref={resultsContainerRef}
        className={styles.resultsContainer}
        role="listbox"
        aria-label="Search results"
      >
        {flatItems.length === 0 ? (
          <div className={styles.emptyState}>
            <Text className={styles.emptyTitle}>
              No results found for &ldquo;{query}&rdquo;
            </Text>
            <Text className={styles.emptyDesc}>
              Try searching for &ldquo;AZ-104&rdquo;, &ldquo;Solutions Architect&rdquo;, &ldquo;Foundry&rdquo;, &ldquo;Theme&rdquo;, or &ldquo;Currency&rdquo;.
            </Text>
          </div>
        ) : (
          Object.entries(groupedResults).map(([category, items]) => (
            <div key={category} className={styles.categoryGroup}>
              <div className={styles.categoryHeader}>{category}</div>
              {items.map((item) => {
                currentGlobalIndex += 1;
                const itemIndex = currentGlobalIndex;
                const isActive = itemIndex === selectedIndex;
                const isExternal = item.actionType === 'external';

                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={isActive}
                    data-active={isActive ? 'true' : 'false'}
                    data-index={itemIndex}
                    className={mergeClasses(
                      styles.resultItem,
                      isActive && styles.resultItemActive
                    )}
                    onClick={() => executeAction(item)}
                    onMouseMove={handleItemMouseMove}
                  >
                    <div className={styles.resultItemLeft}>
                      <div
                        className={mergeClasses(
                          styles.resultIconBox,
                          isActive && styles.resultIconBoxActive
                        )}
                      >
                        {item.icon}
                      </div>
                      <div className={styles.resultMeta}>
                        <div className={styles.resultTitleRow}>
                          <span className={styles.resultTitle}>{item.title}</span>
                          {item.badge && (
                            <Badge
                              size="small"
                              shape="rounded"
                              appearance="filled"
                              color={item.badgeColor || 'informative'}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <span className={styles.resultSubtitle}>
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className={styles.resultRight}>
                      {isExternal ? (
                        <Open16Regular className={styles.actionIcon} />
                      ) : (
                        <ArrowRight16Regular className={styles.actionIcon} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className={styles.footerBar}>
        <div className={styles.shortcutPillsGroup}>
          <span className={styles.shortcutPill}>
            <span className={styles.escBadge}>↑</span>
            <span className={styles.escBadge}>↓</span> to navigate
          </span>
          <span className={styles.shortcutPill}>
            <span className={styles.escBadge}>↵</span> to select
          </span>
          <span className={styles.shortcutPill}>
            <span className={styles.escBadge}>ESC</span> to close
          </span>
        </div>
        <div>
          <Text size={200}>
            {flatItems.length} {flatItems.length === 1 ? 'item' : 'items'}
          </Text>
        </div>
      </div>
    </DialogSurface>
  );
}

/**
 * CommandPalette Component
 * 
 * An Azure Portal-inspired quick search and action palette triggered globally via Ctrl+K, Cmd+K, or /.
 * Built using Fluent UI v9 React components (@fluentui/react-components).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the palette is visible
 * @param {Function} props.onOpenChange - Callback to toggle visibility
 * @param {Function} [props.onOpenDataModal] - Callback to open the DataModal
 * @param {Function} [props.onToggleSidebar] - Callback to toggle sidebar
 */
export default function CommandPalette({ isOpen, onOpenChange, onOpenDataModal, onToggleSidebar }) {
  // Global keyboard shortcut listener for Ctrl+K, Cmd+K, and /
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target?.tagName?.toLowerCase();
      const isInput =
        targetTag === 'input' ||
        targetTag === 'textarea' ||
        e.target?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!isOpen);
      } else if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpenChange]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(_, data) => onOpenChange(data.open)}
      modalType="modal"
    >
      {isOpen && (
        <CommandPaletteContent
          onOpenChange={onOpenChange}
          onOpenDataModal={onOpenDataModal}
          onToggleSidebar={onToggleSidebar}
        />
      )}
    </Dialog>
  );
}
