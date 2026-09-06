import { useState, useMemo } from 'react';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { getAllAppliedSkills, APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { PILLARS } from '../../data/certificationPaths';
import AppliedSkillCard from './AppliedSkillCard';
import AppliedSkillDetail from './AppliedSkillDetail';
import { IconMap as Icons } from '../common/IconMap';
import './AppliedSkills.css';

/**
 * AppliedSkills Component
 * Main hub for Microsoft Applied Skills scenario-based lab credentials.
 * Provides an interactive Poster Board view modeled on the official July 2026 poster
 * and a searchable Directory Grid view.
 */
const AppliedSkills = () => {
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
      color: 'var(--line-azure)',
      skills: filteredSkills.filter((s) => s.pillar === PILLARS.CLOUD_AI),
    },
    {
      id: PILLARS.BIZ_SOLUTIONS,
      name: 'AI Business Solutions',
      color: 'var(--line-power)',
      skills: filteredSkills.filter((s) => s.pillar === PILLARS.BIZ_SOLUTIONS),
    },
    {
      id: PILLARS.SECURITY,
      name: 'Security',
      color: 'var(--line-security)',
      skills: filteredSkills.filter((s) => s.pillar === PILLARS.SECURITY),
    },
  ];

  return (
    <div className="applied-skills">
      {/* Hero Header */}
      <section className="applied-skills__hero">
        <div className="applied-skills__hero-header">
          <div className="applied-skills__hero-title-area">
            <div className="applied-skills__hero-icon">
              <Icons.AppliedSkills size={52} />
            </div>
            <div>
              <h1 className="applied-skills__title">Microsoft Applied Skills</h1>
              <p className="applied-skills__subtitle">
                Demonstrate your ability to solve real-world problems with hands-on, scenario-based lab assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="applied-skills__stats-row">
          <div className="applied-skills__stat-item">
            <span className="applied-skills__stat-label">Total Skills</span>
            <span className="applied-skills__stat-val">{stats.total}</span>
          </div>
          <div className="applied-skills__stat-item">
            <span className="applied-skills__stat-label">Earned</span>
            <span className="applied-skills__stat-val" style={{ color: 'var(--status-completed)' }}>
              {stats.completed}
            </span>
          </div>
          <div className="applied-skills__stat-item">
            <span className="applied-skills__stat-label">In Progress</span>
            <span className="applied-skills__stat-val" style={{ color: 'var(--status-in-progress)' }}>
              {stats.inProgress}
            </span>
          </div>
          <div className="applied-skills__stat-item">
            <span className="applied-skills__stat-label">Completion</span>
            <span className="applied-skills__stat-val">{stats.percent}%</span>
          </div>
          <div className="applied-skills__stat-progress-bar">
            <div className="applied-skills__stat-progress-fill" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>
      </section>

      {/* Toolbar: Search, View Switcher & Filters */}
      <section className="applied-skills__toolbar">
        <div className="applied-skills__toolbar-row">
          <div className="applied-skills__search-container">
            <Icons.Search size={16} className="applied-skills__search-icon" />
            <input
              type="text"
              className="applied-skills__search-input"
              placeholder="Search by skill name, topic, or related exam (e.g. AI-103, Purview, C#)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="applied-skills__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <Icons.X size={14} />
              </button>
            )}
          </div>

          <div className="applied-skills__view-toggle">
            <button
              className={`applied-skills__view-btn ${viewMode === 'poster' ? 'applied-skills__view-btn--active' : ''}`}
              onClick={() => setViewMode('poster')}
              title="Poster Board View (3 Columns like official PDF)"
            >
              <Icons.LayoutGrid size={16} />
              <span>Poster Board</span>
            </button>
            <button
              className={`applied-skills__view-btn ${viewMode === 'grid' ? 'applied-skills__view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Directory Grid View"
            >
              <Icons.List size={16} />
              <span>Grid List</span>
            </button>
          </div>
        </div>

        {/* Filter Facets */}
        <div className="applied-skills__toolbar-row">
          {/* Pillar Filter */}
          <div className="applied-skills__filter-chips">
            <span className="applied-skills__filter-label">Pillar:</span>
            <button
              className={`applied-skills__chip ${selectedPillar === 'all' ? 'applied-skills__chip--active' : ''}`}
              onClick={() => setSelectedPillar('all')}
            >
              All Pillars
            </button>
            <button
              className={`applied-skills__chip ${selectedPillar === PILLARS.CLOUD_AI ? 'applied-skills__chip--active' : ''}`}
              onClick={() => setSelectedPillar(PILLARS.CLOUD_AI)}
            >
              Cloud & AI
            </button>
            <button
              className={`applied-skills__chip ${selectedPillar === PILLARS.BIZ_SOLUTIONS ? 'applied-skills__chip--active' : ''}`}
              onClick={() => setSelectedPillar(PILLARS.BIZ_SOLUTIONS)}
            >
              AI Business
            </button>
            <button
              className={`applied-skills__chip ${selectedPillar === PILLARS.SECURITY ? 'applied-skills__chip--active' : ''}`}
              onClick={() => setSelectedPillar(PILLARS.SECURITY)}
            >
              Security
            </button>
          </div>

          {/* Level Filter */}
          <div className="applied-skills__filter-chips">
            <span className="applied-skills__filter-label">Level:</span>
            {['all', 'Beginner', 'Intermediate'].map((lvl) => (
              <button
                key={lvl}
                className={`applied-skills__chip ${selectedLevel === lvl ? 'applied-skills__chip--active' : ''}`}
                onClick={() => setSelectedLevel(lvl)}
              >
                {lvl === 'all' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>

          {/* Focus Filter */}
          <div className="applied-skills__filter-chips">
            <span className="applied-skills__filter-label">Focus:</span>
            {['all', 'Technical', 'Business'].map((f) => (
              <button
                key={f}
                className={`applied-skills__chip ${selectedFocus === f ? 'applied-skills__chip--active' : ''}`}
                onClick={() => setSelectedFocus(f)}
              >
                {f === 'all' ? 'All Focus' : f}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="applied-skills__filter-chips">
            <span className="applied-skills__filter-label">Status:</span>
            {[
              { id: 'all', label: 'All Status' },
              { id: APPLIED_SKILL_STATUS.COMPLETED, label: 'Earned' },
              { id: APPLIED_SKILL_STATUS.IN_PROGRESS, label: 'In Progress' },
              { id: APPLIED_SKILL_STATUS.NOT_STARTED, label: 'Not Started' },
            ].map((st) => (
              <button
                key={st.id}
                className={`applied-skills__chip ${selectedStatus === st.id ? 'applied-skills__chip--active' : ''}`}
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
        <div className="applied-skills__empty-state">
          <h3>No Applied Skills matched your filters</h3>
          <p>Try broadening your search term or resetting your filter selections.</p>
        </div>
      ) : viewMode === 'poster' ? (
        <div className="applied-skills__poster-board">
          {pillarColumns.map((col) => {
            const beginnerSkills = col.skills.filter((s) => s.level === 'Beginner');
            const intermediateSkills = col.skills.filter((s) => s.level === 'Intermediate');

            return (
              <div
                key={col.id}
                className="applied-skills__poster-column"
                style={{ '--col-color': col.color }}
              >
                <div className="applied-skills__poster-column-header">
                  <h2 className="applied-skills__poster-column-title">
                    <span>{col.name}</span>
                  </h2>
                  <span className="applied-skills__poster-column-count">
                    {col.skills.length}
                  </span>
                </div>

                {/* Beginner Swimlane */}
                {beginnerSkills.length > 0 && (
                  <div className="applied-skills__swimlane">
                    <div className="applied-skills__swimlane-header">
                      <span>Beginner ({beginnerSkills.length})</span>
                    </div>
                    <div className="applied-skills__swimlane-cards">
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
                  <div className="applied-skills__swimlane">
                    <div className="applied-skills__swimlane-header">
                      <span>Intermediate ({intermediateSkills.length})</span>
                    </div>
                    <div className="applied-skills__swimlane-cards">
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
        <div className="applied-skills__grid">
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
};

export default AppliedSkills;
