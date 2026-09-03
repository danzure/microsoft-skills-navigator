import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getPathById, getCertById, getCertificationsRequiring, CERT_LEVELS, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import { isRetiring, isRetired, getBadgeUrl } from '../../utils/helpers';
import Badge from '../common/Badge';
import CertNode from './CertNode';
import CertDetail from '../CertDetail/CertDetail';
import ProgressRing from '../common/ProgressRing';
import SEO from '../common/SEO';
import { IconMap as Icons } from '../common/IconMap';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, useNodesState, useEdgesState, Background, Controls, ControlButton, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import './PathMap.css';

const LEVELS = [CERT_LEVELS.FUNDAMENTALS, CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY];
const nodeTypes = { certNode: CertNode };

const layoutPositionsCache = new Map();

const computePathLayout = (path, branchColumns, trunkFundamentals, trunkBottom, linearGroups, hasBranches) => {
  if (layoutPositionsCache.has(path.id)) {
    return layoutPositionsCache.get(path.id);
  }

  const positions = new Map();
  const initialEdges = [];

  if (hasBranches) {
    const chainedFundamentals = trunkFundamentals.filter(c => !c.isIndependent);
    for (let i = 1; i < chainedFundamentals.length; i++) {
      initialEdges.push({
        id: `e-${chainedFundamentals[i - 1].id}-${chainedFundamentals[i].id}`,
        source: chainedFundamentals[i - 1].id,
        target: chainedFundamentals[i].id,
        type: 'smoothstep',
      });
    }

    const lastTrunkFund = chainedFundamentals[chainedFundamentals.length - 1];
    if (lastTrunkFund) {
      branchColumns.forEach(branch => {
        const firstBranchCert = branch.allCerts[0];
        if (firstBranchCert && !firstBranchCert.isIndependent) {
          initialEdges.push({
            id: `e-${lastTrunkFund.id}-${firstBranchCert.id}`,
            source: lastTrunkFund.id,
            target: firstBranchCert.id,
            type: 'smoothstep',
          });
        }
      });
    }

    branchColumns.forEach(branch => {
      const chainedBranchCerts = branch.allCerts.filter(c => !c.isIndependent);
      for (let i = 1; i < chainedBranchCerts.length; i++) {
        initialEdges.push({
          id: `e-${chainedBranchCerts[i - 1].id}-${chainedBranchCerts[i].id}`,
          source: chainedBranchCerts[i - 1].id,
          target: chainedBranchCerts[i].id,
          type: 'smoothstep',
        });
      }
    });

    const chainedBottom = trunkBottom.filter(c => !c.isIndependent);
    if (chainedBottom.length > 0) {
      const firstBottom = chainedBottom[0];
      const prereqs = firstBottom.prerequisites ? firstBottom.prerequisites.flat() : [];

      branchColumns.forEach(branch => {
        const chainedBranchCerts = branch.allCerts.filter(c => !c.isIndependent);
        const lastBranchCert = chainedBranchCerts[chainedBranchCerts.length - 1];
        if (lastBranchCert) {
          let shouldConnect = true;
          if (prereqs.length > 0) {
            shouldConnect = chainedBranchCerts.some(c => prereqs.includes(c.id));
          }
          if (shouldConnect) {
            initialEdges.push({
              id: `e-${lastBranchCert.id}-${firstBottom.id}`,
              source: lastBranchCert.id,
              target: firstBottom.id,
              type: 'smoothstep',
            });
          }
        }
      });
    }

    for (let i = 1; i < chainedBottom.length; i++) {
      initialEdges.push({
        id: `e-${chainedBottom[i - 1].id}-${chainedBottom[i].id}`,
        source: chainedBottom[i - 1].id,
        target: chainedBottom[i].id,
        type: 'smoothstep',
      });
    }
  } else {
    const orderedCerts = linearGroups.flatMap(g => g.certs).filter(c => !c.isIndependent);
    for (let i = 1; i < orderedCerts.length; i++) {
      initialEdges.push({
        id: `e-${orderedCerts[i - 1].id}-${orderedCerts[i].id}`,
        source: orderedCerts[i - 1].id,
        target: orderedCerts[i].id,
        type: 'smoothstep',
      });
    }
  }

  if (path.id === 'retired-exams') {
    const colWidth = 440; // 400 node width + 40 gap
    const rowHeight = 270; // 230 node height + 40 gap
    const cols = 3;
    const allCerts = branchColumns.flatMap(branch => branch.allCerts);

    allCerts.forEach((cert, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      positions.set(cert.id, {
        position: { x: col * colWidth, y: row * rowHeight },
        sourcePosition: 'bottom',
        targetPosition: 'top',
      });
    });
  } else {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 80 });

    path.certifications.forEach((cert) => {
      dagreGraph.setNode(cert.id, { width: 400, height: 230 });
    });

    initialEdges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    path.certifications.forEach((cert) => {
      const nodeWithPosition = dagreGraph.node(cert.id);
      positions.set(cert.id, {
        position: {
          x: nodeWithPosition.x - 400 / 2,
          y: nodeWithPosition.y - 230 / 2,
        },
        targetPosition: 'top',
        sourcePosition: 'bottom',
      });
    });
  }

  const result = { positions, edges: initialEdges };
  layoutPositionsCache.set(path.id, result);
  return result;
};

const CustomControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Controls showZoom={false} showFitView={false} showInteractive={false} className="path-map__flow-controls">
      <ControlButton onClick={() => zoomIn({ duration: 300 })} title="Zoom In" aria-label="Zoom In">
        <Icons.Plus size={16} />
      </ControlButton>
      <ControlButton onClick={() => zoomOut({ duration: 300 })} title="Zoom Out" aria-label="Zoom Out">
        <Icons.Minus size={16} />
      </ControlButton>
      <ControlButton onClick={() => fitView({ duration: 500, padding: 0.15 })} title="Fit View" aria-label="Fit View">
        <Icons.Compass size={16} />
      </ControlButton>
    </Controls>
  );
};

let lastFittedPath = null;

const PathMapFlow = ({ path, setSelectedCert }) => {
  const { getStatus, isPathIgnored } = useProgressContext();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const branches = useMemo(() => path?.branches || [], [path?.branches]);
  const hasBranches = branches.length > 0 && path?.certifications.some(c => c.branch);

  const { trunkFundamentals, trunkBottom, branchColumns } = useMemo(() => {
    if (!path || !hasBranches) return { trunkFundamentals: [], trunkBottom: [], branchColumns: [] };

    const trunkCerts = path.certifications.filter(c => !c.branch);
    const trunkFundamentals = trunkCerts.filter(c => c.level === CERT_LEVELS.FUNDAMENTALS);
    const trunkBottom = trunkCerts.filter(c => c.level !== CERT_LEVELS.FUNDAMENTALS);

    const branchColumns = branches.map(branchDef => {
      const certs = path.certifications.filter(c => c.branch === branchDef.id);
      return { ...branchDef, allCerts: certs };
    }).filter(b => b.allCerts.length > 0);

    return { trunkFundamentals, trunkBottom, branchColumns };
  }, [path, hasBranches, branches]);

  const linearGroups = useMemo(() => {
    if (!path || hasBranches) return [];
    return LEVELS
      .map(level => ({ level, certs: path.certifications.filter(c => c.level === level) }))
      .filter(g => g.certs.length > 0);
  }, [path, hasBranches]);

  useEffect(() => {
    if (!path) return;

    const { positions, edges: initialEdges } = computePathLayout(
      path,
      branchColumns,
      trunkFundamentals,
      trunkBottom,
      linearGroups,
      hasBranches
    );

    const isPathIgnoredVal = isPathIgnored(path.id);

    // Build nodes with cached layout coordinates
    const layoutedNodes = path.certifications.map((cert, idx) => {
      const certStatus = getStatus(cert.id);
      const flatPrereqs = cert.prerequisites ? cert.prerequisites.flat() : [];
      const isPrereqCompleted = flatPrereqs.some(id => getStatus(id) === CERT_STATUS.COMPLETED);
      const isUnlocked = (flatPrereqs.length === 0 || isPrereqCompleted) && certStatus === CERT_STATUS.NOT_STARTED;
      const pos = positions.get(cert.id);

      return {
        id: cert.id,
        type: 'certNode',
        data: {
          cert,
          pathColor: path.color,
          onSelect: setSelectedCert,
          index: idx,
          isUnlocked,
          isPathIgnored: isPathIgnoredVal,
        },
        position: pos?.position || { x: 0, y: 0 },
        targetPosition: pos?.targetPosition || 'top',
        sourcePosition: pos?.sourcePosition || 'bottom',
      };
    });

    // Apply color and state to edges
    const layoutedEdges = initialEdges.map(edge => {
      const fromStatus = getStatus(edge.source);
      const toStatus = getStatus(edge.target);
      const fromCompleted = fromStatus === CERT_STATUS.COMPLETED;
      const toActive = toStatus === CERT_STATUS.COMPLETED || toStatus === CERT_STATUS.IN_PROGRESS;
      
      const targetNode = layoutedNodes.find(n => n.id === edge.target);
      const toUnlocked = targetNode?.data?.isUnlocked;

      let strokeColor;
      let zIndex;
      let isAnimated = false;

      if (fromCompleted && toActive) {
        strokeColor = path.color;
        zIndex = 2;
      } else if (fromCompleted && toUnlocked) {
        strokeColor = `color-mix(in srgb, ${path.color} 70%, var(--bg-app))`;
        zIndex = 1;
        isAnimated = true;
      } else if (fromCompleted) {
        strokeColor = `color-mix(in srgb, ${path.color} 40%, var(--bg-app))`;
        zIndex = 1;
      } else {
        strokeColor = `color-mix(in srgb, ${path.color} 12%, var(--bg-app))`;
        zIndex = 0;
      }

      return {
        ...edge,
        zIndex,
        style: {
          stroke: strokeColor,
          strokeWidth: 6,
        },
        animated: isAnimated,
      };
    });

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    if (lastFittedPath !== path.id) {
      lastFittedPath = path.id;
      setTimeout(() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        if (isMobile) {
          fitView({ duration: 600, padding: 0.15, minZoom: 0.45, maxZoom: 0.85 });
        } else {
          fitView({ duration: 600, padding: 0.1 });
        }
      }, 50);
    }
  }, [path, hasBranches, trunkFundamentals, trunkBottom, branchColumns, linearGroups, getStatus, isPathIgnored, path?.color, setSelectedCert, setNodes, setEdges, fitView]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: '600px', width: '100%', position: 'relative' }}>
        <div className="path-map__touch-hint">
          <Icons.Info size={14} />
          <span>Pinch to zoom • Drag to explore</span>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView={false}
          zoomOnDoubleClick={false}
          minZoom={0.15}
          maxZoom={1.75}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnPinch={true}
        >
          <Background color="var(--border-subtle)" gap={16} />
          <CustomControls />
        </ReactFlow>
      </div>
    </div>
  );
};

const PathMapListView = ({ path, onSelectCert }) => {
  const { getStatus, setStatus, isCertIgnored, toggleCertIgnored } = useProgressContext();
  const { addToast } = useToast();

  const handleSetStatus = (certId, newStatus, e) => {
    e.stopPropagation();
    setStatus(certId, newStatus);
    const cert = path.certifications.find(c => c.id === certId);
    if (!cert) return;

    if (newStatus === CERT_STATUS.COMPLETED) {
      const prerequisiteFor = getCertificationsRequiring(certId);
      if (prerequisiteFor?.length > 0) {
        const nextCert = prerequisiteFor.find(c => getStatus(c.id) === CERT_STATUS.NOT_STARTED);
        if (nextCert) {
          addToast(`🎉 You've unlocked ${nextCert.examCode}!`, 'success', {
            action: {
              label: 'Start it',
              onClick: () => {
                setStatus(nextCert.id, CERT_STATUS.IN_PROGRESS);
                addToast(`${nextCert.examCode} marked as In Progress`, 'info');
              }
            }
          });
          return;
        }
      }
      addToast(`${cert.examCode} marked as Passed`, 'success');
    } else if (newStatus === CERT_STATUS.IN_PROGRESS) {
      addToast(`${cert.examCode} marked as In Progress`, 'info');
    } else if (newStatus === CERT_STATUS.NOT_STARTED) {
      addToast(`${cert.examCode} marked as Not Started`, 'info');
    }
  };

  const sections = useMemo(() => {
    if (!path?.certifications) return [];
    const list = [];
    const trunkFundamentals = path.certifications.filter(c => !c.branch && c.level === CERT_LEVELS.FUNDAMENTALS);
    if (trunkFundamentals.length > 0) {
      list.push({
        id: 'fundamentals',
        title: 'Foundational Credentials',
        description: 'Recommended entry points providing fundamental architectural and platform knowledge.',
        certs: trunkFundamentals,
      });
    }

    if (path.branches?.length > 0) {
      path.branches.forEach(branch => {
        const branchCerts = path.certifications.filter(c => c.branch === branch.id);
        if (branchCerts.length > 0) {
          list.push({
            id: `branch-${branch.id}`,
            title: `${branch.name} Pathway`,
            description: branch.description,
            certs: branchCerts,
          });
        }
      });
    }

    const trunkBottom = path.certifications.filter(c => !c.branch && c.level !== CERT_LEVELS.FUNDAMENTALS);
    if (trunkBottom.length > 0) {
      list.push({
        id: 'advanced',
        title: 'Specialty & Expert Level',
        description: 'Advanced role-based credentials for architects and domain specialists.',
        certs: trunkBottom,
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'all',
        title: 'All Certifications',
        description: '',
        certs: path.certifications,
      });
    }

    return list;
  }, [path]);

  return (
    <div className="path-map__list-view" id="path-list-view">
      {sections.map(section => (
        <div key={section.id} className="path-map__list-section">
          <div className="path-map__list-section-header">
            <h2 className="path-map__list-section-title">{section.title}</h2>
            {section.description && (
              <p className="path-map__list-section-desc">{section.description}</p>
            )}
          </div>
          <div className="path-map__list-cards">
            {section.certs.map(cert => {
              const status = getStatus(cert.id);
              const retiring = isRetiring(cert);
              const retired = isRetired(cert);
              const isRetiredExam = retiring || retired;
              const isTracked = !isCertIgnored(cert.id);
              const badgeUrl = getBadgeUrl(cert.level, cert.id);

              return (
                <div
                  key={cert.id}
                  className={`path-map__list-card ${status === CERT_STATUS.COMPLETED ? 'path-map__list-card--completed' : ''} ${status === CERT_STATUS.IN_PROGRESS ? 'path-map__list-card--in-progress' : ''}`}
                  onClick={() => onSelectCert(cert)}
                  style={{ '--card-color': path.color }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectCert(cert)}
                >
                  <div className="path-map__list-card-header">
                    <div className="path-map__list-card-badge">
                      {badgeUrl ? (
                        <img src={badgeUrl} alt={`${cert.examCode} badge`} loading="lazy" />
                      ) : (
                        <Icons.Award size={24} />
                      )}
                    </div>
                    <div className="path-map__list-card-title-group">
                      <div className="path-map__list-card-code-row">
                        <span className="path-map__list-card-code">{cert.examCode}</span>
                        <Badge variant={cert.level.toLowerCase()} small>{cert.level}</Badge>
                        {retiring && <Badge variant="retiring" small><Icons.AlertTriangle size={9} />Retiring</Badge>}
                        {retired && <Badge variant="retiring" small><Icons.ArchiveX size={9} />Retired</Badge>}
                        {cert.isNew && <Badge variant="new" small>New</Badge>}
                        {cert.isUpdated && <Badge variant="updated" small>Updated</Badge>}
                        {cert.isBeta && <Badge variant="beta" small>Beta</Badge>}
                      </div>
                      <h3 className="path-map__list-card-name">{cert.name}</h3>
                    </div>
                    {!isRetiredExam && (
                      <button
                        className={`path-map__list-track-btn ${isTracked ? 'path-map__list-track-btn--tracked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCertIgnored(cert.id);
                          if (!isTracked) {
                            addToast(`${cert.examCode} added to tracked learning`, 'success');
                          } else {
                            addToast(`${cert.examCode} removed from tracked learning`, 'info');
                          }
                        }}
                        aria-label={isTracked ? "Untrack exam" : "Track exam"}
                        title={isTracked ? "Tracked in learning" : "Untracked"}
                      >
                        {isTracked ? <Icons.Eye size={18} /> : <Icons.EyeOff size={18} />}
                      </button>
                    )}
                  </div>
                  <p className="path-map__list-card-desc">{cert.description}</p>
                  
                  <div className="path-map__list-card-footer">
                    <div className="path-map__list-card-prereqs">
                      {cert.prerequisites?.length > 0 && cert.prerequisites.map((prereq, pIdx) => {
                        if (Array.isArray(prereq)) {
                          return (
                            <Badge key={`prereq-${pIdx}`} variant="default" small>
                              <Icons.Link size={9} /> 1 of {prereq.length}
                            </Badge>
                          );
                        }
                        const prereqCert = getCertById(prereq)?.cert;
                        return (
                          <Badge key={`prereq-${prereq}`} variant={prereqCert ? prereqCert.level.toLowerCase() : 'default'} small>
                            <Icons.Link size={9} /> Prereq: {prereqCert ? prereqCert.examCode : prereq.toUpperCase()}
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="path-map__list-status-toggle" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={`path-map__list-status-btn ${status === CERT_STATUS.NOT_STARTED ? 'path-map__list-status-btn--active' : ''}`}
                        onClick={(e) => handleSetStatus(cert.id, CERT_STATUS.NOT_STARTED, e)}
                        aria-label="Set status: Not Started"
                      >
                        <Icons.Circle size={14} />
                        <span>Not Started</span>
                      </button>
                      <button
                        type="button"
                        className={`path-map__list-status-btn ${status === CERT_STATUS.IN_PROGRESS ? 'path-map__list-status-btn--active path-map__list-status-btn--in-progress' : ''}`}
                        onClick={(e) => handleSetStatus(cert.id, CERT_STATUS.IN_PROGRESS, e)}
                        aria-label="Set status: In Progress"
                      >
                        <Icons.Clock size={14} />
                        <span>In Progress</span>
                      </button>
                      <button
                        type="button"
                        className={`path-map__list-status-btn ${(status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) ? 'path-map__list-status-btn--active path-map__list-status-btn--completed' : ''}`}
                        onClick={(e) => handleSetStatus(cert.id, CERT_STATUS.COMPLETED, e)}
                        aria-label="Set status: Passed"
                      >
                        {status === CERT_STATUS.NEEDS_RENEWAL ? <Icons.RefreshCw size={14} /> : <Icons.CheckCircle2 size={14} />}
                        <span>{status === CERT_STATUS.NEEDS_RENEWAL ? 'Renew' : 'Passed'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const PathMap = () => {
  const { pathId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const path = getPathById(pathId);
  const { getPathProgress, togglePathIgnored, isPathIgnored } = useProgressContext();
  const { addToast } = useToast();
  
  const [selectedCertId, setSelectedCertId] = useState(() => searchParams.get('cert') || null);
  const [viewMode, setViewMode] = useState(() => {
    return (typeof window !== 'undefined' && window.innerWidth <= 768) ? 'list' : 'map';
  });

  const selectedCert = useMemo(() => {
    if (!path || !selectedCertId) return null;
    return path.certifications.find((c) => c.id === selectedCertId) || null;
  }, [path, selectedCertId]);

  const handleSelectCert = useCallback((cert) => {
    setSelectedCertId(cert ? cert.id : null);
  }, []);

  const pathProgress = useMemo(() => {
    if (!path) return { total: 0, completed: 0, inProgress: 0, percent: 0 };
    return getPathProgress(path.id);
  }, [path, getPathProgress]);

  const certCodes = useMemo(() => {
    if (!path?.certifications) return '';
    return path.certifications.map(c => c.examCode).filter(Boolean).slice(0, 10).join(', ');
  }, [path]);

  const breadcrumbSchema = useMemo(() => {
    if (!path) return null;
    return {
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
          "name": "Certification Paths",
          "item": "https://skills.atozazure.com/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": path.name,
          "item": `https://skills.atozazure.com/path/${path.id}`
        }
      ]
    };
  }, [path]);

  const isPathTracked = path ? !isPathIgnored(path.id) : false;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !selectedCert) {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert, navigate]);

  if (!path) {
    return (
      <div className="path-map__not-found">
        <Icons.MapPinOff size={48} />
        <h2>Path not found</h2>
        <p>The certification path you're looking for doesn't exist.</p>
      </div>
    );
  }

  const seoTitle = selectedCert
    ? `${selectedCert.examCode}: ${selectedCert.name} Certification Guide | atozazure`
    : `${path?.name} Certification Roadmap (${path?.code}) | atozazure`;

  const seoDesc = selectedCert
    ? `Study guide and requirements for ${selectedCert.examCode} (${selectedCert.name}). ${selectedCert.description}`
    : `${path?.description} Visual metro roadmap and study tracking for Microsoft ${path?.name} exams including ${certCodes}.`;

  const PathIcon = Icons[path.icon] || Icons.Circle;

  return (
    <div className="path-map" style={{ '--path-color': path.color, '--path-glow': path.glowColor }}>
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${path.name}, ${path.shortName}, ${certCodes}, Microsoft certification roadmap, Azure certifications`}
        canonical={`https://skills.atozazure.com/path/${path.id}`}
        schema={breadcrumbSchema}
      />
      <div className="path-map__header">
        <div className="path-map__header-main">
          <div className="path-map__header-icon">
            <PathIcon size={28} />
          </div>
          <div className="path-map__header-info">
            <h1 className="path-map__header-title">{path.name}</h1>
            <p className="path-map__header-desc">{path.description}</p>
          </div>
        </div>
        <div className="path-map__header-actions">
          <div className="path-map__view-toggle" role="tablist" aria-label="View mode">
            <button
              type="button"
              className={`path-map__view-btn ${viewMode === 'map' ? 'path-map__view-btn--active' : ''}`}
              onClick={() => setViewMode('map')}
              role="tab"
              aria-selected={viewMode === 'map'}
              title="Interactive Map View"
            >
              <Icons.Map size={15} />
              <span>Map</span>
            </button>
            <button
              type="button"
              className={`path-map__view-btn ${viewMode === 'list' ? 'path-map__view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              role="tab"
              aria-selected={viewMode === 'list'}
              title="Roadmap List View"
            >
              <Icons.List size={15} />
              <span>List</span>
            </button>
          </div>
          {path.id !== 'retired-exams' && (
            <button
              className={`path-map__track-btn ${isPathTracked ? 'path-map__track-btn--tracked' : 'path-map__track-btn--untracked'}`}
              onClick={() => {
                togglePathIgnored(path.id);
                if (isPathTracked) {
                  addToast(`Removed ${path.shortName} from tracked learning`, 'info');
                } else {
                  addToast(`Added ${path.shortName} to tracked learning`, 'success');
                }
              }}
              title={isPathTracked ? "Remove from My Tracked Learning" : "Track this entire path in My Learning"}
            >
              {isPathTracked ? <Icons.CheckCircle2 size={16} /> : <Icons.Plus size={16} />}
              <span>{isPathTracked ? 'Tracked in Learning' : 'Track This Path'}</span>
            </button>
          )}
        </div>
        <div className="path-map__header-stats">
          <div className="path-map__header-progress">
            <ProgressRing percent={pathProgress.percent} size={48} strokeWidth={4} color={path.color} />
          </div>
          <div className="path-map__header-counts">
            <span className="path-map__header-stat">
              <Icons.CheckCircle2 size={14} />
              <strong>{pathProgress.completed}</strong> completed
            </span>
            <span className="path-map__header-stat">
              <Icons.Clock size={14} />
              <strong>{pathProgress.inProgress}</strong> active
            </span>
            <span className="path-map__header-stat">
              <Icons.Circle size={14} />
              <strong>{Math.max(0, pathProgress.total - pathProgress.completed - pathProgress.inProgress)}</strong> remaining
            </span>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <PathMapListView path={path} onSelectCert={handleSelectCert} />
      ) : (
        <div className="path-map__viewport" style={{ flex: 1, minHeight: 0 }}>
          <ReactFlowProvider>
            <PathMapFlow 
              path={path} 
              setSelectedCert={handleSelectCert}
            />
          </ReactFlowProvider>
        </div>
      )}

      {selectedCert && (
        <CertDetail cert={selectedCert} path={path} onClose={() => handleSelectCert(null)} />
      )}
    </div>
  );
};

export default PathMap;
