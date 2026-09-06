import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { careerRoles } from '../../data/careerRoles';
import { certificationPaths, CERT_STATUS } from '../../data/certificationPaths';
import { getAppliedSkillsForCert, APPLIED_SKILL_STATUS } from '../../data/appliedSkills';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { IconMap as Icons } from '../common/IconMap';
import SEO from '../common/SEO';
import { SortableCertItem } from './SortableCertItem';
import { CareerPathCertCard } from './CareerPathCertCard';
import AppliedSkillDetail from '../AppliedSkills/AppliedSkillDetail';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import './CareerPathBuilder.css';

/**
 * CareerPathBuilder Component
 * 
 * Allows users to explore specialized certification paths tailored to desired job roles.
 * Users can follow guided paths aligned with official career roles or build a custom 
 * career track by dragging and dropping certifications.
 * 
 * @component
 * @returns {JSX.Element} The CareerPathBuilder UI
 */
const CareerPathBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getStatus, customPlaylist, setCustomPlaylist, getAppliedSkillStatus, setAppliedSkillStatus } = useProgressContext();
  const { addToast } = useToast();
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('role') === 'custom' ? 'custom-playlist' : null;
  });

  const [selectedSkillForDetail, setSelectedSkillForDetail] = useState(null);
  const [certToAdd, setCertToAdd] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Flatten certifications for easy lookup
  const allCerts = useMemo(() => {
    const certsMap = new Map();
    certificationPaths.forEach(path => {
      path.certifications.forEach(cert => {
        certsMap.set(cert.id, {
          ...cert,
          pathId: path.id,
          pathColor: path.color
        });
      });
    });
    return certsMap;
  }, []);

  const sortedRoles = useMemo(() => {
    const customRole = {
      id: 'custom-playlist',
      title: 'Custom Career',
      description: 'Build your own custom certification track and drag to reorder.',
      icon: 'SettingsColor',
      color: 'var(--colorBrandForeground1)',
      certs: [],
    };
    return [customRole, ...[...careerRoles].sort((a, b) => a.title.localeCompare(b.title))];
  }, []);

  const selectedRole = useMemo(() => {
    return sortedRoles.find(r => r.id === selectedRoleId) || null;
  }, [sortedRoles, selectedRoleId]);

  const roleCerts = useMemo(() => {
    if (!selectedRole || selectedRole.id === 'custom-playlist') return [];
    return selectedRole.certs.map(id => allCerts.get(id)).filter(Boolean);
  }, [selectedRole, allCerts]);

  const { completedCertsCount, certPercent } = useMemo(() => {
    if (roleCerts.length === 0) return { completedCertsCount: 0, certPercent: 0 };
    const completed = roleCerts.filter(
      c => getStatus(c.id) === CERT_STATUS.COMPLETED || getStatus(c.id) === CERT_STATUS.NEEDS_RENEWAL
    ).length;
    return {
      completedCertsCount: completed,
      certPercent: Math.round((completed / roleCerts.length) * 100),
    };
  }, [roleCerts, getStatus]);

  const { roleSkills, completedSkillsCount, skillPercent } = useMemo(() => {
    if (!selectedRole || selectedRole.id === 'custom-playlist') {
      return { roleSkills: [], completedSkillsCount: 0, skillPercent: 0 };
    }
    const uniqueSkillsMap = new Map();
    selectedRole.certs.forEach(certId => {
      const skills = getAppliedSkillsForCert(certId);
      skills.forEach(s => uniqueSkillsMap.set(s.id, s));
    });
    const skillsList = Array.from(uniqueSkillsMap.values());
    const completed = skillsList.filter(
      s => getAppliedSkillStatus(s.id) === APPLIED_SKILL_STATUS.COMPLETED
    ).length;
    return {
      roleSkills: skillsList,
      completedSkillsCount: completed,
      skillPercent: skillsList.length > 0 ? Math.round((completed / skillsList.length) * 100) : 0,
    };
  }, [selectedRole, getAppliedSkillStatus]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCustomPlaylist((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddCert = () => {
    if (certToAdd && !customPlaylist.includes(certToAdd)) {
      setCustomPlaylist([...customPlaylist, certToAdd]);
      setCertToAdd('');
    }
  };

  const handleRemoveCert = (idToRemove) => {
    setCustomPlaylist(customPlaylist.filter(id => id !== idToRemove));
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      setCustomPlaylist((items) => arrayMove(items, index, index - 1));
    }
  };

  const handleMoveDown = (index) => {
    if (index < customPlaylist.length - 1) {
      setCustomPlaylist((items) => arrayMove(items, index, index + 1));
    }
  };

  const handleExportPlaylist = () => {
    if (customPlaylist.length === 0) return;
    
    let content = `# My Custom Career\n\n`;
    customPlaylist.forEach((certId, index) => {
      const certInfo = allCerts.get(certId);
      if (certInfo) {
        content += `${index + 1}. **${certInfo.examCode}**: ${certInfo.name}\n`;
      }
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-career.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const breadcrumbSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://skills.atozazure.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Career Paths",
        "item": "https://skills.atozazure.com/career-paths"
      }
    ]
  }), []);

  const seoTitle = selectedRole && selectedRole.id !== 'custom-playlist'
    ? `${selectedRole.title} Certification Roadmap | atozazure`
    : 'Microsoft Career Paths & Certification Builder | atozazure';

  const seoDescription = selectedRole && selectedRole.id !== 'custom-playlist'
    ? `Official Microsoft certification path and learning roadmap for ${selectedRole.title}. ${selectedRole.description}`
    : 'Build, customize, and navigate your Microsoft certification roadmap by career role. Explore curated certification journeys for Cloud Architects, AI Engineers, Security Administrators, Data Engineers, and DevOps Specialists.';

  return (
    <div className="career-path-builder">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="microsoft career paths, azure career roadmap, cloud architect certification path, devops engineer certifications, ai engineer certification roadmap, skills navigator"
        canonical="https://skills.atozazure.com/career-paths"
        schema={breadcrumbSchema}
      />
      <div className="cpb-header">
        <h1 className="cpb-title">
          Microsoft Career Paths & Certification Builder
        </h1>
        <p className="cpb-subtitle">
          Navigate specialized certification roadmaps aligned with official Microsoft job roles, or craft a personalized drag-and-drop learning playlist. Tailor your certification milestones to accelerate your career growth as an Architect, AI Engineer, Security Admin, or DevOps Specialist.
        </p>
      </div>

      <div className="cpb-roles-grid">
        {sortedRoles.map(role => {
          const isActive = selectedRole?.id === role.id;
          const RoleIcon = Icons[role.icon] || Icons.Briefcase;
          
          return (
            <div 
              key={role.id}
              className={`cpb-role-card ${isActive ? 'cpb-role-card--active' : ''}`}
              style={{ '--card-color': role.color }}
              onClick={() => setSelectedRoleId(isActive ? null : role.id)}
            >
              <div className="cpb-role-card-header">
                <div className="cpb-role-icon">
                  <RoleIcon size={18} />
                </div>
                <div className="cpb-role-title">{role.title}</div>
              </div>
              <div className="cpb-role-desc">{role.description}</div>
            </div>
          );
        })}
      </div>

      {selectedRole && (
        <div className="cpb-path-container">
          {selectedRole.id === 'custom-playlist' ? (
            <h2 className="cpb-path-title">Your Custom Career</h2>
          ) : (
            <div className="cpb-role-banner" style={{ '--role-color': selectedRole.color }}>
              <div className="cpb-role-banner__header">
                <div className="cpb-role-banner__title-group">
                  <h2 className="cpb-role-banner__title">
                    Roadmap for {selectedRole.title}
                  </h2>
                  <p className="cpb-role-banner__desc">
                    {selectedRole.description}
                  </p>
                </div>
              </div>

              <div className="cpb-role-banner__stats">
                <div className="cpb-role-banner__stat-card">
                  <div className="cpb-role-banner__stat-header">
                    <span className="cpb-role-banner__stat-label">Certifications</span>
                    <span className="cpb-role-banner__stat-count">
                      {completedCertsCount} of {roleCerts.length} Passed
                    </span>
                  </div>
                  <div className="cpb-role-banner__stat-track">
                    <div 
                      className="cpb-role-banner__stat-fill cpb-role-banner__stat-fill--cert" 
                      style={{ width: `${certPercent}%` }} 
                    />
                  </div>
                </div>

                {roleSkills.length > 0 && (
                  <div className="cpb-role-banner__stat-card">
                    <div className="cpb-role-banner__stat-header">
                      <div className="cpb-role-banner__stat-label-group">
                        <Icons.AppliedSkills size={14} className="cpb-role-banner__skill-icon" />
                        <span className="cpb-role-banner__stat-label">Aligned Applied Skills</span>
                      </div>
                      <span className="cpb-role-banner__stat-count">
                        {completedSkillsCount} of {roleSkills.length} Earned
                      </span>
                    </div>
                    <div className="cpb-role-banner__stat-track">
                      <div 
                        className="cpb-role-banner__stat-fill cpb-role-banner__stat-fill--skill" 
                        style={{ width: `${skillPercent}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {selectedRole.id === 'custom-playlist' && (
            <div className="cpb-custom-add-section">
              <select 
                className="cpb-custom-select"
                value={certToAdd}
                onChange={(e) => setCertToAdd(e.target.value)}
              >
                <option value="">-- Select a Certification to Add --</option>
                {Array.from(allCerts.values()).sort((a, b) => a.name.localeCompare(b.name)).map(cert => (
                  <option key={`add-${cert.id}`} value={cert.id} disabled={customPlaylist.includes(cert.id)}>
                    {cert.examCode} - {cert.name}
                  </option>
                ))}
              </select>
              <button 
                className="cpb-custom-add-btn" 
                onClick={handleAddCert}
                disabled={!certToAdd}
              >
                Add
              </button>
              <button
                className="cpb-custom-export-btn"
                onClick={handleExportPlaylist}
                disabled={customPlaylist.length === 0}
                title="Export Custom Career as Markdown"
              >
                <Icons.Download size={18} />
                Export
              </button>
            </div>
          )}

          <div className="cpb-timeline">
            {selectedRole.id === 'custom-playlist' ? (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={customPlaylist}
                  strategy={verticalListSortingStrategy}
                >
                  {customPlaylist.length === 0 && (
                    <div className="cpb-timeline-empty cpb-timeline-empty--enhanced">
                      <div className="cpb-timeline-empty-icon-wrapper">
                        <Icons.Compass size={48} />
                      </div>
                      <h3 className="cpb-timeline-empty-title">Your Path is Empty</h3>
                      <p className="cpb-timeline-empty-desc">
                        Use the dropdown above to select a certification and click <strong>Add</strong> to start building your custom career track. You can drag and drop items here to reorder them once added.
                      </p>
                    </div>
                  )}
                  {customPlaylist.map((certId, index) => {
                    const certInfo = allCerts.get(certId);
                    if (!certInfo) return null;
                    const status = getStatus(certId);
                    let nodeClass = '';
                    let badgeClass;
                    let StatusIcon = Icons.Circle;
                    let statusText;

                    if (status === CERT_STATUS.COMPLETED) {
                      nodeClass = 'cpb-timeline-node--completed';
                      badgeClass = 'cpb-timeline-badge--completed';
                      StatusIcon = Icons.CheckCircle2;
                      statusText = 'Completed';
                    } else if (status === CERT_STATUS.NEEDS_RENEWAL) {
                      nodeClass = 'cpb-timeline-node--needs-renewal';
                      badgeClass = 'cpb-timeline-badge--needs-renewal';
                      StatusIcon = Icons.AlertTriangle;
                      statusText = 'Needs Renewal';
                    } else if (status === CERT_STATUS.IN_PROGRESS) {
                      nodeClass = 'cpb-timeline-node--in-progress';
                      badgeClass = 'cpb-timeline-badge--in-progress';
                      StatusIcon = Icons.Clock;
                      statusText = 'In Progress';
                    } else {
                      badgeClass = 'cpb-timeline-badge--not-started';
                      statusText = 'Not Started';
                    }

                    return (
                      <SortableCertItem 
                        key={certId}
                        id={certId}
                        index={index}
                        isFirst={index === 0}
                        isLast={index === customPlaylist.length - 1}
                        certInfo={certInfo}
                        status={status}
                        statusText={statusText}
                        nodeClass={nodeClass}
                        badgeClass={badgeClass}
                        StatusIcon={StatusIcon}
                        onNavigate={navigate}
                        onRemove={handleRemoveCert}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onSelectSkill={setSelectedSkillForDetail}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="cpb-cert-list">
                {selectedRole.certs.map((certId) => {
                  const certInfo = allCerts.get(certId);
                  if (!certInfo) return null;
                  return (
                    <CareerPathCertCard 
                      key={certId} 
                      certInfo={certInfo} 
                      roleTitle={selectedRole.title}
                      customPlaylist={customPlaylist}
                      onAdd={(id) => setCustomPlaylist([...customPlaylist, id])}
                      onRemove={handleRemoveCert}
                      onSelectSkill={setSelectedSkillForDetail}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedSkillForDetail && (
        <AppliedSkillDetail
          skill={selectedSkillForDetail}
          status={getAppliedSkillStatus(selectedSkillForDetail.id)}
          onClose={() => setSelectedSkillForDetail(null)}
          onSetStatus={(skillId, newStatus) => {
            setAppliedSkillStatus(skillId, newStatus);
            const statusLabel = newStatus === APPLIED_SKILL_STATUS.COMPLETED ? 'Earned' : newStatus === APPLIED_SKILL_STATUS.IN_PROGRESS ? 'In Progress' : 'Not Started';
            addToast(`Marked '${selectedSkillForDetail.title}' as ${statusLabel}`, newStatus === APPLIED_SKILL_STATUS.COMPLETED ? 'success' : 'info');
          }}
        />
      )}
    </div>
  );
};

export default CareerPathBuilder;
