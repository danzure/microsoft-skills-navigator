import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Badge as FluentBadge,
} from '@fluentui/react-components';
import {
  Shield24Regular,
  ShieldCheckmark20Regular,
  Database20Regular,
  ArrowDownload16Regular,
  Delete16Regular,
  CheckmarkCircle16Regular,
  Circle16Regular,
  ArrowLeft16Regular,
  Open16Regular,
  LockClosed20Regular,
  DocumentBulletList20Regular,
  Info16Regular,
  Key16Regular,
} from '@fluentui/react-icons';
import SEO from '../common/SEO';
import Badge from '../common/Badge';
import Footer from '../Layout/Footer';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%',
    alignItems: 'stretch',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    boxSizing: 'border-box',
    animationName: {
      from: { opacity: 0, transform: 'translateY(6px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animationDuration: 'var(--duration-normal)',
    animationTimingFunction: 'var(--curve-easy-ease)',
    animationFillMode: 'forwards',
    '@media (max-width: 768px)': {
      ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
      gap: tokens.spacingVerticalXL,
    },
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    color: tokens.colorNeutralForeground2,
    textDecorationLine: 'none',
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    width: 'fit-content',
    ...shorthands.padding('4px', '8px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    transitionProperty: 'color, background-color, transform',
    transitionDuration: tokens.durationFast,
    ':hover': {
      color: tokens.colorBrandForeground1,
      backgroundColor: tokens.colorSubtleBackgroundHover,
      transform: 'translateX(-2px)',
    },
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXXL),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow4,
    backgroundImage:
      'linear-gradient(135deg, color-mix(in srgb, var(--colorBrandBackground) 6%, transparent) 0%, transparent 100%)',
    '@media (max-width: 768px)': {
      ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalL),
    },
  },
  heroHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  heroIconBox: {
    width: '44px',
    height: '44px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: tokens.shadow2,
    flexShrink: 0,
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeHero800,
    lineHeight: tokens.lineHeightHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: tokens.fontSizeHero700,
      lineHeight: tokens.lineHeightHero700,
    },
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    marginTop: tokens.spacingVerticalXS,
  },
  heroDesc: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground2,
    maxWidth: '920px',
  },
  metaBar: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
    paddingTop: tokens.spacingVerticalS,
    ...shorthands.borderTop(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  highlightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalL,
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingVerticalM,
    },
  },
  highlightCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    boxShadow: tokens.shadow2,
    transitionProperty: 'transform, box-shadow, border-color',
    transitionDuration: tokens.durationNormal,
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow4,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  highlightIconBox: {
    width: '36px',
    height: '36px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  highlightDesc: {
    margin: 0,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground3,
  },
  inspectorCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    },
  },
  inspectorHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
  inspectorTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  inspectorTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  inspectorSubtitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  inspectorStatsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXL,
    flexWrap: 'wrap',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
  },
  statBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statNumber: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
    fontFamily: tokens.fontFamilyMonospace,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: tokens.fontWeightMedium,
  },
  keysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: tokens.spacingHorizontalS,
  },
  keyChip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('8px', tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: tokens.fontSizeBase200,
  },
  keyChipName: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: '11px',
    color: tokens.colorNeutralForeground1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: tokens.spacingHorizontalS,
  },
  sectionCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    boxShadow: tokens.shadow2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    '@media (max-width: 768px)': {
      ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    paddingBottom: tokens.spacingVerticalM,
  },
  sectionIconBox: {
    width: '32px',
    height: '32px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    lineHeight: tokens.lineHeightBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  bodyText: {
    margin: 0,
    fontSize: tokens.fontSizeBase300,
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: tokens.fontSizeBase200,
  },
  th: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    whiteSpace: 'nowrap',
  },
  td: {
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.45',
  },
  codeKey: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: '11px',
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorBrandForeground1,
    ...shorthands.padding('2px', '6px'),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    whiteSpace: 'nowrap',
  },
  calloutBox: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderLeft('4px', 'solid', tokens.colorBrandStroke1),
    ...shorthands.borderTop(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    ...shorthands.borderRight(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'flex-start',
  },
  link: {
    color: tokens.colorBrandForeground1,
    textDecorationLine: 'none',
    fontWeight: tokens.fontWeightMedium,
    ':hover': {
      textDecorationLine: 'underline',
    },
  },
  footerNotice: {
    ...shorthands.padding(tokens.spacingVerticalL, 0),
    textAlign: 'center',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
});

const LOCAL_STORAGE_KEYS = [
  {
    key: 'ms-cert-tracker-progress',
    label: 'Certification Progress',
    desc: 'Tracks exam completion statuses (not_started, in_progress, completed, needs_renewal)',
    category: 'Credentials',
  },
  {
    key: 'ms-cert-tracker-tracked-paths',
    label: 'Tracked Technology Paths',
    desc: 'Active tracks pinned for focused monitoring on the Dashboard',
    category: 'Navigation',
  },
  {
    key: 'ms-cert-tracker-tracked-certs',
    label: 'Pinned Priority Certifications',
    desc: 'Individual certifications selected for priority tracking in the Action Center',
    category: 'Credentials',
  },
  {
    key: 'ms-cert-tracker-dismissed-certs',
    label: 'Dismissed Recommendations',
    desc: 'Recommendations explicitly dismissed from the Action Center queue',
    category: 'Preferences',
  },
  {
    key: 'ms-cert-tracker-dates',
    label: 'Completion Timestamps',
    desc: 'UTC timestamps of exam completions used to calculate 1-year renewal warnings',
    category: 'Lifecycle',
  },
  {
    key: 'ms-cert-tracker-custom-playlist',
    label: 'Custom Career Timeline',
    desc: 'Drag-and-drop ordered sequence of certifications in the Career Path Builder',
    category: 'Roadmap',
  },
  {
    key: 'ms-cert-tracker-applied-skills',
    label: 'Applied Skills Lab Progress',
    desc: 'Progress statuses for scenario-based hands-on Microsoft Applied Skills labs',
    category: 'Applied Skills',
  },
  {
    key: 'ms-cert-tracker-theme',
    label: 'Theme Preference',
    desc: 'Visual appearance choice (light, dark, or system default)',
    category: 'Display',
  },
  {
    key: 'atozazure_currency',
    label: 'Exam Pricing Currency',
    desc: 'Display currency preference for estimated exam fees (GBP, USD, EUR)',
    category: 'Display',
  },
];

/**
 * PrivacyPolicy Component
 * 
 * Provides a comprehensive, transparent, and interactive overview of
 * Microsoft Skills Navigator's client-side, zero-tracking architecture.
 */
export default function PrivacyPolicy({ onOpenDataModal }) {
  const styles = useStyles();

  // Inspect local storage usage dynamically
  const storageAudit = useMemo(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { totalKeys: 0, activeKeys: 0, totalBytes: 0, keyStatuses: {} };
    }

    let activeKeys = 0;
    let totalBytes = 0;
    const keyStatuses = {};

    LOCAL_STORAGE_KEYS.forEach(({ key }) => {
      const val = window.localStorage.getItem(key);
      const isSet = val !== null && val !== undefined && val !== '';
      if (isSet) {
        activeKeys += 1;
        totalBytes += (key.length + val.length) * 2; // Rough UTF-16 bytes
      }
      keyStatuses[key] = {
        isSet,
        size: isSet ? (key.length + val.length) * 2 : 0,
      };
    });

    return {
      totalKeys: LOCAL_STORAGE_KEYS.length,
      activeKeys,
      totalBytes,
      keyStatuses,
    };
  }, []);

  return (
    <div className={styles.page}>
      <SEO
        title="Privacy Policy | Microsoft Skills Navigator"
        description="Learn about Microsoft Skills Navigator's client-side, zero-tracking privacy architecture. All certification progress is stored strictly on your device."
        canonical="https://skills.atozazure.com/privacy"
      />

      <div className={styles.container}>
        {/* Back navigation */}
        <Link to="/" className={styles.backLink} aria-label="Return to Dashboard">
          <ArrowLeft16Regular />
          <span>Back to Dashboard</span>
        </Link>

        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroHeader}>
            <div className={styles.heroIconBox}>
              <Shield24Regular />
            </div>
            <div className={styles.titleGroup}>
              <h1 className={styles.title}>Privacy Policy</h1>
              <div className={styles.badgeRow}>
                <Badge variant="completed">100% Client-Side</Badge>
                <Badge variant="technical">Zero Tracking</Badge>
                <Badge variant="associate">No Cookies</Badge>
                <Badge variant="fundamentals">Privacy by Design</Badge>
              </div>
            </div>
          </div>

          <p className={styles.heroDesc}>
            Microsoft Skills Navigator was engineered from the ground up as a private, client-side
            learning roadmap and certification tracker. All data processing, progress calculations,
            and custom career timelines remain strictly inside your browser. We never collect,
            track, or transmit your personal data.
          </p>

          <div className={styles.metaBar}>
            <span>
              <strong>Effective Date:</strong> October 24, 2026
            </span>
            <span>&bull;</span>
            <span>
              <strong>Publisher:</strong> atozazure (Daniel Powley)
            </span>
            <span>&bull;</span>
            <span>
              <strong>Application:</strong> atozazure-mscertification-tool v1.22.0
            </span>
          </div>
        </header>

        {/* Highlights Grid */}
        <section className={styles.highlightsGrid} aria-label="Privacy Highlights">
          <div className={styles.highlightCard}>
            <div className={styles.highlightIconBox}>
              <ShieldCheckmark20Regular />
            </div>
            <h3 className={styles.highlightTitle}>Zero Personal Data</h3>
            <p className={styles.highlightDesc}>
              No accounts, email addresses, usernames, or passwords. You never need to sign in.
            </p>
          </div>

          <div className={styles.highlightCard}>
            <div className={styles.highlightIconBox}>
              <LockClosed20Regular />
            </div>
            <h3 className={styles.highlightTitle}>100% Client-Side</h3>
            <p className={styles.highlightDesc}>
              All progress logic and prerequisites evaluate in your browser. No backend user database exists.
            </p>
          </div>

          <div className={styles.highlightCard}>
            <div className={styles.highlightIconBox}>
              <ArrowDownload16Regular />
            </div>
            <h3 className={styles.highlightTitle}>Total Portability</h3>
            <p className={styles.highlightDesc}>
              Export your complete progress as an unencrypted JSON backup anytime with 1 click.
            </p>
          </div>

          <div className={styles.highlightCard}>
            <div className={styles.highlightIconBox}>
              <Delete16Regular />
            </div>
            <h3 className={styles.highlightTitle}>Instant Erasure</h3>
            <p className={styles.highlightDesc}>
              Purge all progress and stored preferences locally with 1 click in Data & Preferences.
            </p>
          </div>
        </section>

        {/* Live Local Storage Inspector */}
        <section className={styles.inspectorCard} aria-label="Local Storage Audit">
          <div className={styles.inspectorHeader}>
            <div className={styles.inspectorTitleGroup}>
              <div className={styles.sectionIconBox}>
                <Database20Regular />
              </div>
              <div>
                <h2 className={styles.inspectorTitle}>Live LocalStorage Audit</h2>
                <p className={styles.inspectorSubtitle}>
                  Real-time inspection of data stored by Microsoft Skills Navigator on this browser
                </p>
              </div>
            </div>

            {onOpenDataModal && (
              <Button
                appearance="secondary"
                icon={<Database20Regular />}
                onClick={onOpenDataModal}
              >
                Manage & Export Data
              </Button>
            )}
          </div>

          <div className={styles.inspectorStatsRow}>
            <div className={styles.statBlock}>
              <span className={styles.statNumber}>
                {storageAudit.activeKeys} / {storageAudit.totalKeys}
              </span>
              <span className={styles.statLabel}>Active Storage Keys</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statNumber}>
                {storageAudit.totalBytes > 1024
                  ? `${(storageAudit.totalBytes / 1024).toFixed(1)} KB`
                  : `${storageAudit.totalBytes} Bytes`}
              </span>
              <span className={styles.statLabel}>Stored Payload</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statNumber}>0 Bytes</span>
              <span className={styles.statLabel}>Transmitted to Remote Servers</span>
            </div>
          </div>

          <div className={styles.keysGrid}>
            {LOCAL_STORAGE_KEYS.map(({ key, label }) => {
              const status = storageAudit.keyStatuses[key];
              const isSet = status?.isSet;
              return (
                <div key={key} className={styles.keyChip} title={key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    {isSet ? (
                      <CheckmarkCircle16Regular style={{ color: 'var(--colorBrandForeground1)', flexShrink: 0 }} />
                    ) : (
                      <Circle16Regular style={{ color: 'var(--colorNeutralForeground4)', flexShrink: 0 }} />
                    )}
                    <span className={styles.keyChipName}>{label}</span>
                  </div>
                  <FluentBadge
                    size="small"
                    appearance={isSet ? 'filled' : 'outline'}
                    color={isSet ? 'brand' : 'subtle'}
                  >
                    {isSet ? 'Stored' : 'Empty'}
                  </FluentBadge>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 1: Architecture & Data Sovereignty */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <DocumentBulletList20Regular />
            </div>
            <h2 className={styles.sectionTitle}>1. Architectural Principle: Privacy by Design</h2>
          </div>
          <p className={styles.bodyText}>
            Microsoft Skills Navigator was developed as an open-source, community-driven resource
            for engineers, architects, and administrators pursuing Microsoft credentials. We reject the
            trend of requiring personal sign-ups, email subscriptions, or centralized tracking to access
            learning roadmaps.
          </p>
          <div className={styles.calloutBox}>
            <Info16Regular style={{ color: 'var(--colorBrandForeground1)', flexShrink: 0, marginTop: '2px' }} />
            <p className={styles.bodyText} style={{ margin: 0, fontSize: '13px' }}>
              <strong>Zero Server-Side Storage:</strong> There is no backend user database, no authentication
              system, and no server-side synchronization of your learning milestones. Everything you mark
              as &quot;Passed&quot; or &quot;Studying&quot; remains strictly in your current browser&apos;s isolated
              storage partition.
            </p>
          </div>
        </section>

        {/* Section 2: Detailed LocalStorage Registry */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <Key16Regular />
            </div>
            <h2 className={styles.sectionTitle}>2. Complete LocalStorage Data Registry</h2>
          </div>
          <p className={styles.bodyText}>
            Below is the comprehensive inventory of the 9 specific keys maintained in HTML5{' '}
            <code>localStorage</code> across the application:
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Storage Key</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Purpose & Stored Data</th>
                  <th className={styles.th}>Retention</th>
                </tr>
              </thead>
              <tbody>
                {LOCAL_STORAGE_KEYS.map(({ key, desc, category }) => (
                  <tr key={key}>
                    <td className={styles.td}>
                      <span className={styles.codeKey}>{key}</span>
                    </td>
                    <td className={styles.td}>
                      <Badge variant="default">{category}</Badge>
                    </td>
                    <td className={styles.td}>{desc}</td>
                    <td className={styles.td}>Until manually cleared by user</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Data Portability & Deletion */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <ArrowDownload16Regular />
            </div>
            <h2 className={styles.sectionTitle}>3. Data Portability & Instant Erasure</h2>
          </div>
          <p className={styles.bodyText}>
            Because you own your data unconditionally, Microsoft Skills Navigator provides native tools
            for full data portability:
          </p>
          <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li className={styles.bodyText}>
              <strong>One-Click JSON Export:</strong> You can export your progress, custom timelines, and preferences
              to an unencrypted <code>.json</code> file at any time. This file can be stored in your personal
              cloud or transferred between work and home workstations.
            </li>
            <li className={styles.bodyText}>
              <strong>Seamless Restoration:</strong> Uploading your backup file restores all completion dates,
              tracked certifications, and custom playlists instantaneously with zero loss of data.
            </li>
            <li className={styles.bodyText}>
              <strong>Right to Erasure (Reset):</strong> Using the &quot;Reset All Progress&quot; button in the
              Data & Preferences dialog completely purges all 9 keys from your browser, resetting the application
              to a pristine state.
            </li>
          </ul>
        </section>

        {/* Section 4: Cookies & Third-Party Trackers */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <LockClosed20Regular />
            </div>
            <h2 className={styles.sectionTitle}>4. Cookies & Tracking Technologies</h2>
          </div>
          <p className={styles.bodyText}>
            Microsoft Skills Navigator <strong>does not use cookies</strong> for tracking, analytics, or
            advertising.
          </p>
          <p className={styles.bodyText}>
            We do not load third-party analytics services such as Google Analytics, Microsoft Clarity,
            Mixpanel, or Meta Pixels. No tracking beacons or canvas fingerprinting scripts exist in this codebase.
          </p>
        </section>

        {/* Section 5: External Links & Microsoft Learn */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <Open16Regular />
            </div>
            <h2 className={styles.sectionTitle}>5. External Links & Official Resources</h2>
          </div>
          <p className={styles.bodyText}>
            Our application contains outbound links to official Microsoft documentation, examination
            scheduling portals, sandbox assessment labs, and community resources:
          </p>
          <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li className={styles.bodyText}>
              <strong>Microsoft Learn</strong> (<code>learn.microsoft.com</code>): When you click &quot;Open on
              Microsoft Learn&quot; or launch an Applied Skills assessment lab, you leave our site and interact
              directly with Microsoft. Your activity on Microsoft Learn is governed by the{' '}
              <a
                href="https://privacy.microsoft.com/en-us/privacystatement"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Microsoft Privacy Statement <Open16Regular style={{ fontSize: '12px', verticalAlign: 'middle' }} />
              </a>.
            </li>
            <li className={styles.bodyText}>
              <strong>GitHub</strong> (<code>github.com</code>): Outbound links to view our open-source
              repository or report issues are subject to{' '}
              <a
                href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                GitHub Privacy Statement <Open16Regular style={{ fontSize: '12px', verticalAlign: 'middle' }} />
              </a>.
            </li>
          </ul>
        </section>

        {/* Section 6: Hosting & Infrastructure */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <ShieldCheckmark20Regular />
            </div>
            <h2 className={styles.sectionTitle}>6. Cloud Hosting & Technical Diagnostics</h2>
          </div>
          <p className={styles.bodyText}>
            Microsoft Skills Navigator is deployed via <strong>Azure Static Web Apps</strong> and delivered
            globally through Azure&apos;s Content Delivery Network (CDN) with strict HTTPS encryption.
          </p>
          <p className={styles.bodyText}>
            As with any standard web host, Azure cloud edge infrastructure may process non-identifiable web
            server request logs (such as HTTP response status codes, requested asset paths, and connection
            durations) strictly for operational routing, DDoS defense, and infrastructure health monitoring.
            These operational logs are not associated with individual user identities.
          </p>
        </section>

        {/* Section 7: Regulatory Compliance */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <DocumentBulletList20Regular />
            </div>
            <h2 className={styles.sectionTitle}>7. Regulatory Compliance (GDPR & CCPA/CPRA)</h2>
          </div>
          <p className={styles.bodyText}>
            Because Microsoft Skills Navigator does not collect, process, or sell personal data:
          </p>
          <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li className={styles.bodyText}>
              <strong>GDPR Data Minimization:</strong> Article 5(1)(c) of the GDPR requires personal data to be
              adequate, relevant, and limited to what is necessary. We achieve complete data minimization by
              collecting zero personal information.
            </li>
            <li className={styles.bodyText}>
              <strong>CCPA / CPRA &quot;Do Not Sell or Share&quot;:</strong> We never sell, rent, disclose, or share
              any user data or behavioral telemetry with third-party advertisers or data brokers.
            </li>
          </ul>
        </section>

        {/* Section 8: Open Source Governance & Contact */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <Info16Regular />
            </div>
            <h2 className={styles.sectionTitle}>8. Governance & Contact Information</h2>
          </div>
          <p className={styles.bodyText}>
            Microsoft Skills Navigator is an independent, community-driven open-source project created and
            maintained by <strong>Daniel Powley</strong> (atozazure). It is not affiliated with, sponsored
            by, or endorsed by Microsoft Corporation.
          </p>
          <p className={styles.bodyText}>
            If you have questions regarding this Privacy Policy or wish to inspect the client-side code,
            we invite you to visit:
          </p>
          <div style={{ display: 'flex', gap: tokens.spacingHorizontalM, flexWrap: 'wrap', marginTop: tokens.spacingVerticalS }}>
            <a
              href="https://github.com/danzure/microsoft-skills-navigator"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub Repository & Issues <Open16Regular style={{ fontSize: '12px', verticalAlign: 'middle' }} />
            </a>
            <span style={{ color: tokens.colorNeutralForeground4 }}>&bull;</span>
            <a
              href="https://atozazure.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              atozazure.com <Open16Regular style={{ fontSize: '12px', verticalAlign: 'middle' }} />
            </a>
            <span style={{ color: tokens.colorNeutralForeground4 }}>&bull;</span>
            <a href="mailto:daniel@atozazure.com" className={styles.link}>
              daniel@atozazure.com
            </a>
          </div>
        </section>

        <p className={styles.footerNotice}>
          This Privacy Policy is effective as of October 24, 2026 and applies to all users of Microsoft Skills Navigator.
        </p>
      </div>

      <Footer />
    </div>
  );
}
