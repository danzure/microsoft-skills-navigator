import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  ArrowUp16Regular,
  Open16Regular,
  ShieldCheckmark16Regular,
  Certificate16Regular,
  Sparkle16Regular,
  BookOpen16Regular,
  Search16Regular,
  CheckmarkCircle16Regular,
  Map16Regular,
} from '@fluentui/react-icons';
import { certificationPaths, PILLARS } from '../../data/certificationPaths';
import { getAllAppliedSkills } from '../../data/appliedSkills';
import { useProgressContext } from '../../context/ProgressContext';
import { GitHubIcon, AzureIcon } from '../common/ProductIcons';

const useStyles = makeStyles({
  footer: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderTop(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    width: '100%',
    boxSizing: 'border-box',
    marginTop: 'auto',
    fontFamily:
      "'Segoe UI Variable Text', 'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
  },
  container: {
    maxWidth: '1440px',
    width: '100%',
    margin: '0 auto',
    ...shorthands.padding(
      tokens.spacingVerticalXL,
      tokens.spacingHorizontalXL,
      tokens.spacingVerticalL
    ),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    boxSizing: 'border-box',
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'fit-content(360px) max-content max-content max-content',
    justifyContent: 'space-between',
    alignItems: 'start',
    rowGap: tokens.spacingVerticalL,
    '@media (max-width: 1100px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      columnGap: tokens.spacingHorizontalXL,
      rowGap: tokens.spacingVerticalXL,
      justifyContent: 'normal',
    },
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
      columnGap: 0,
      rowGap: tokens.spacingVerticalL,
      justifyContent: 'normal',
    },
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
    maxWidth: '360px',
  },
  brandHeader: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    textDecorationLine: 'none',
    color: tokens.colorNeutralForeground1,
    height: '24px',
    minWidth: 0,
  },
  brandIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    flexShrink: 0,
  },
  brandTitle: {
    fontSize: '15px',
    fontWeight: tokens.fontWeightBold,
    letterSpacing: '-0.01em',
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  brandSubtitle: {
    fontSize: '11px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.padding('2px', '6px'),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorBrandStroke2),
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    marginLeft: '6px',
    flexShrink: 0,
  },
  brandDesc: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.5',
    color: tokens.colorNeutralForeground2,
  },
  badgesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '4px',
  },
  featureChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.padding('3px', '8px'),
    whiteSpace: 'nowrap',
  },
  chipIcon: {
    color: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
  },
  sectionCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
  },
  columnHeading: {
    margin: 0,
    fontSize: '12px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    lineHeight: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  linkList: {
    listStyleType: 'none',
    ...shorthands.margin(0),
    ...shorthands.padding(0),
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  navLink: {
    fontSize: '13px',
    lineHeight: '18px',
    color: tokens.colorNeutralForeground2,
    textDecorationLine: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    whiteSpace: 'nowrap',
    transitionProperty: 'color, transform',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    width: 'fit-content',
    ':hover': {
      color: tokens.colorBrandForeground1,
      transform: 'translateX(2px)',
    },
  },
  extIcon: {
    fontSize: '12px',
    opacity: 0.7,
    flexShrink: 0,
  },
  statusBar: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding('8px', tokens.spacingHorizontalM),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
  metricsGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
  },
  metricItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
  },
  metricIcon: {
    color: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
  },
  metricStrong: {
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    marginRight: '2px',
  },
  backToTopBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: '28px',
    ...shorthands.padding(0, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    fontSize: '12px',
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer',
    boxShadow: tokens.shadow2,
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    width: 'fit-content',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      boxShadow: tokens.shadow4,
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  disclaimer: {
    ...shorthands.padding(tokens.spacingVerticalS, 0, 0),
    ...shorthands.borderTop(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    fontSize: '12px',
    lineHeight: '1.45',
    color: tokens.colorNeutralForeground3,
    margin: 0,
  },
  bottomBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    paddingTop: '4px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  bottomLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  bottomLink: {
    color: tokens.colorNeutralForeground2,
    textDecorationLine: 'none',
    fontWeight: tokens.fontWeightMedium,
    transitionProperty: 'color',
    transitionDuration: tokens.durationFast,
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  dotDivider: {
    color: tokens.colorNeutralForeground4,
    userSelect: 'none',
  },
  bottomRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  versionTag: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.padding('2px', '6px'),
  },
});

/**
 * Footer Component
 *
 * Compact, uniform 4-column enterprise application footer for Microsoft Skills Navigator.
 * Features equalized column widths, uniform gaps, balanced typography hierarchy,
 * track navigation, tools & resources, official Microsoft Learn links, and telemetry statistics.
 * Aligned with Fluent 2 Design System tokens and dark/light theme symmetry.
 */
export default function Footer() {
  const styles = useStyles();
  const { getOverallProgress } = useProgressContext();

  const stats = useMemo(() => {
    let totalCerts = 0;
    const seenCerts = new Set();
    const activePaths = certificationPaths.filter(
      (p) => p.pillar !== PILLARS.RETIRED
    );

    certificationPaths.forEach((path) => {
      path.certifications.forEach((cert) => {
        if (!seenCerts.has(cert.id)) {
          seenCerts.add(cert.id);
          totalCerts += 1;
        }
      });
    });

    const allAppliedSkills = getAllAppliedSkills();
    const overall = getOverallProgress();

    return {
      totalCerts,
      activeTracksCount: activePaths.length,
      appliedSkillsCount: allAppliedSkills.length,
      completedCount: overall.completed || 0,
      inProgressCount: overall.inProgress || 0,
    };
  }, [getOverallProgress]);

  const handleScrollToTop = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTriggerCommandPalette = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Site footer">
      <div className={styles.container}>
        {/* Top 4-Column Navigation Grid: 4 Equal Width Columns */}
        <div className={styles.topGrid}>
          {/* Column 1: Brand & Value Proposition */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.brandHeader} title="Microsoft Skills Navigator">
              <div className={styles.brandIconWrapper}>
                <AzureIcon size={22} />
              </div>
              <span className={styles.brandTitle}>Microsoft Skills Navigator</span>
              <span className={styles.brandSubtitle}>by atozazure</span>
            </Link>

            <p className={styles.brandDesc}>
              Interactive visual roadmaps, exam prerequisite trees, and role-based
              career pathways across the Microsoft Cloud ecosystem.
            </p>

            <div className={styles.badgesRow}>
              <span className={styles.featureChip}>
                <ShieldCheckmark16Regular className={styles.chipIcon} />
                100% Client-Side
              </span>
              <span className={styles.featureChip}>
                <Sparkle16Regular className={styles.chipIcon} />
                2026 Catalog
              </span>
              <a
                href="https://github.com/danzure/microsoft-skills-navigator"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.featureChip}
                style={{ textDecoration: 'none' }}
                title="GitHub Repository"
              >
                <GitHubIcon size={13} className={styles.chipIcon} />
                Open Source
              </a>
            </div>
          </div>

          {/* Column 2: Certification Paths */}
          <div className={styles.sectionCol}>
            <h3 className={styles.columnHeading}>Certification Paths</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/path/azure-infrastructure" className={styles.navLink}>
                  Azure Apps & Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/path/ai-machine-learning" className={styles.navLink}>
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/path/data-engineering" className={styles.navLink}>
                  Data Engineering & Analytics
                </Link>
              </li>
              <li>
                <Link to="/path/security" className={styles.navLink}>
                  Security, Compliance & Identity
                </Link>
              </li>
              <li>
                <Link to="/path/github" className={styles.navLink}>
                  GitHub & Azure DevOps
                </Link>
              </li>
              <li>
                <Link to="/path/agentic-ai" className={styles.navLink}>
                  Agentic AI & Business Solutions
                </Link>
              </li>
              <li>
                <Link to="/path/power-platform" className={styles.navLink}>
                  Power Platform & Automation
                </Link>
              </li>
              <li>
                <Link to="/path/microsoft-365" className={styles.navLink}>
                  Microsoft 365 Modern Work
                </Link>
              </li>
              <li>
                <Link to="/path/dynamics-365" className={styles.navLink}>
                  Dynamics 365 Business Apps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Interactive Features */}
          <div className={styles.sectionCol}>
            <h3 className={styles.columnHeading}>Tools & Features</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/career-paths" className={styles.navLink}>
                  Career Role Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/career-paths?role=custom" className={styles.navLink}>
                  Custom Career Playlist
                </Link>
              </li>
              <li>
                <Link to="/applied-skills" className={styles.navLink}>
                  Applied Skills Labs Hub
                </Link>
              </li>
              <li>
                <Link to="/path/azure-infrastructure" className={styles.navLink}>
                  Prerequisite Metro Maps
                </Link>
              </li>
              <li>
                <Link to="/path/retired-certifications" className={styles.navLink}>
                  Archived & Retiring Exams
                </Link>
              </li>
              <li>
                <a
                  href="#search"
                  onClick={handleTriggerCommandPalette}
                  className={styles.navLink}
                  title="Press Ctrl+K or ⌘K"
                >
                  <Search16Regular className={styles.extIcon} />
                  Command Palette (Ctrl+K)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Resources & Ecosystem */}
          <div className={styles.sectionCol}>
            <h3 className={styles.columnHeading}>Official Resources</h3>
            <ul className={styles.linkList}>
              <li>
                <a
                  href="https://learn.microsoft.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Microsoft Learn Hub
                  <Open16Regular className={styles.extIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://learn.microsoft.com/credentials/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Credentials Directory
                  <Open16Regular className={styles.extIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://learn.microsoft.com/credentials/browse/?credential_types=applied%20skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Applied Skills Directory
                  <Open16Regular className={styles.extIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://learn.microsoft.com/credentials/renew/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Annual Exam Renewal
                  <Open16Regular className={styles.extIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://learn.microsoft.com/credentials/certifications/practice-assessments-measure-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Practice Assessments & Sandbox
                  <Open16Regular className={styles.extIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://techcommunity.microsoft.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Microsoft Tech Community
                  <Open16Regular className={styles.extIcon} />
                </a>
              </li>
              <li>
                <a
                  href="https://atozazure.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  atozazure Architecture
                  <Open16Regular className={styles.extIcon} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Live Catalog Metrics & Scroll to Top Bar */}
        <div className={styles.statusBar}>
          <div className={styles.metricsGroup}>
            <div className={styles.metricItem}>
              <Certificate16Regular className={styles.metricIcon} />
              <span className={styles.metricLabel}>
                <strong className={styles.metricStrong}>{stats.totalCerts}</strong>
                Certifications
              </span>
            </div>

            <div className={styles.metricItem}>
              <Map16Regular className={styles.metricIcon} />
              <span className={styles.metricLabel}>
                <strong className={styles.metricStrong}>{stats.activeTracksCount}</strong>
                Active Tracks
              </span>
            </div>

            <div className={styles.metricItem}>
              <BookOpen16Regular className={styles.metricIcon} />
              <span className={styles.metricLabel}>
                <strong className={styles.metricStrong}>{stats.appliedSkillsCount}</strong>
                Applied Skills Labs
              </span>
            </div>

            {(stats.completedCount > 0 || stats.inProgressCount > 0) && (
              <div className={styles.metricItem}>
                <CheckmarkCircle16Regular className={styles.metricIcon} />
                <span className={styles.metricLabel}>
                  <strong className={styles.metricStrong}>{stats.completedCount}</strong>
                  Completed &bull;{' '}
                  <strong className={styles.metricStrong}>{stats.inProgressCount}</strong>
                  Studying
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.backToTopBtn}
            onClick={handleScrollToTop}
            aria-label="Scroll back to top of dashboard"
          >
            <ArrowUp16Regular />
            <span>Back to Top</span>
          </button>
        </div>

        {/* Legal Disclaimer */}
        <p className={styles.disclaimer}>
          Disclaimer: Microsoft Skills Navigator is an independent, community-driven
          open-source project published by atozazure and is not affiliated with,
          sponsored by, or endorsed by Microsoft Corporation. Microsoft, Azure, Entra,
          Microsoft 365, Copilot, Power Platform, Dynamics 365, GitHub, and their
          respective logos and marks are trademarks of Microsoft Corporation.
        </p>

        {/* Bottom Bar: Copyright, Version, Tech Stack */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomLeft}>
            <span>
              &copy; {new Date().getFullYear()} atozazure &bull; Created by{' '}
              <a
                href="https://atozazure.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bottomLink}
              >
                Daniel Powley
              </a>
            </span>
            <span className={styles.dotDivider}>&bull;</span>
            <a
              href="https://github.com/danzure/microsoft-skills-navigator"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomLink}
            >
              GitHub Repository
            </a>
            <span className={styles.dotDivider}>&bull;</span>
            <a
              href="https://atozazure.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomLink}
            >
              atozazure.com
            </a>
          </div>

          <div className={styles.bottomRight}>
            <span>Fluent 2 &bull; React 19</span>
            <span className={styles.versionTag}>v1.21.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
