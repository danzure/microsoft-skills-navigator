import { useEffect, useMemo } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  Dismiss20Regular,
  Warning16Regular,
  CalendarLtr20Regular,
  Ribbon20Regular,
  Eye20Regular,
  EyeOff20Regular,
  Open16Regular,
  Sparkle16Regular,
} from '@fluentui/react-icons';
import { IconMap } from '../common/IconMap';
import { useProgressContext } from '../../context/ProgressContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { CERT_STATUS, getCertById, getCertificationsRequiring, doesCertExpire } from '../../data/certificationPaths';
import { getAppliedSkillsForCert } from '../../data/appliedSkills.js';
import { isRetiring, isRetired, formatDate, getBadgeUrl } from '../../utils/helpers';
import { getFormattedExamCost, CURRENCIES } from '../../utils/pricing';
import Badge from '../common/Badge';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(4px)',
    zIndex: 400,
  },
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '480px',
    maxWidth: '100vw',
    zIndex: 500,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderLeft(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow64,
    boxSizing: 'border-box',
    paddingBottom: tokens.spacingVerticalXXXL,
  },
  headerStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
  },
  header: {
    position: 'relative',
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXL, tokens.spacingVerticalM),
  },
  closeBtn: {
    position: 'absolute',
    top: tokens.spacingVerticalM,
    right: tokens.spacingHorizontalM,
    width: '36px',
    height: '36px',
    ...shorthands.padding(0),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalXL,
  },
  titleText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  name: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase500,
  },
  examCode: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
  },
  badgeIcon: {
    width: '64px',
    height: '64px',
    flexShrink: 0,
    objectFit: 'contain',
  },
  badgesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalXS,
  },
  body: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  sectionTitle: {
    margin: 0,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shortcutHint: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground3,
  },
  description: {
    margin: 0,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  skillsList: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  skillItem: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  validityRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
  },
  currencySelect: {
    ...shorthands.padding('2px', tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase200,
    outlineStyle: 'none',
  },
  costDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    gap: tokens.spacingHorizontalS,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
  },
  costAmount: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  costNote: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  alert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', 'transparent'),
  },
  alertWarning: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
    ...shorthands.borderColor(tokens.colorPaletteDarkOrangeBorder1),
    color: tokens.colorPaletteDarkOrangeForeground1,
  },
  alertDanger: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    ...shorthands.borderColor(tokens.colorPaletteRedBorderActive),
    color: tokens.colorPaletteRedForeground1,
  },
  renewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalS,
    height: '32px',
    ...shorthands.padding(0, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border('none'),
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    cursor: 'pointer',
    fontWeight: tokens.fontWeightMedium,
    fontSize: tokens.fontSizeBase200,
  },
  prereqsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  prereqGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground3,
  },
  prereqGroupLabel: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
  },
  prereqItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  prereqName: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
  },
  prereqCode: {
    fontSize: tokens.fontSizeBase100,
    fontFamily: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
    color: tokens.colorBrandForeground1,
  },
  appliedSkillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  appliedSkillItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
    textDecorationLine: 'none',
    color: 'inherit',
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  appliedSkillIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  appliedSkillContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flexGrow: 1,
    minWidth: 0,
  },
  appliedSkillTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
  },
  appliedSkillMeta: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  trackBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    height: '36px',
    ...shorthands.padding(0, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    fontWeight: tokens.fontWeightMedium,
    fontSize: tokens.fontSizeBase200,
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  trackBtnTracked: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    color: tokens.colorBrandForeground1,
    ':hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  ignoreHint: {
    margin: 0,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase100,
  },
  statusOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalS,
  },
  statusBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalXS,
    height: '36px',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground2,
    cursor: 'pointer',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  statusBtnActive: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
    boxShadow: tokens.shadow2,
    ':hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  dateInput: {
    height: '32px',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase200,
    marginTop: tokens.spacingVerticalXS,
    outlineStyle: 'none',
  },
  learnBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalS,
    height: '40px',
    ...shorthands.padding(0, tokens.spacingHorizontalL),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('none'),
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    textDecorationLine: 'none',
    cursor: 'pointer',
    transitionProperty: 'background-color',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

const statusOptions = [
  { value: CERT_STATUS.NOT_STARTED, label: 'Not Started', icon: '○' },
  { value: CERT_STATUS.IN_PROGRESS, label: 'In Progress', icon: '◐' },
  { value: CERT_STATUS.COMPLETED, label: 'Passed', icon: '✓' },
];

/**
 * A slide-over panel displaying comprehensive details for a specific certification.
 * Built with @fluentui/react-components and makeStyles.
 *
 * @param {Object} props
 * @param {Object} props.cert - The certification data object
 * @param {Object} props.path - The parent path data object
 * @param {Function} props.onClose - Callback to close the detail panel
 */
export default function CertDetail({ cert, path, onClose }) {
  const styles = useStyles();
  const {
    getStatus,
    setStatus,
    toggleCertIgnored,
    isCertIgnored,
    isPathIgnored,
    completionDates,
    setCompletionDate,
  } = useProgressContext();
  const { currency, setCurrency } = useCurrency();
  const { addToast } = useToast();
  const status = getStatus(cert.id);
  const retiring = isRetiring(cert);
  const isRetiredExam = retiring || isRetired(cert);
  const isPathExcluded = isPathIgnored(path.id);
  const certIgnored = !isRetiredExam && isCertIgnored(cert.id);

  const completionDateStr = completionDates?.[cert.id];
  const expires = doesCertExpire(cert.level);

  let expiryDate = null;
  if (expires && completionDateStr) {
    expiryDate = new Date(completionDateStr);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  const levelVariant = {
    Fundamentals: 'fundamentals',
    Associate: 'associate',
    Expert: 'expert',
  }[cert.level] || 'default';

  const prerequisiteFor = getCertificationsRequiring(cert.id);
  const relatedAppliedSkills = useMemo(
    () => getAppliedSkillsForCert(cert.id),
    [cert.id]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
        e.target.isContentEditable
      )
        return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'e' && !isRetiredExam) {
        toggleCertIgnored(cert.id);
        if (certIgnored) {
          addToast(`${cert.examCode} added to tracked learning`);
        } else {
          addToast(`${cert.examCode} removed from tracked learning`);
        }
      } else if (e.key.toLowerCase() === 's') {
        const statuses = [
          CERT_STATUS.NOT_STARTED,
          CERT_STATUS.IN_PROGRESS,
          CERT_STATUS.COMPLETED,
        ];
        const currentIndex = statuses.indexOf(status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const newStatus = statuses[nextIndex];
        setStatus(cert.id, newStatus);

        const statusLabel =
          statusOptions.find((opt) => opt.value === newStatus)?.label ||
          newStatus;
        addToast(`${cert.examCode} marked as ${statusLabel}`);
      } else if (e.key === 'Enter') {
        window.open(cert.learnUrl, '_blank', 'noopener,noreferrer');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onClose,
    cert.id,
    cert.learnUrl,
    cert.examCode,
    status,
    certIgnored,
    isPathExcluded,
    isRetiredExam,
    toggleCertIgnored,
    setStatus,
    addToast,
  ]);

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.panel} id="cert-detail-panel">
        <div
          className={styles.headerStrip}
          style={{ backgroundColor: path.color }}
        />
        <div className={styles.header}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close detail panel"
          >
            <Dismiss20Regular />
          </button>
          <div className={styles.headerContent}>
            <div className={styles.titleRow}>
              <div className={styles.titleText}>
                <h2 className={styles.name}>{cert.name}</h2>
                <span className={styles.examCode}>{cert.examCode}</span>
              </div>
              {getBadgeUrl(cert.level, cert.id) && (
                <img
                  src={getBadgeUrl(cert.level, cert.id)}
                  alt={`${cert.level} Badge`}
                  className={styles.badgeIcon}
                  loading="lazy"
                />
              )}
            </div>
            <div className={styles.badgesRow}>
              <Badge variant={levelVariant} outline>
                {cert.level}
              </Badge>
              {cert.roleData
                ? cert.roleData.map((r, i) => {
                    const RoleIcon = r.icon ? IconMap[r.icon] : null;
                    return (
                      <Badge key={`role-${i}`} color={r.color} outline>
                        {RoleIcon && <RoleIcon size={12} />}
                        Job role: {r.title}
                      </Badge>
                    );
                  })
                : cert.role && (
                    <Badge variant="default" outline>
                      Job role: {cert.role}
                    </Badge>
                  )}
              <Badge color={path.color} outline>
                {path.shortName}
              </Badge>
              {retiring && (
                <Badge variant="retiring" outline>
                  <Warning16Regular />
                  Retiring
                </Badge>
              )}
              {cert.isNew && <Badge variant="new">New</Badge>}
              {cert.isUpdated && <Badge variant="updated">Updated</Badge>}
              {cert.isBeta && (
                <Badge variant="default">
                  {typeof cert.isBeta === 'string' ? cert.isBeta : 'Beta'}
                </Badge>
              )}
              {cert.isComingSoon && <Badge variant="default">Coming soon</Badge>}
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.description}>{cert.description}</p>
          </div>

          {cert.skillsMeasured && cert.skillsMeasured.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Skills Measured</h3>
              <ul className={styles.skillsList}>
                {cert.skillsMeasured.map((skill, index) => (
                  <li key={index} className={styles.skillItem}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Validity & Renewal</h3>
            <div className={styles.validityRow}>
              {cert.level === 'Fundamentals' ? (
                <>
                  <Ribbon20Regular style={{ color: path.color, flexShrink: 0 }} />
                  <span className={styles.description}>
                    This certification does not expire.
                  </span>
                </>
              ) : (
                <>
                  <CalendarLtr20Regular
                    style={{ color: path.color, flexShrink: 0 }}
                  />
                  <span className={styles.description}>
                    Valid for 1 year. Requires a free online renewal assessment
                    every 12 months to maintain active status.
                  </span>
                </>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                Estimated Exam Cost
              </h3>
              <select
                className={styles.currencySelect}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {Object.entries(CURRENCIES).map(([code, data]) => (
                  <option key={code} value={code}>
                    {data.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.costDisplay}>
              <span className={styles.costAmount}>
                {getFormattedExamCost(cert.level, currency)}
              </span>
              <span className={styles.costNote}>
                Standard pricing. Exact cost may vary by specific location and
                applicable taxes.
              </span>
            </div>
          </div>

          {retiring && (
            <div className={mergeClasses(styles.alert, styles.alertWarning)}>
              <Warning16Regular />
              <div>
                <strong>Retirement Notice</strong>
                <p style={{ margin: '4px 0 0' }}>
                  This certification retires on {formatDate(cert.retirementDate)}.
                  Consider transitioning to its replacement.
                </p>
              </div>
            </div>
          )}

          {status === CERT_STATUS.NEEDS_RENEWAL && (
            <div className={mergeClasses(styles.alert, styles.alertDanger)}>
              <Warning16Regular />
              <div>
                <strong>Needs Renewal</strong>
                <p style={{ margin: '4px 0 0' }}>
                  This certification has expired or is nearing expiration. Complete
                  the renewal assessment on Microsoft Learn.
                </p>
                <button
                  type="button"
                  className={styles.renewBtn}
                  onClick={() =>
                    setCompletionDate(cert.id, new Date().toISOString())
                  }
                >
                  <Ribbon20Regular />
                  Mark as Renewed
                </button>
              </div>
            </div>
          )}

          {cert.prerequisites && cert.prerequisites.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Prerequisites</h3>
              <div className={styles.prereqsContainer}>
                {cert.prerequisites.map((preItem, i) => {
                  if (Array.isArray(preItem)) {
                    return (
                      <div key={`group-${i}`} className={styles.prereqGroup}>
                        <div className={styles.prereqGroupLabel}>
                          Requires ONE of the following:
                        </div>
                        {preItem.map((subId) => {
                          const preCertData = getCertById(subId);
                          const preCert = preCertData?.cert;
                          if (!preCert) return null;
                          return (
                            <div key={subId} className={styles.prereqItem}>
                              <span className={styles.prereqName}>
                                {preCert.name}
                              </span>
                              <span className={styles.prereqCode}>
                                {preCert.examCode}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  const preCertData = getCertById(preItem);
                  const preCert = preCertData?.cert;
                  if (!preCert) return null;
                  return (
                    <div key={preItem} className={styles.prereqItem}>
                      <span className={styles.prereqName}>{preCert.name}</span>
                      <span className={styles.prereqCode}>
                        {preCert.examCode}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {cert.recommendedPrereqs && cert.recommendedPrereqs.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Recommended Before Taking</h3>
              <div className={styles.prereqsContainer}>
                {cert.recommendedPrereqs.map((preId) => {
                  const preCertData = getCertById(preId);
                  const preCert = preCertData?.cert;
                  if (!preCert) return null;
                  return (
                    <div key={preId} className={styles.prereqItem}>
                      <span className={styles.prereqName}>{preCert.name}</span>
                      <span className={styles.prereqCode}>
                        {preCert.examCode}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {prerequisiteFor && prerequisiteFor.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Prerequisite For</h3>
              <div className={styles.prereqsContainer}>
                {prerequisiteFor.map((preCert) => (
                  <div key={preCert.id} className={styles.prereqItem}>
                    <span className={styles.prereqName}>{preCert.name}</span>
                    <span className={styles.prereqCode}>
                      {preCert.examCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedAppliedSkills && relatedAppliedSkills.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Hands-on Applied Skills Labs</h3>
              <p className={styles.ignoreHint}>
                Practice scenario-based interactive lab assessments that validate
                objectives for this exam:
              </p>
              <div className={styles.appliedSkillsList}>
                {relatedAppliedSkills.map((skill) => (
                  <a
                    key={skill.id}
                    href={skill.learnUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.appliedSkillItem}
                    title={skill.summary}
                  >
                    <div className={styles.appliedSkillIcon}>
                      <Sparkle16Regular />
                    </div>
                    <div className={styles.appliedSkillContent}>
                      <div className={styles.appliedSkillTitle}>
                        {skill.title}
                      </div>
                      <div className={styles.appliedSkillMeta}>
                        <span>{skill.focus}</span> • <span>{skill.level}</span> •{' '}
                        <span>{skill.duration}</span> • <span>Free</span>
                      </div>
                    </div>
                    <Open16Regular style={{ flexShrink: 0, opacity: 0.6 }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {!isRetiredExam && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Tracking <span className={styles.shortcutHint}>(Press E)</span>
              </h3>
              <div>
                <button
                  type="button"
                  className={mergeClasses(
                    styles.trackBtn,
                    !isCertIgnored(cert.id) && styles.trackBtnTracked
                  )}
                  onClick={() => {
                    const wasTracked = !isCertIgnored(cert.id);
                    toggleCertIgnored(cert.id);
                    if (!wasTracked) {
                      addToast(`${cert.examCode} added to tracked learning`, 'success');
                    } else {
                      addToast(`${cert.examCode} removed from tracked learning`, 'info');
                    }
                  }}
                >
                  {!isCertIgnored(cert.id) ? (
                    <Eye20Regular />
                  ) : (
                    <EyeOff20Regular />
                  )}
                  <span>
                    {!isPathExcluded
                      ? !isCertIgnored(cert.id)
                        ? 'Tracked with Path'
                        : 'Excluded from Path'
                      : !isCertIgnored(cert.id)
                      ? 'Tracked Individually'
                      : 'Not Tracked'}
                  </span>
                </button>
              </div>
              <p className={styles.ignoreHint}>
                {!isPathExcluded
                  ? !isCertIgnored(cert.id)
                    ? `Included in your learning journey as part of ${path.shortName}. Click to exclude.`
                    : `Excluded from your learning journey. Click to include.`
                  : !isCertIgnored(cert.id)
                  ? `Tracked individually in your learning dashboard. Click to untrack.`
                  : `Not currently tracked. Click to track individually in your learning dashboard, or set status below.`}
              </p>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Your Status{' '}
              <span className={styles.shortcutHint}>(Press S to cycle)</span>
            </h3>
            <div className={styles.statusOptions}>
              {statusOptions.map((opt) => {
                const isActive =
                  status === opt.value ||
                  (status === CERT_STATUS.NEEDS_RENEWAL &&
                    opt.value === CERT_STATUS.COMPLETED);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={mergeClasses(
                      styles.statusBtn,
                      isActive && styles.statusBtnActive
                    )}
                    onClick={() => {
                      setStatus(cert.id, opt.value);
                      if (
                        opt.value === CERT_STATUS.COMPLETED &&
                        prerequisiteFor?.length > 0
                      ) {
                        const nextCert = prerequisiteFor.find(
                          (c) => getStatus(c.id) === CERT_STATUS.NOT_STARTED
                        );
                        if (nextCert) {
                          addToast(
                            `🎉 You've unlocked ${nextCert.examCode}!`,
                            'success',
                            {
                              action: {
                                label: 'Start it',
                                onClick: () => {
                                  setStatus(
                                    nextCert.id,
                                    CERT_STATUS.IN_PROGRESS
                                  );
                                  addToast(
                                    `${nextCert.examCode} marked as In Progress`
                                  );
                                },
                              },
                            }
                          );
                          return;
                        }
                      }
                      addToast(`${cert.examCode} marked as ${opt.label}`);
                    }}
                  >
                    <span>{opt.icon}</span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {(status === CERT_STATUS.COMPLETED ||
              status === CERT_STATUS.NEEDS_RENEWAL) && (
              <div style={{ marginTop: '8px' }}>
                <label
                  className={styles.sectionTitle}
                  style={{ fontSize: '11px' }}
                >
                  Completion Date
                </label>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={
                    completionDateStr ? completionDateStr.split('T')[0] : ''
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      setCompletionDate(
                        cert.id,
                        new Date(e.target.value).toISOString()
                      );
                    }
                  }}
                />
                {expiryDate && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--colorNeutralForeground3)',
                      marginTop: '6px',
                    }}
                  >
                    Expires:{' '}
                    <strong>{formatDate(expiryDate.toISOString())}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          <a
            href={cert.learnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.learnBtn}
          >
            <IconMap.Microsoft size={16} />
            View on Microsoft Learn
          </a>
        </div>
      </div>
    </>
  );
}
