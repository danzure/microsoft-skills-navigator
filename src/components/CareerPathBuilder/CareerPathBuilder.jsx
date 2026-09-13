import { useState, useMemo } from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { careerRoles } from '../../data/careerRoles';
import { certificationPaths, CERT_STATUS, CERT_LEVELS } from '../../data/certificationPaths';
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

const useClasses = makeStyles({
  /* ─── Page Root ────────────────────────────────────────────────────────── */
  root: {
    padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalXXL}`,
    maxWidth: '1500px',
    margin: '0 auto',
    animationName: {
      from: { opacity: 0, transform: 'translateY(8px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animationDuration: 'var(--duration-normal)',
    animationTimingFunction: 'var(--curve-easy-ease)',
    animationFillMode: 'forwards',
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
      paddingBottom: tokens.spacingVerticalXXXL,
    },
  },
  /* ─── Page Header ──────────────────────────────────────────────────────── */
  header: {
    marginBottom: tokens.spacingVerticalXXXL,
  },
  title: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalS,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    letterSpacing: '-0.02em',
    margin: `0 0 ${tokens.spacingVerticalS} 0`,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
    maxWidth: '820px',
    margin: 0,
  },
  /* ─── Role Cards Grid ──────────────────────────────────────────────────── */
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalXXXL,
  },
  roleCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: tokens.spacingVerticalXL,
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-normal)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: tokens.shadow2,
    zIndex: 1,
    backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, var(--card-color) 8%, transparent) 0%, transparent 100%)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: `${tokens.shadow8}, 0 0 16px color-mix(in srgb, var(--card-color) 15%, transparent)`,
      borderColor: 'color-mix(in srgb, var(--card-color) 40%, var(--colorNeutralStroke1))',
      backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, var(--card-color) 16%, transparent) 0%, transparent 100%)',
    },
    ':active': {
      transform: 'scale(0.98)',
    },
  },
  roleCardActive: {
    borderColor: 'var(--card-color)',
    boxShadow: `0 0 0 1px var(--card-color), ${tokens.shadow8}, 0 0 16px color-mix(in srgb, var(--card-color) 25%, transparent)`,
    transform: 'translateY(-2px)',
    backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, var(--card-color) 22%, transparent) 0%, transparent 100%)',
  },
  roleCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalS,
    overflow: 'hidden',
  },
  roleIcon: {
    flexShrink: 0,
    width: '36px',
    height: '36px',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'color-mix(in srgb, var(--card-color) 12%, var(--colorNeutralBackground3))',
    color: 'var(--card-color)',
  },
  roleTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  roleDesc: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    lineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '2.8em',
  },
  /* ─── Path Container ───────────────────────────────────────────────────── */
  pathContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusXLarge,
    padding: tokens.spacingVerticalXXL,
    position: 'relative',
    '@media (max-width: 768px)': {
      padding: tokens.spacingVerticalL,
    },
  },
  pathTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    letterSpacing: '-0.01em',
    margin: `0 0 ${tokens.spacingVerticalL} 0`,
  },
  /* ─── Role Banner ──────────────────────────────────────────────────────── */
  roleBanner: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: tokens.spacingVerticalXXL,
    marginBottom: tokens.spacingVerticalXL,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: tokens.shadow2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: 'var(--role-color, var(--colorBrandForeground1))',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, color-mix(in srgb, var(--role-color) 8%, transparent) 0%, transparent 100%)',
      pointerEvents: 'none',
    },
    '@media (max-width: 768px)': {
      padding: tokens.spacingVerticalL,
    },
  },
  roleBannerHeader: {
    position: 'relative',
    zIndex: 1,
  },
  roleBannerTitleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  roleBannerTitle: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: tokens.fontSizeBase600,
    },
  },
  roleBannerDesc: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    margin: 0,
    maxWidth: '840px',
  },
  roleBannerStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingVerticalL,
    position: 'relative',
    zIndex: 1,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  roleBannerStatCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  roleBannerStatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
  },
  roleBannerStatLabelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  roleBannerSkillIcon: {
    color: 'var(--line-azure)',
  },
  roleBannerStatLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  roleBannerStatCount: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  roleBannerStatTrack: {
    height: '6px',
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: tokens.borderRadiusCircular,
    overflow: 'hidden',
  },
  roleBannerStatFillCert: {
    height: '100%',
    borderRadius: tokens.borderRadiusCircular,
    background: 'linear-gradient(90deg, var(--colorBrandForeground1), var(--status-completed))',
    transitionProperty: 'width',
    transitionDuration: 'var(--duration-gentle)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
  },
  roleBannerStatFillSkill: {
    height: '100%',
    borderRadius: tokens.borderRadiusCircular,
    background: 'linear-gradient(90deg, var(--line-azure), var(--status-completed))',
    transitionProperty: 'width',
    transitionDuration: 'var(--duration-gentle)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
  },
  /* ─── Custom Playlist Controls ─────────────────────────────────────────── */
  customAddSection: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalXXL,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  customSelect: {
    flex: 1,
    minWidth: '260px',
    height: '32px',
    padding: `0 ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    fontFamily: 'inherit',
    outline: 'none',
    transitionProperty: 'border-color',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':focus': {
      borderColor: tokens.colorBrandStroke1,
    },
    '@media (max-width: 640px)': {
      width: '100%',
      height: '40px',
    },
  },
  customAddBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
    padding: `0 ${tokens.spacingHorizontalL}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    border: 'none',
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover:not(:disabled)': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
    ':active:not(:disabled)': {
      transform: 'scale(0.96)',
    },
    ':disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    '@media (max-width: 640px)': {
      height: '38px',
      padding: `0 ${tokens.spacingHorizontalL}`,
    },
  },
  customExportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    height: '32px',
    padding: `0 ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    ':hover:not(:disabled)': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderColor: tokens.colorNeutralStrokeAccessible,
    },
    ':active:not(:disabled)': {
      transform: 'scale(0.96)',
    },
    ':disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    '@media (max-width: 640px)': {
      height: '38px',
    },
  },
  /* ─── Timeline ──────────────────────────────────────────────────────────── */
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
    position: 'relative',
    marginTop: tokens.spacingVerticalXL,
  },
  timelineCustom: {
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '35px',
      width: '2px',
      backgroundColor: tokens.colorNeutralStroke2,
      zIndex: 0,
      '@media (max-width: 768px)': {
        left: '20px',
      },
    },
  },
  /* ─── Empty State ──────────────────────────────────────────────────────── */
  timelineEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalM,
    padding: `48px ${tokens.spacingVerticalXXL}`,
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusXLarge,
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    maxWidth: '600px',
    margin: '0 auto',
  },
  emptyIconWrapper: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    width: '64px',
    height: '64px',
    borderRadius: tokens.borderRadiusCircular,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacingVerticalS,
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  emptyDesc: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground2,
    margin: 0,
  },
  /* ─── Cert List (Role Path View) ────────────────────────────────────────── */
  certList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalL,
    position: 'relative',
  },
  certListItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  /* ─── Milestone Route Connector (Between Cert Cards) ────────────────────── */
  routeConnector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    userSelect: 'none',
    padding: `${tokens.spacingVerticalS} 0`,
    zIndex: 2,
  },
  routeConnectorStem: {
    width: '2px',
    height: '16px',
    background: 'linear-gradient(180deg, var(--colorNeutralStroke2) 0%, color-mix(in srgb, var(--step-accent-color) 45%, var(--colorNeutralStroke2)) 100%)',
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-normal)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
  },
  routeConnectorStemBottom: {
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--step-accent-color) 45%, var(--colorNeutralStroke2)) 0%, var(--colorNeutralStroke2) 100%)',
  },
  routeConnectorStemPassed: {
    background: 'var(--status-completed)',
    boxShadow: '0 0 6px color-mix(in srgb, var(--status-completed) 40%, transparent)',
  },
  routeConnectorBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: '6px 16px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: '1px solid color-mix(in srgb, var(--step-accent-color) 30%, var(--colorNeutralStroke2))',
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: `${tokens.shadow4}, 0 2px 8px color-mix(in srgb, var(--step-accent-color) 8%, transparent)`,
    transitionProperty: 'all',
    transitionDuration: 'var(--duration-fast)',
    transitionTimingFunction: 'var(--curve-easy-ease)',
    position: 'relative',
    ':hover': {
      transform: 'translateY(-1px)',
      borderColor: 'var(--step-accent-color)',
      boxShadow: `${tokens.shadow8}, 0 0 14px color-mix(in srgb, var(--step-accent-color) 20%, transparent)`,
    },
    '@media (max-width: 768px)': {
      padding: '5px 12px',
      gap: tokens.spacingHorizontalS,
    },
  },
  routeConnectorBadgePassed: {
    borderColor: 'color-mix(in srgb, var(--status-completed) 50%, var(--colorNeutralStroke2))',
    boxShadow: `${tokens.shadow4}, 0 0 12px color-mix(in srgb, var(--status-completed) 20%, transparent)`,
  },
  routeConnectorIconWrap: {
    width: '24px',
    height: '24px',
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'color-mix(in srgb, var(--step-accent-color) 12%, transparent)',
    color: 'var(--step-accent-color)',
    flexShrink: 0,
  },
  routeConnectorIconWrapPassed: {
    backgroundColor: 'color-mix(in srgb, var(--status-completed) 15%, transparent)',
    color: 'var(--status-completed)',
  },
  routeConnectorContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  routeConnectorStepBadge: {
    fontSize: '10px',
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.2,
  },
  routeConnectorLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.3,
  },
  routeConnectorTarget: {
    color: 'var(--step-accent-color)',
    fontWeight: tokens.fontWeightBold,
    fontFamily: 'var(--font-mono)',
  },
  routeConnectorLevelTag: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '2px 7px',
    borderRadius: tokens.borderRadiusSmall,
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    whiteSpace: 'nowrap',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  routeConnectorLevelTagPassed: {
    color: 'var(--status-completed)',
    backgroundColor: 'color-mix(in srgb, var(--status-completed) 10%, transparent)',
    borderColor: 'color-mix(in srgb, var(--status-completed) 30%, transparent)',
  },
});

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
  const c = useClasses();
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

  // Grouped and logically ordered certifications for the custom career path selector
  const groupedCertsForSelect = useMemo(() => {
    const LEVEL_RANK = {
      [CERT_LEVELS.FUNDAMENTALS]: 1,
      [CERT_LEVELS.ASSOCIATE]: 2,
      [CERT_LEVELS.EXPERT]: 3,
      [CERT_LEVELS.SPECIALTY]: 4,
    };

    const seenCertIds = new Set();
    const groups = [];

    certificationPaths.forEach(path => {
      const pathCerts = [];
      path.certifications.forEach(cert => {
        if (!seenCertIds.has(cert.id)) {
          seenCertIds.add(cert.id);
          pathCerts.push({
            ...cert,
            pathId: path.id,
            pathName: path.name,
            pathColor: path.color,
          });
        }
      });

      if (pathCerts.length > 0) {
        pathCerts.sort((a, b) => {
          const rankA = LEVEL_RANK[a.level] || 99;
          const rankB = LEVEL_RANK[b.level] || 99;
          if (rankA !== rankB) return rankA - rankB;
          return a.examCode.localeCompare(b.examCode, undefined, { numeric: true, sensitivity: 'base' });
        });

        let groupLabel = path.name;
        if (path.id === 'retired-exams') {
          groupLabel = 'Retired & Archived Certifications';
        }

        groups.push({
          id: path.id,
          name: groupLabel,
          certs: pathCerts,
        });
      }
    });

    return groups;
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
    <div className={c.root}>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="microsoft career paths, azure career roadmap, cloud architect certification path, devops engineer certifications, ai engineer certification roadmap, skills navigator"
        canonical="https://skills.atozazure.com/career-paths"
        schema={breadcrumbSchema}
      />
      <div className={c.header}>
        <h1 className={c.title}>
          Microsoft Career Paths &amp; Certification Builder
        </h1>
        <p className={c.subtitle}>
          Navigate specialized certification roadmaps aligned with official Microsoft job roles, or craft a personalized drag-and-drop learning playlist. Tailor your certification milestones to accelerate your career growth as an Architect, AI Engineer, Security Admin, or DevOps Specialist.
        </p>
      </div>

      <div className={c.rolesGrid}>
        {sortedRoles.map(role => {
          const isActive = selectedRole?.id === role.id;
          const RoleIcon = Icons[role.icon] || Icons.Briefcase;
          
          return (
            <div 
              key={role.id}
              className={mergeClasses(c.roleCard, isActive && c.roleCardActive)}
              style={{ '--card-color': role.color }}
              onClick={() => setSelectedRoleId(isActive ? null : role.id)}
            >
              <div className={c.roleCardHeader}>
                <div className={c.roleIcon}>
                  <RoleIcon size={18} />
                </div>
                <div className={c.roleTitle}>{role.title}</div>
              </div>
              <div className={c.roleDesc}>{role.description}</div>
            </div>
          );
        })}
      </div>

      {selectedRole && (
        <div className={c.pathContainer}>
          {selectedRole.id === 'custom-playlist' ? (
            <h2 className={c.pathTitle}>Your Custom Career</h2>
          ) : (
            <div className={c.roleBanner} style={{ '--role-color': selectedRole.color }}>
              <div className={c.roleBannerHeader}>
                <div className={c.roleBannerTitleGroup}>
                  <h2 className={c.roleBannerTitle}>
                    Roadmap for {selectedRole.title}
                  </h2>
                  <p className={c.roleBannerDesc}>
                    {selectedRole.description}
                  </p>
                </div>
              </div>

              <div className={c.roleBannerStats}>
                <div className={c.roleBannerStatCard}>
                  <div className={c.roleBannerStatHeader}>
                    <span className={c.roleBannerStatLabel}>Certifications</span>
                    <span className={c.roleBannerStatCount}>
                      {completedCertsCount} of {roleCerts.length} Passed
                    </span>
                  </div>
                  <div className={c.roleBannerStatTrack}>
                    <div 
                      className={c.roleBannerStatFillCert} 
                      style={{ width: `${certPercent}%` }} 
                    />
                  </div>
                </div>

                {roleSkills.length > 0 && (
                  <div className={c.roleBannerStatCard}>
                    <div className={c.roleBannerStatHeader}>
                      <div className={c.roleBannerStatLabelGroup}>
                        <Icons.AppliedSkills size={14} className={c.roleBannerSkillIcon} />
                        <span className={c.roleBannerStatLabel}>Aligned Applied Skills</span>
                      </div>
                      <span className={c.roleBannerStatCount}>
                        {completedSkillsCount} of {roleSkills.length} Earned
                      </span>
                    </div>
                    <div className={c.roleBannerStatTrack}>
                      <div 
                        className={c.roleBannerStatFillSkill} 
                        style={{ width: `${skillPercent}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {selectedRole.id === 'custom-playlist' && (
            <div className={c.customAddSection}>
              <select 
                className={c.customSelect}
                value={certToAdd}
                onChange={(e) => setCertToAdd(e.target.value)}
                aria-label="Select a certification to add"
              >
                <option value="">-- Select a Certification to Add --</option>
                {groupedCertsForSelect.map(group => (
                  <optgroup key={group.id} label={group.name}>
                    {group.certs.map(cert => {
                      const isAdded = customPlaylist.includes(cert.id);
                      let suffix = '';
                      if (isAdded) {
                        suffix = ' (Added)';
                      } else if (group.id === 'retired-exams') {
                        suffix = ' (Retired)';
                      } else if (cert.isBeta) {
                        suffix = ' (Beta)';
                      }

                      return (
                        <option 
                          key={`add-${cert.id}`} 
                          value={cert.id} 
                          disabled={isAdded}
                        >
                          {cert.examCode} - {cert.name}{suffix}
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
              </select>
              <button 
                className={c.customAddBtn} 
                onClick={handleAddCert}
                disabled={!certToAdd}
              >
                Add
              </button>
              <button
                className={c.customExportBtn}
                onClick={handleExportPlaylist}
                disabled={customPlaylist.length === 0}
                title="Export Custom Career as Markdown"
              >
                <Icons.Download size={18} />
                Export
              </button>
            </div>
          )}

          <div className={mergeClasses(c.timeline, selectedRole.id === 'custom-playlist' && c.timelineCustom)}>
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
                    <div className={c.timelineEmpty}>
                      <div className={c.emptyIconWrapper}>
                        <Icons.Compass size={48} />
                      </div>
                      <h3 className={c.emptyTitle}>Your Path is Empty</h3>
                      <p className={c.emptyDesc}>
                        Use the dropdown above to select a certification and click <strong>Add</strong> to start building your custom career track. You can drag and drop items here to reorder them once added.
                      </p>
                    </div>
                  )}
                  {customPlaylist.map((certId, index) => {
                    const certInfo = allCerts.get(certId);
                    if (!certInfo) return null;
                    const status = getStatus(certId);
                    let nodeClass = '';
                    let StatusIcon = Icons.Circle;
                    let statusText;

                    if (status === CERT_STATUS.COMPLETED) {
                      nodeClass = 'cpb-timeline-node--completed';
                      StatusIcon = Icons.CheckCircle2;
                      statusText = 'Completed';
                    } else if (status === CERT_STATUS.NEEDS_RENEWAL) {
                      nodeClass = 'cpb-timeline-node--needs-renewal';
                      StatusIcon = Icons.AlertTriangle;
                      statusText = 'Needs Renewal';
                    } else if (status === CERT_STATUS.IN_PROGRESS) {
                      nodeClass = 'cpb-timeline-node--in-progress';
                      StatusIcon = Icons.Clock;
                      statusText = 'In Progress';
                    } else {
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
              <div className={c.certList}>
                {selectedRole.certs.map((certId, idx) => {
                  const certInfo = allCerts.get(certId);
                  if (!certInfo) return null;
                  const isLast = idx === selectedRole.certs.length - 1;
                  const nextCertId = !isLast ? selectedRole.certs[idx + 1] : null;
                  const nextCertInfo = nextCertId ? allCerts.get(nextCertId) : null;
                  const status = getStatus(certId);
                  const isPassed = status === CERT_STATUS.COMPLETED;

                  return (
                    <div key={certId} className={c.certListItem}>
                      <CareerPathCertCard 
                        certInfo={certInfo} 
                        roleTitle={selectedRole.title}
                        customPlaylist={customPlaylist}
                        onAdd={(id) => setCustomPlaylist([...customPlaylist, id])}
                        onRemove={handleRemoveCert}
                        onSelectSkill={setSelectedSkillForDetail}
                      />
                      {!isLast && nextCertInfo && (
                        <div 
                          className={mergeClasses(c.routeConnector)}
                          style={{ '--step-accent-color': certInfo.pathColor || 'var(--colorBrandForeground1)' }}
                          aria-hidden="true"
                        >
                          <div className={mergeClasses(c.routeConnectorStem, isPassed && c.routeConnectorStemPassed)} />
                          <div className={mergeClasses(c.routeConnectorBadge, isPassed && c.routeConnectorBadgePassed)}>
                            <div className={mergeClasses(c.routeConnectorIconWrap, isPassed && c.routeConnectorIconWrapPassed)}>
                              {isPassed ? (
                                <Icons.CheckCircle2 size={13} />
                              ) : (
                                <Icons.ArrowDown size={13} />
                              )}
                            </div>
                            <div className={c.routeConnectorContent}>
                              <span className={c.routeConnectorStepBadge}>
                                Step {idx + 1} of {selectedRole.certs.length}
                              </span>
                              <span className={c.routeConnectorLabel}>
                                {isPassed ? 'Milestone Passed • Advance to' : 'Next in Progression Route:'}{' '}
                                <strong className={c.routeConnectorTarget}>{nextCertInfo.examCode}</strong>
                              </span>
                            </div>
                            <span className={mergeClasses(c.routeConnectorLevelTag, isPassed && c.routeConnectorLevelTagPassed)}>
                              {nextCertInfo.level}
                            </span>
                          </div>
                          <div className={mergeClasses(c.routeConnectorStem, c.routeConnectorStemBottom, isPassed && c.routeConnectorStemPassed)} />
                        </div>
                      )}
                    </div>
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
