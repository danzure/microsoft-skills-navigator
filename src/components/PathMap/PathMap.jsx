import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getPathById, CERT_LEVELS, CERT_STATUS } from '../../data/certificationPaths';
import { useProgressContext } from '../../context/ProgressContext';
import { useToast } from '../../context/ToastContext';
import CertNode from './CertNode';
import CertDetail from '../CertDetail/CertDetail';
import ProgressRing from '../common/ProgressRing';
import { IconMap as Icons } from '../common/IconMap';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, useNodesState, useEdgesState, Background, Controls, ControlButton, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import './PathMap.css';

const LEVELS = [CERT_LEVELS.FUNDAMENTALS, CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY];
const nodeTypes = { certNode: CertNode };

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep: 40, ranksep: 80 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 400, height: 230 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - 400 / 2,
        y: nodeWithPosition.y - 230 / 2,
      },
    };
    return newNode;
  });

  return { nodes: layoutedNodes, edges };
};

const CustomControls = () => {
  const { setViewport, getViewport } = useReactFlow();

  const handlePan = (dx, dy) => {
    const { x, y, zoom } = getViewport();
    setViewport({ x: x + dx, y: y + dy, zoom }, { duration: 300 });
  };

  return (
    <Controls showInteractive={false}>
      <ControlButton onClick={() => handlePan(0, 100)} title="Pan Up" aria-label="Pan Up">
        <Icons.ArrowUp size={16} />
      </ControlButton>
      <ControlButton onClick={() => handlePan(0, -100)} title="Pan Down" aria-label="Pan Down">
        <Icons.ArrowDown size={16} />
      </ControlButton>
      <ControlButton onClick={() => handlePan(100, 0)} title="Pan Left" aria-label="Pan Left">
        <Icons.ArrowLeft size={16} />
      </ControlButton>
      <ControlButton onClick={() => handlePan(-100, 0)} title="Pan Right" aria-label="Pan Right">
        <Icons.ArrowRight size={16} />
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

    // Build initial nodes
    const initialNodes = path.certifications.map((cert, idx) => {
      const certStatus = getStatus(cert.id);
      const flatPrereqs = cert.prerequisites ? cert.prerequisites.flat() : [];
      const isPrereqCompleted = flatPrereqs.some(id => getStatus(id) === CERT_STATUS.COMPLETED);
      const isUnlocked = (flatPrereqs.length === 0 || isPrereqCompleted) && certStatus === CERT_STATUS.NOT_STARTED;

      return {
        id: cert.id,
        type: 'certNode',
        data: {
          cert,
          pathColor: path.color,
          onSelect: setSelectedCert,
          index: idx,
          isUnlocked,
          isPathIgnored: isPathIgnored(path.id),
        },
        position: { x: 0, y: 0 },
      };
    });

    // Build initial edges based on the legacy connection logic
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

    // Apply color and state to edges
    const styledEdges = initialEdges.map(edge => {
      const fromStatus = getStatus(edge.source);
      const toStatus = getStatus(edge.target);
      const fromCompleted = fromStatus === CERT_STATUS.COMPLETED;
      const toActive = toStatus === CERT_STATUS.COMPLETED || toStatus === CERT_STATUS.IN_PROGRESS;
      
      const targetNode = initialNodes.find(n => n.id === edge.target);
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

    let layoutedNodes;
    let layoutedEdges;

    if (path.id === 'retired-exams') {
      const colWidth = 440; // 400 node width + 40 gap
      const rowHeight = 270; // 230 node height + 40 gap
      const cols = 3;
      const placedNodes = [];
      
      const allCerts = branchColumns.flatMap(branch => branch.allCerts);
      
      allCerts.forEach((cert, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const node = initialNodes.find(n => n.id === cert.id);
        if (node) {
          placedNodes.push({
            ...node,
            position: { x: col * colWidth, y: row * rowHeight },
            sourcePosition: 'bottom',
            targetPosition: 'top'
          });
        }
      });
      
      layoutedNodes = placedNodes;
    } else {
      const res = getLayoutedElements(initialNodes, styledEdges);
      layoutedNodes = res.nodes;
      layoutedEdges = res.edges;
    }

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    if (lastFittedPath !== path.id) {
      lastFittedPath = path.id;
      setTimeout(() => {
        fitView({ duration: 600, padding: 0.1 });
      }, 50);
    }
  }, [path, hasBranches, trunkFundamentals, trunkBottom, branchColumns, linearGroups, getStatus, isPathIgnored, path?.color, setSelectedCert, setNodes, setEdges, fitView]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: '800px', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView={false}
          zoomOnDoubleClick={false}
          minZoom={0.1}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
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

  const PathIcon = Icons[path.icon] || Icons.Circle;

  return (
    <div className="path-map" style={{ '--path-color': path.color, '--path-glow': path.glowColor }}>
      <div className="path-map__header">
        <div className="path-map__header-icon">
          <PathIcon size={28} />
        </div>
        <div className="path-map__header-info">
          <h1 className="path-map__header-title">{path.name}</h1>
          <p className="path-map__header-desc">{path.description}</p>
        </div>
        <div className="path-map__header-actions">
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

      <div className="path-map__viewport" style={{ flex: 1, minHeight: 0 }}>
        <ReactFlowProvider>
          <PathMapFlow 
            path={path} 
            setSelectedCert={handleSelectCert}
          />
        </ReactFlowProvider>
      </div>

      {selectedCert && (
        <CertDetail cert={selectedCert} path={path} onClose={() => handleSelectCert(null)} />
      )}
    </div>
  );
};

export default PathMap;
