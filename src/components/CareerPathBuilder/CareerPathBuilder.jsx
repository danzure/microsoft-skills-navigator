import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { careerRoles } from '../../data/careerRoles';
import { certificationPaths, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { IconMap as Icons } from '../common/IconMap';
import SEO from '../common/SEO';
import { SortableCertItem } from './SortableCertItem';
import { CareerPathCertCard } from './CareerPathCertCard';
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
  const { getStatus, customPlaylist, setCustomPlaylist } = useProgressContext();
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('role') === 'custom' ? 'custom-playlist' : null;
  });

  const [certToAdd, setCertToAdd] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
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
          <h2 className="cpb-path-title">
            {selectedRole.id === 'custom-playlist' ? 'Your Custom Career' : `Roadmap for ${selectedRole.title}`}
          </h2>
          
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
                        certInfo={certInfo}
                        status={status}
                        statusText={statusText}
                        nodeClass={nodeClass}
                        badgeClass={badgeClass}
                        StatusIcon={StatusIcon}
                        onNavigate={navigate}
                        onRemove={handleRemoveCert}
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
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathBuilder;
