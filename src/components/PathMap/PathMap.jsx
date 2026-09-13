import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
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

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalXXXL,
    height: '100%',
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalL,
    padding: '64px',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
    '& h2': {
      fontSize: tokens.fontSizeBase600,
      fontWeight: tokens.fontWeightSemibold,
      color: tokens.colorNeutralForeground1,
      margin: 0,
    },
    '& p': {
      fontSize: tokens.fontSizeBase300,
      color: tokens.colorNeutralForeground2,
      margin: 0,
    },
  },
  header: {
    position: 'relative',
    overflow: 'visible',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXXL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    margin: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL} 0`,
    '@media (max-width: 768px)': {
      margin: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS} 0`,
      padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
      gap: tokens.spacingVerticalM,
    },
    '@media (min-width: 769px) and (max-width: 960px)': {
      gap: tokens.spacingVerticalM,
      padding: tokens.spacingVerticalL,
    },
  },
  headerGlow: {
    position: 'absolute',
    top: '-30px',
    left: '-30px',
    width: '260px',
    height: '180px',
    background: 'radial-gradient(circle, color-mix(in srgb, var(--path-color) 22%, transparent) 0%, transparent 70%)',
    pointerEvents: 'none',
    borderRadius: '50%',
    filter: 'blur(28px)',
    zIndex: 0,
    opacity: 0.75,
  },
  headerTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalXL,
    width: '100%',
    position: 'relative',
    zIndex: 2,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: tokens.spacingVerticalM,
    },
    '@media (min-width: 769px) and (max-width: 960px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: tokens.spacingVerticalM,
    },
  },
  headerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    flex: 1,
    minWidth: 0,
    '@media (max-width: 768px)': {
      width: '100%',
      minWidth: 0,
      gap: tokens.spacingHorizontalM,
    },
  },
  headerIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    color: 'var(--path-color)',
    filter: 'drop-shadow(0 3px 12px color-mix(in srgb, var(--path-color) 35%, transparent))',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: '42px',
      height: '42px',
      '& svg': {
        width: '22px',
        height: '22px',
      },
    },
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  headerMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  headerPillarChip: {
    fontSize: '11px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: '1px 7px',
    borderRadius: tokens.borderRadiusSmall,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  headerCertCount: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  headerTitle: {
    fontSize: 'var(--fs-title2)',
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
    lineHeight: 'var(--lh-tight)',
    overflowWrap: 'break-word',
    '@media (max-width: 768px)': {
      fontSize: 'var(--fs-subtitle1)',
    },
  },
  headerDesc: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: 'var(--lh-normal)',
    margin: `${tokens.spacingVerticalXS} 0 0`,
    maxWidth: '800px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: tokens.spacingHorizontalS,
      flexWrap: 'wrap',
    },
    '@media (min-width: 769px) and (max-width: 960px)': {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
  viewToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '2px',
    gap: '2px',
  },
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    height: '28px',
    padding: `0 ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusSmall,
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    fontSize: 'var(--fs-caption1)',
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer',
    touchAction: 'manipulation',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
  },
  viewBtnActive: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    boxShadow: tokens.shadow2,
    borderColor: tokens.colorNeutralStroke2,
  },
  trackBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    height: '32px',
    padding: `0 ${tokens.spacingHorizontalL}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    border: '1px solid transparent',
    ':active': {
      transform: 'scale(0.96)',
    },
  },
  trackBtnUntracked: {
    backgroundColor: 'color-mix(in srgb, var(--path-color) 12%, transparent)',
    borderColor: 'color-mix(in srgb, var(--path-color) 30%, transparent)',
    color: 'var(--path-color)',
    ':hover': {
      backgroundColor: 'color-mix(in srgb, var(--path-color) 20%, transparent)',
      borderColor: 'var(--path-color)',
      transform: 'translateY(-1px)',
    },
  },
  trackBtnTracked: {
    backgroundColor: 'var(--path-color)',
    borderColor: 'var(--path-color)',
    color: tokens.colorNeutralBackground1,
    ':hover': {
      filter: 'brightness(1.1)',
      transform: 'translateY(-1px)',
    },
  },
  headerBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingTop: tokens.spacingVerticalM,
    position: 'relative',
    zIndex: 1,
    width: '100%',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: tokens.spacingVerticalM,
      paddingTop: tokens.spacingVerticalS,
    },
    '@media (min-width: 769px) and (max-width: 960px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: tokens.spacingVerticalM,
    },
  },
  branchesBar: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flex: 1,
    minWidth: 0,
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    padding: '2px 0',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
  branchesPlaceholder: {
    flex: 1,
  },
  branchesLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    flexShrink: 0,
  },
  branchesChips: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'nowrap',
  },
  branchChip: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '28px',
    padding: `0 ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: 'var(--fs-caption1)',
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    touchAction: 'manipulation',
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
      borderColor: tokens.colorNeutralStroke1,
    },
    ':active': {
      transform: 'scale(0.96)',
    },
  },
  branchChipActive: {
    backgroundColor: 'color-mix(in srgb, var(--path-color) 16%, var(--colorNeutralBackground1))',
    borderColor: 'var(--path-color)',
    color: 'var(--path-color)',
    boxShadow: '0 0 8px color-mix(in srgb, var(--path-color) 25%, transparent)',
  },
  headerStats: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: tokens.spacingHorizontalS,
    },
    '@media (min-width: 769px) and (max-width: 960px)': {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
  headerProgress: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      transform: 'scale(0.85)',
      transformOrigin: 'left center',
      marginLeft: '-2px',
    },
  },
  headerCounts: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    '@media (max-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacingHorizontalS,
      flex: 1,
      justifyContent: 'flex-end',
    },
  },
  statPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '32px',
    padding: `0 ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: 'var(--fs-caption1)',
    fontWeight: tokens.fontWeightMedium,
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    touchAction: 'manipulation',
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'scale(0.96)',
    },
    '@media (max-width: 768px)': {
      padding: '0 8px',
      fontSize: 'var(--fs-caption2)',
      height: '30px',
      gap: '4px',
    },
  },
  statPillCompleted: {
    ':hover': {
      borderColor: 'var(--badge-completed-border)',
      color: 'var(--badge-completed-text)',
    },
  },
  statPillCompletedActive: {
    backgroundColor: 'color-mix(in srgb, var(--badge-completed-bg) 25%, var(--colorNeutralBackground1))',
    borderColor: 'var(--badge-completed-text)',
    color: 'var(--badge-completed-text)',
    fontWeight: tokens.fontWeightBold,
    boxShadow: '0 0 10px color-mix(in srgb, var(--badge-completed-text) 20%, transparent)',
  },
  statPillInProgress: {
    ':hover': {
      borderColor: 'var(--badge-inprogress-border)',
      color: 'var(--badge-inprogress-text)',
    },
  },
  statPillInProgressActive: {
    backgroundColor: 'color-mix(in srgb, var(--badge-inprogress-bg) 25%, var(--colorNeutralBackground1))',
    borderColor: 'var(--badge-inprogress-text)',
    color: 'var(--badge-inprogress-text)',
    fontWeight: tokens.fontWeightBold,
    boxShadow: '0 0 10px color-mix(in srgb, var(--badge-inprogress-text) 20%, transparent)',
  },
  statPillRemaining: {
    ':hover': {
      borderColor: tokens.colorNeutralStroke1,
      color: tokens.colorNeutralForeground1,
    },
  },
  statPillRemainingActive: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderColor: tokens.colorNeutralStroke1,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightBold,
  },
  viewport: {
    width: '100%',
    height: '100%',
    paddingBottom: tokens.spacingVerticalL,
    flex: 1,
    minHeight: 0,
  },
  touchHint: {
    position: 'absolute',
    top: tokens.spacingVerticalM,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 5,
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: '6px 14px',
    borderRadius: '9999px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
    fontSize: 'var(--fs-caption2)',
    fontWeight: tokens.fontWeightMedium,
    boxShadow: tokens.shadow4,
    pointerEvents: 'none',
    opacity: 0.9,
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
});

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
    <Controls showZoom={false} showFitView={false} showInteractive={false}>
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

const PathMapFlow = ({
  path,
  setSelectedCert,
  selectedBranch = 'all',
  statusFilter = 'all',
  fitViewTrigger = 0,
}) => {
  const c = useClasses();
  const { getStatus, isPathIgnored } = useProgressContext();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const branches = useMemo(() => path?.branches || [], [path?.branches]);
  const hasBranches = branches.length > 0 && path?.certifications.some(cert => cert.branch);

  const { trunkFundamentals, trunkBottom, branchColumns } = useMemo(() => {
    if (!path || !hasBranches) return { trunkFundamentals: [], trunkBottom: [], branchColumns: [] };

    const trunkCerts = path.certifications.filter(cert => !cert.branch);
    const trunkFundamentals = trunkCerts.filter(cert => cert.level === CERT_LEVELS.FUNDAMENTALS);
    const trunkBottom = trunkCerts.filter(cert => cert.level !== CERT_LEVELS.FUNDAMENTALS);

    const branchColumns = branches.map(branchDef => {
      const certs = path.certifications.filter(cert => cert.branch === branchDef.id);
      return { ...branchDef, allCerts: certs };
    }).filter(b => b.allCerts.length > 0);

    return { trunkFundamentals, trunkBottom, branchColumns };
  }, [path, hasBranches, branches]);

  const linearGroups = useMemo(() => {
    if (!path || hasBranches) return [];
    return LEVELS
      .map(level => ({ level, certs: path.certifications.filter(cert => cert.level === level) }))
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
  }, [path, hasBranches, trunkFundamentals, trunkBottom, branchColumns, linearGroups, getStatus, isPathIgnored, path?.color, setSelectedCert, setNodes, setEdges, selectedBranch, statusFilter]);

  const performFitView = useCallback((duration = 500) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isMobile) {
      fitView({ duration, padding: 0.15, minZoom: 0.45, maxZoom: 0.85 });
    } else {
      fitView({ duration, padding: 0.1 });
    }
  }, [fitView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performFitView(500);
    }, 80);
    return () => clearTimeout(timer);
  }, [fitViewTrigger, path?.id, performFitView]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: '600px', width: '100%', position: 'relative' }}>
        <div className={c.touchHint}>
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
  const c = useClasses();
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
  const [fitViewTrigger, setFitViewTrigger] = useState(0);
  const [prevPathId, setPrevPathId] = useState(pathId);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  if (prevPathId !== pathId) {
    setPrevPathId(pathId);
    setSelectedBranch('all');
    setStatusFilter('all');
  }

  const handleSelectMapView = useCallback(() => {
    setViewMode('map');
    setFitViewTrigger((prev) => prev + 1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedBranch('all');
    setStatusFilter('all');
  }, []);

  const selectedCert = useMemo(() => {
    if (!path || !selectedCertId) return null;
    return path.certifications.find((item) => item.id === selectedCertId) || null;
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
    return path.certifications.map(item => item.examCode).filter(Boolean).slice(0, 10).join(', ');
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
      <div className={c.notFound}>
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
    <div className={c.root} style={{ '--path-color': path.color, '--path-glow': path.glowColor }}>
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${path.name}, ${path.shortName}, ${certCodes}, Microsoft certification roadmap, Azure certifications`}
        canonical={`https://skills.atozazure.com/path/${path.id}`}
        schema={breadcrumbSchema}
      />
      
      {/* ─── Redesigned Header: Concept 3 Hybrid ─── */}
      <div className={c.header}>
        <div className={c.headerGlow} aria-hidden="true" />
        
        {/* Upper Tier: Brand and Actions */}
        <div className={c.headerTop}>
          <div className={c.headerBrand}>
            <div className={c.headerIcon}>
              <PathIcon size={52} />
            </div>

            <div className={c.headerInfo}>
              <div className={c.headerMetaRow}>
                <span className={c.headerPillarChip}>{path.pillar}</span>
                <span className={c.headerCertCount}>{path.certifications.length} Credentials</span>
              </div>

              <h1 className={c.headerTitle}>{path.name}</h1>

              <p className={c.headerDesc}>{path.description}</p>
            </div>
          </div>

          <div className={c.headerActions}>
            <div className={c.viewToggle} role="tablist" aria-label="View mode">
              <button
                type="button"
                className={mergeClasses(c.viewBtn, viewMode === 'map' && c.viewBtnActive)}
                onClick={handleSelectMapView}
                role="tab"
                aria-selected={viewMode === 'map'}
                title="Interactive Map View"
              >
                <Icons.Map size={15} />
                <span>Map</span>
              </button>
              <button
                type="button"
                className={mergeClasses(c.viewBtn, viewMode === 'list' && c.viewBtnActive)}
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
                type="button"
                className={mergeClasses(c.trackBtn, isPathTracked ? c.trackBtnTracked : c.trackBtnUntracked)}
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
        <div className={c.headerBottom}>
          {path.branches && path.branches.length > 0 ? (
            <div className={c.branchesBar}>
              <span className={c.branchesLabel}>
                <Icons.GitBranch size={13} />
                Branches:
              </span>
              <div className={c.branchesChips}>
                <button
                  type="button"
                  className={mergeClasses(c.branchChip, selectedBranch === 'all' && c.branchChipActive)}
                  onClick={() => setSelectedBranch('all')}
                >
                  All Stations
                </button>
                {path.branches.map(branch => (
                  <button
                    key={branch.id}
                    type="button"
                    className={mergeClasses(c.branchChip, selectedBranch === branch.id && c.branchChipActive)}
                    onClick={() => setSelectedBranch(branch.id === selectedBranch ? 'all' : branch.id)}
                    title={branch.description}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={c.branchesPlaceholder} />
          )}

          <div className={c.headerStats}>
            <div className={c.headerProgress}>
              <ProgressRing percent={pathProgress.percent} size={42} strokeWidth={4} color={path.color} />
            </div>
            <div className={c.headerCounts}>
              <button
                type="button"
                className={mergeClasses(
                  c.statPill,
                  c.statPillCompleted,
                  statusFilter === 'completed' && c.statPillCompletedActive
                )}
                onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
                title="Filter completed certifications"
              >
                <Icons.CheckCircle2 size={13} />
                <span><strong>{pathProgress.completed}</strong> Completed</span>
              </button>
              <button
                type="button"
                className={mergeClasses(
                  c.statPill,
                  c.statPillInProgress,
                  statusFilter === 'in_progress' && c.statPillInProgressActive
                )}
                onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
                title="Filter active in-progress certifications"
              >
                <Icons.Clock size={13} />
                <span><strong>{pathProgress.inProgress}</strong> Active</span>
              </button>
              <button
                type="button"
                className={mergeClasses(
                  c.statPill,
                  c.statPillRemaining,
                  statusFilter === 'not_started' && c.statPillRemainingActive
                )}
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
        <div className={c.viewport}>
          <ReactFlowProvider>
            <PathMapFlow 
              path={path} 
              setSelectedCert={handleSelectCert}
              selectedBranch={selectedBranch}
              statusFilter={statusFilter}
              fitViewTrigger={fitViewTrigger}
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
