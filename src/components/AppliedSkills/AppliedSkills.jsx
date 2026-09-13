import { useState, useMemo } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { getAllAppliedSkills, APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { PILLARS } from '../../data/certificationPaths';
import AppliedSkillCard from './AppliedSkillCard';
import AppliedSkillDetail from './AppliedSkillDetail';
import SEO from '../common/SEO';
import { IconMap as Icons } from '../common/IconMap';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXL),
    maxWidth: '1440px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  hero: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    boxShadow: tokens.shadow2,
    position: 'relative',
    overflow: 'hidden',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #0078D4 0%, #118D57 50%, #dc2626 100%)',
    },
  },
  heroHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
  },
  heroTitleArea: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
  },
  heroIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: 'transparent',
    filter: 'drop-shadow(0 3px 10px rgba(0, 120, 212, 0.28))',
  },
  title: {
    ...shorthands.margin(0),
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.2,
  },
  subtitle: {
    ...shorthands.margin(tokens.spacingVerticalXS, 0, 0, 0),
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXL,
    flexWrap: 'wrap',
    paddingTop: tokens.spacingVerticalS,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke3,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: tokens.fontWeightSemibold,
  },
  statVal: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  statValCompleted: {
    color: 'var(--status-completed, #107c41)',
  },
  statValInProgress: {
    color: 'var(--status-in-progress, #c19c00)',
  },
  statProgressBar: {
    flexGrow: 1,
    minWidth: '200px',
    height: '8px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    overflow: 'hidden',
  },
  statProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--colorBrandBackground, #0f6cbd) 0%, #118D57 100%)',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    transitionProperty: 'width',
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    boxShadow: tokens.shadow2,
  },
  toolbarRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
  },
  searchContainer: {
    position: 'relative',
    flexGrow: 1,
    minWidth: '260px',
    maxWidth: '480px',
  },
  searchInput: {
    width: '100%',
    height: '32px',
    paddingTop: 0,
    paddingRight: '32px',
    paddingBottom: 0,
    paddingLeft: '34px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    outlineStyle: 'none',
    boxSizing: 'border-box',
    transitionProperty: 'border-color',
    transitionDuration: '150ms',
    ':focus': {
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
    '::placeholder': {
      color: tokens.colorNeutralForeground4,
    },
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: tokens.colorNeutralForeground3,
    pointerEvents: 'none',
  },
  searchClear: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    ...shorthands.borderWidth(0),
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    ...shorthands.padding('2px'),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
  viewToggle: {
    display: 'inline-flex',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding('2px'),
    gap: '2px',
  },
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    height: '28px',
    ...shorthands.padding(0, tokens.spacingHorizontalM),
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
  viewBtnActive: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1,
    boxShadow: tokens.shadow2,
    fontWeight: tokens.fontWeightSemibold,
  },
  filterChips: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    marginRight: tokens.spacingHorizontalXXS,
  },
  chip: {
    height: '26px',
    ...shorthands.padding(0, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke3),
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    transitionProperty: 'all',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
      ...shorthands.borderColor(tokens.colorNeutralStroke2),
    },
    ':active': {
      transform: 'scale(0.96)',
    },
  },
  chipActive: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    fontWeight: tokens.fontWeightSemibold,
  },
  posterBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalXXL,
    alignItems: 'start',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  posterColumn: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    boxShadow: tokens.shadow2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    position: 'relative',
    overflow: 'hidden',
  },
  posterColumnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: tokens.spacingVerticalS,
  },
  posterColumnTitle: {
    ...shorthands.margin(0),
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  posterColumnCount: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('2px', tokens.spacingHorizontalXS),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke3),
  },
  swimlane: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  swimlaneHeader: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    ...shorthands.padding(tokens.spacingVerticalXXS, 0),
    '::after': {
      content: '""',
      flexGrow: 1,
      height: '1px',
      backgroundColor: tokens.colorNeutralStroke3,
    },
  },
  swimlaneCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: tokens.spacingVerticalL,
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding(tokens.spacingVerticalXXXL, tokens.spacingHorizontalXXL),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    color: tokens.colorNeutralForeground2,
  },
  emptyStateTitle: {
    ...shorthands.margin(0, 0, tokens.spacingVerticalS, 0),
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  emptyStateText: {
    ...shorthands.margin(0),
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
});

/**
 * AppliedSkills Component
 * Main hub for Microsoft Applied Skills scenario-based lab credentials.
 * Provides an interactive Poster Board view modeled on the official poster
 * and a searchable Directory Grid view.
 * Built with @fluentui/react-components and makeStyles.
 */
export default function AppliedSkills() {
  const styles = useStyles();
  const {
    getAppliedSkillStatus,
    setAppliedSkillStatus,
    cycleAppliedSkillStatus,
    getAppliedSkillsProgress,
  } = useProgressContext();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState('poster'); // 'poster' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedFocus, setSelectedFocus] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeSkillDetail, setActiveSkillDetail] = useState(null);

  const allSkills = useMemo(() => getAllAppliedSkills(), []);
  const stats = useMemo(() => getAppliedSkillsProgress(), [getAppliedSkillsProgress]);

  // Filter skills based on search and active facet filters
  const filteredSkills = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allSkills.filter((skill) => {
      if (selectedPillar !== 'all' && skill.pillar !== selectedPillar) return false;
      if (selectedLevel !== 'all' && skill.level !== selectedLevel) return false;
      if (selectedFocus !== 'all' && skill.focus !== selectedFocus) return false;

      const currentStatus = getAppliedSkillStatus(skill.id);
      if (selectedStatus !== 'all' && currentStatus !== selectedStatus) return false;

      if (query) {
        const matchesTitle = skill.title.toLowerCase().includes(query);
        const matchesSummary = skill.summary.toLowerCase().includes(query);
        const matchesCerts = skill.relatedCerts?.some((c) => c.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSummary && !matchesCerts) return false;
      }

      return true;
    });
  }, [allSkills, searchQuery, selectedPillar, selectedLevel, selectedFocus, selectedStatus, getAppliedSkillStatus]);

  const handleToggleStatus = (skillId) => {
    const nextStatus = cycleAppliedSkillStatus(skillId);
    const skill = allSkills.find((s) => s.id === skillId);
    const skillTitle = skill?.title || 'Applied Skill';

    if (nextStatus === APPLIED_SKILL_STATUS.COMPLETED) {
      addToast(`Earned: ${skillTitle}! 🎉`, 'success');
    } else if (nextStatus === APPLIED_SKILL_STATUS.IN_PROGRESS) {
      addToast(`Marked ${skillTitle} as In Progress ⏱️`, 'info');
    } else {
      addToast(`Reset status for ${skillTitle}`, 'info');
    }
  };

  const handleSetStatus = (skillId, status) => {
    setAppliedSkillStatus(skillId, status);
    const skill = allSkills.find((s) => s.id === skillId);
    const skillTitle = skill?.title || 'Applied Skill';

    if (status === APPLIED_SKILL_STATUS.COMPLETED) {
      addToast(`Earned: ${skillTitle}! 🎉`, 'success');
    } else if (status === APPLIED_SKILL_STATUS.IN_PROGRESS) {
      addToast(`Marked ${skillTitle} as In Progress ⏱️`, 'info');
    } else {
      addToast(`Reset status for ${skillTitle}`, 'info');
    }
  };

  // Grouping for Poster Board View (3 Columns)
  const pillarColumns = [
    {
      id: PILLARS.CLOUD_AI,
      name: 'Cloud & AI Platforms',
      color: 'var(--line-azure, #0078d4)',
      skills: filteredSkills.filter((s) => s.pillar === PILLARS.CLOUD_AI),
    },
    {
      id: PILLARS.BIZ_SOLUTIONS,
      name: 'AI Business Solutions',
      color: 'var(--line-power, #742774)',
      skills: filteredSkills.filter((s) => s.pillar === PILLARS.BIZ_SOLUTIONS),
    },
    {
      id: PILLARS.SECURITY,
      name: 'Security',
      color: 'var(--line-security, #0e7a0d)',
      skills: filteredSkills.filter((s) => s.pillar === PILLARS.SECURITY),
    },
  ];

  return (
    <div className={styles.container}>
      <SEO
        title="Microsoft Applied Skills Labs & Credentials | atozazure"
        description="Explore scenario-based Microsoft Applied Skills interactive assessment labs across Cloud & AI Platforms, AI Business Solutions, and Security. Track your hands-on credential progress."
        canonical="https://skills.atozazure.com/applied-skills"
      />

      {/* Hero Header */}
      <section className={styles.hero}>
        <div className={styles.heroHeader}>
          <div className={styles.heroTitleArea}>
            <div className={styles.heroIcon}>
              <Icons.AppliedSkills size={52} />
            </div>
            <div>
              <h1 className={styles.title}>Microsoft Applied Skills</h1>
              <p className={styles.subtitle}>
                Demonstrate your ability to solve real-world problems with hands-on, scenario-based lab assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Skills</span>
            <span className={styles.statVal}>{stats.total}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Earned</span>
            <span className={mergeClasses(styles.statVal, styles.statValCompleted)}>
              {stats.completed}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>In Progress</span>
            <span className={mergeClasses(styles.statVal, styles.statValInProgress)}>
              {stats.inProgress}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Completion</span>
            <span className={styles.statVal}>{stats.percent}%</span>
          </div>
          <div className={styles.statProgressBar}>
            <div
              className={styles.statProgressFill}
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Toolbar: Search, View Switcher & Filters */}
      <section className={styles.toolbar}>
        <div className={styles.toolbarRow}>
          <div className={styles.searchContainer}>
            <Icons.Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by skill name, topic, or related exam (e.g. AI-103, Purview, C#)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <Icons.X size={14} />
              </button>
            )}
          </div>

          <div className={styles.viewToggle}>
            <button
              type="button"
              className={mergeClasses(
                styles.viewBtn,
                viewMode === 'poster' && styles.viewBtnActive
              )}
              onClick={() => setViewMode('poster')}
              title="Poster Board View (3 Columns like official PDF)"
            >
              <Icons.LayoutGrid size={16} />
              <span>Poster Board</span>
            </button>
            <button
              type="button"
              className={mergeClasses(
                styles.viewBtn,
                viewMode === 'grid' && styles.viewBtnActive
              )}
              onClick={() => setViewMode('grid')}
              title="Directory Grid View"
            >
              <Icons.List size={16} />
              <span>Grid List</span>
            </button>
          </div>
        </div>

        {/* Filter Facets */}
        <div className={styles.toolbarRow}>
          {/* Pillar Filter */}
          <div className={styles.filterChips}>
            <span className={styles.filterLabel}>Pillar:</span>
            <button
              type="button"
              className={mergeClasses(
                styles.chip,
                selectedPillar === 'all' && styles.chipActive
              )}
              onClick={() => setSelectedPillar('all')}
            >
              All Pillars
            </button>
            <button
              type="button"
              className={mergeClasses(
                styles.chip,
                selectedPillar === PILLARS.CLOUD_AI && styles.chipActive
              )}
              onClick={() => setSelectedPillar(PILLARS.CLOUD_AI)}
            >
              Cloud & AI
            </button>
            <button
              type="button"
              className={mergeClasses(
                styles.chip,
                selectedPillar === PILLARS.BIZ_SOLUTIONS && styles.chipActive
              )}
              onClick={() => setSelectedPillar(PILLARS.BIZ_SOLUTIONS)}
            >
              AI Business
            </button>
            <button
              type="button"
              className={mergeClasses(
                styles.chip,
                selectedPillar === PILLARS.SECURITY && styles.chipActive
              )}
              onClick={() => setSelectedPillar(PILLARS.SECURITY)}
            >
              Security
            </button>
          </div>

          {/* Level Filter */}
          <div className={styles.filterChips}>
            <span className={styles.filterLabel}>Level:</span>
            {['all', 'Beginner', 'Intermediate'].map((lvl) => (
              <button
                type="button"
                key={lvl}
                className={mergeClasses(
                  styles.chip,
                  selectedLevel === lvl && styles.chipActive
                )}
                onClick={() => setSelectedLevel(lvl)}
              >
                {lvl === 'all' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>

          {/* Focus Filter */}
          <div className={styles.filterChips}>
            <span className={styles.filterLabel}>Focus:</span>
            {['all', 'Technical', 'Business'].map((f) => (
              <button
                type="button"
                key={f}
                className={mergeClasses(
                  styles.chip,
                  selectedFocus === f && styles.chipActive
                )}
                onClick={() => setSelectedFocus(f)}
              >
                {f === 'all' ? 'All Focus' : f}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className={styles.filterChips}>
            <span className={styles.filterLabel}>Status:</span>
            {[
              { id: 'all', label: 'All Status' },
              { id: APPLIED_SKILL_STATUS.COMPLETED, label: 'Earned' },
              { id: APPLIED_SKILL_STATUS.IN_PROGRESS, label: 'In Progress' },
              { id: APPLIED_SKILL_STATUS.NOT_STARTED, label: 'Not Started' },
            ].map((st) => (
              <button
                type="button"
                key={st.id}
                className={mergeClasses(
                  styles.chip,
                  selectedStatus === st.id && styles.chipActive
                )}
                onClick={() => setSelectedStatus(st.id)}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Poster Board vs Directory Grid */}
      {filteredSkills.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyStateTitle}>No Applied Skills matched your filters</h3>
          <p className={styles.emptyStateText}>Try broadening your search term or resetting your filter selections.</p>
        </div>
      ) : viewMode === 'poster' ? (
        <div className={styles.posterBoard}>
          {pillarColumns.map((col) => {
            const beginnerSkills = col.skills.filter((s) => s.level === 'Beginner');
            const intermediateSkills = col.skills.filter((s) => s.level === 'Intermediate');

            return (
              <div
                key={col.id}
                className={styles.posterColumn}
                style={{ borderTop: `4px solid ${col.color}` }}
              >
                <div
                  className={styles.posterColumnHeader}
                  style={{ borderBottom: `2px solid ${col.color}` }}
                >
                  <h2 className={styles.posterColumnTitle}>
                    <span>{col.name}</span>
                  </h2>
                  <span className={styles.posterColumnCount}>
                    {col.skills.length}
                  </span>
                </div>

                {/* Beginner Swimlane */}
                {beginnerSkills.length > 0 && (
                  <div className={styles.swimlane}>
                    <div className={styles.swimlaneHeader}>
                      <span>Beginner ({beginnerSkills.length})</span>
                    </div>
                    <div className={styles.swimlaneCards}>
                      {beginnerSkills.map((skill) => (
                        <AppliedSkillCard
                          key={skill.id}
                          skill={skill}
                          status={getAppliedSkillStatus(skill.id)}
                          onToggleStatus={handleToggleStatus}
                          onClick={() => setActiveSkillDetail(skill)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Intermediate Swimlane */}
                {intermediateSkills.length > 0 && (
                  <div className={styles.swimlane}>
                    <div className={styles.swimlaneHeader}>
                      <span>Intermediate ({intermediateSkills.length})</span>
                    </div>
                    <div className={styles.swimlaneCards}>
                      {intermediateSkills.map((skill) => (
                        <AppliedSkillCard
                          key={skill.id}
                          skill={skill}
                          status={getAppliedSkillStatus(skill.id)}
                          onToggleStatus={handleToggleStatus}
                          onClick={() => setActiveSkillDetail(skill)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredSkills.map((skill) => (
            <AppliedSkillCard
              key={skill.id}
              skill={skill}
              status={getAppliedSkillStatus(skill.id)}
              onToggleStatus={handleToggleStatus}
              onClick={() => setActiveSkillDetail(skill)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal / Drawer */}
      {activeSkillDetail && (
        <AppliedSkillDetail
          skill={activeSkillDetail}
          status={getAppliedSkillStatus(activeSkillDetail.id)}
          onClose={() => setActiveSkillDetail(null)}
          onSetStatus={handleSetStatus}
        />
      )}
    </div>
  );
}
