import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getPathById, CERT_LEVELS, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import CertNode from './CertNode';
import PathMapListView from './PathMapListView';
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

const PathMapFlow = ({ path, setSelectedCert, selectedBranch = 'all', statusFilter = 'all' }) => {
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
      const hasPrereqs = cert.prerequisites && cert.prerequisites.length > 0;
      const isPrereqCompleted = hasPrereqs && cert.prerequisites.every(p => {
        if (Array.isArray(p)) {
          return p.some(id => {
            const s = getStatus(id);
            return s === CERT_STATUS.COMPLETED || s === CERT_STATUS.NEEDS_RENEWAL;
          });
        }
        const s = getStatus(p);
        return s === CERT_STATUS.COMPLETED || s === CERT_STATUS.NEEDS_RENEWAL;
      });
      const isUnlocked = (!hasPrereqs || isPrereqCompleted) && certStatus === CERT_STATUS.NOT_STARTED;
      const pos = positions.get(cert.id);

      const isFilteredOut = (statusFilter !== 'all' && (
        (statusFilter === 'completed' && certStatus !== CERT_STATUS.COMPLETED) ||
        (statusFilter === 'in_progress' && certStatus !== CERT_STATUS.IN_PROGRESS) ||
        (statusFilter === 'not_started' && certStatus !== CERT_STATUS.NOT_STARTED)
      )) || (selectedBranch !== 'all' && cert.branch !== selectedBranch);

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
        style: {
          opacity: isFilteredOut ? 0.22 : 1,
          filter: isFilteredOut ? 'grayscale(0.6)' : 'none',
          transition: 'opacity 0.25s ease, filter 0.25s ease',
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
  }, [path, hasBranches, trunkFundamentals, trunkBottom, branchColumns, linearGroups, getStatus, isPathIgnored, path?.color, setSelectedCert, setNodes, setEdges, fitView, selectedBranch, statusFilter]);

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
  const [prevPathId, setPrevPathId] = useState(pathId);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  if (prevPathId !== pathId) {
    setPrevPathId(pathId);
    setSelectedBranch('all');
    setStatusFilter('all');
  }

  const handleClearFilters = useCallback(() => {
    setSelectedBranch('all');
    setStatusFilter('all');
  }, []);

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
      
      {/* ─── Redesigned Header: Concept 3 Hybrid ─── */}
      <div className="path-map__header">
        <div className="path-map__header-glow" aria-hidden="true" />
        
        {/* Upper Tier: Brand and Actions */}
        <div className="path-map__header-top">
          <div className="path-map__header-brand">
            <div className="path-map__header-emblem-wrap">
              <div className="path-map__header-icon">
                <PathIcon size={26} />
              </div>
              <span className="path-map__header-code-badge">{path.code}</span>
            </div>

            <div className="path-map__header-info">
              <div className="path-map__header-meta-row">
                <span className="path-map__header-pillar-chip">{path.pillar}</span>
                <span className="path-map__header-cert-count">{path.certifications.length} Credentials</span>
              </div>

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
        </div>

        {/* Lower Tier: Branch Wayfinding & Interactive Mastery Metrics */}
        <div className="path-map__header-bottom">
          {path.branches && path.branches.length > 0 ? (
            <div className="path-map__branches-bar">
              <span className="path-map__branches-label">
                <Icons.GitBranch size={13} />
                Branches:
              </span>
              <div className="path-map__branches-chips">
                <button
                  type="button"
                  className={`path-map__branch-chip ${selectedBranch === 'all' ? 'path-map__branch-chip--active' : ''}`}
                  onClick={() => setSelectedBranch('all')}
                >
                  All Stations
                </button>
                {path.branches.map(branch => (
                  <button
                    key={branch.id}
                    type="button"
                    className={`path-map__branch-chip ${selectedBranch === branch.id ? 'path-map__branch-chip--active' : ''}`}
                    onClick={() => setSelectedBranch(branch.id === selectedBranch ? 'all' : branch.id)}
                    title={branch.description}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="path-map__branches-placeholder" />
          )}

          <div className="path-map__header-stats">
            <div className="path-map__header-progress">
              <ProgressRing percent={pathProgress.percent} size={42} strokeWidth={4} color={path.color} />
            </div>
            <div className="path-map__header-counts">
              <button
                type="button"
                className={`path-map__stat-pill path-map__stat-pill--completed ${statusFilter === 'completed' ? 'path-map__stat-pill--active' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
                title="Filter completed certifications"
              >
                <Icons.CheckCircle2 size={13} />
                <span><strong>{pathProgress.completed}</strong> Completed</span>
              </button>
              <button
                type="button"
                className={`path-map__stat-pill path-map__stat-pill--in-progress ${statusFilter === 'in_progress' ? 'path-map__stat-pill--active' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
                title="Filter active in-progress certifications"
              >
                <Icons.Clock size={13} />
                <span><strong>{pathProgress.inProgress}</strong> Active</span>
              </button>
              <button
                type="button"
                className={`path-map__stat-pill path-map__stat-pill--remaining ${statusFilter === 'not_started' ? 'path-map__stat-pill--active' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'not_started' ? 'all' : 'not_started')}
                title="Filter remaining certifications"
              >
                <Icons.Circle size={13} />
                <span><strong>{Math.max(0, pathProgress.total - pathProgress.completed - pathProgress.inProgress)}</strong> Remaining</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <PathMapListView 
          path={path} 
          onSelectCert={handleSelectCert} 
          selectedBranch={selectedBranch}
          statusFilter={statusFilter}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="path-map__viewport" style={{ flex: 1, minHeight: 0 }}>
          <ReactFlowProvider>
            <PathMapFlow 
              path={path} 
              setSelectedCert={handleSelectCert}
              selectedBranch={selectedBranch}
              statusFilter={statusFilter}
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
