import { useState, useRef } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Dialog,
  DialogSurface,
  Button,
  Text,
} from '@fluentui/react-components';
import {
  Dismiss20Regular,
  ArrowDownload16Regular,
  ArrowUpload16Regular,
  Database20Regular,
  Warning16Regular,
} from '@fluentui/react-icons';
import { useProgressContext } from '../../context/ProgressContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { CURRENCIES } from '../../utils/pricing';

const useStyles = makeStyles({
  dialogSurface: {
    ...shorthands.padding(0),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow28,
    maxWidth: '540px',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  iconBox: {
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
  title: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  body: {
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxHeight: '75vh',
    overflowY: 'auto',
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
  },
  sectionDesc: {
    margin: 0,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalXS,
  },
  currencyGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalXS,
  },
  currencyBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    outlineStyle: 'none',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
    },
    '&:focus-visible': {
      ...shorthands.borderColor(tokens.colorStrokeFocus2),
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: tokens.colorStrokeFocus2,
    },
  },
  currencyBtnActive: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    color: tokens.colorBrandForeground1,
    boxShadow: tokens.shadow2,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  currencySymbol: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    marginBottom: tokens.spacingVerticalXXS,
  },
  currencyLabel: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightMedium,
  },
  dangerSection: {
    ...shorthands.borderTop(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke3),
    paddingTop: tokens.spacingVerticalM,
  },
  dangerCard: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorPaletteRedBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorPaletteRedBackground2),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  dangerTitle: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
  },
  dangerDesc: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    margin: 0,
  },
});

/**
 * DataModal Component
 * 
 * Provides a management modal for exporting/importing certification progress,
 * configuring global currency preference, and resetting data with confirmation.
 * Implemented using @fluentui/react-components Dialog & primitives.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback to close the modal
 */
export default function DataModal({ isOpen, onClose }) {
  const styles = useStyles();
  const { exportProgressJSON, importProgressJSON, resetAll } = useProgressContext();
  const { currency, setCurrency } = useCurrency();
  const { addToast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    exportProgressJSON();
    addToast('Progress backup exported successfully', 'success');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = importProgressJSON(content);
      if (res.success) {
        addToast('Progress restored successfully from backup', 'success');
        onClose();
      } else {
        addToast(`Failed to import backup: ${res.error}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so same file can be re-selected if needed
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetAll();
    setConfirmReset(false);
    addToast('All progress, tracked exams, and custom tracks have been reset', 'info');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(event, data) => {
        if (!data.open) {
          setConfirmReset(false);
          onClose();
        }
      }}
    >
      <DialogSurface className={styles.dialogSurface}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconBox}>
              <Database20Regular />
            </div>
            <h2 className={styles.title} id="data-modal-title">
              Data & Preferences
            </h2>
          </div>
          <Button
            appearance="subtle"
            icon={<Dismiss20Regular />}
            onClick={() => {
              setConfirmReset(false);
              onClose();
            }}
            aria-label="Close dialog"
          />
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Backup & Restore Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Backup & Restore</h3>
            <p className={styles.sectionDesc}>
              Save your progress to a local JSON file or restore from a previous backup.
            </p>
            <div className={styles.actionsRow}>
              <Button
                appearance="primary"
                icon={<ArrowDownload16Regular />}
                onClick={handleExport}
              >
                Export Backup (JSON)
              </Button>
              <Button
                appearance="secondary"
                icon={<ArrowUpload16Regular />}
                onClick={() => fileInputRef.current?.click()}
              >
                Import Backup (JSON)
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Currency Preference Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Global Exam Currency</h3>
            <p className={styles.sectionDesc}>
              Select your preferred display currency for estimated certification exam costs.
            </p>
            <div className={styles.currencyGroup}>
              {Object.entries(CURRENCIES).map(([code, data]) => {
                const isActive = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    className={`${styles.currencyBtn} ${isActive ? styles.currencyBtnActive : ''}`}
                    onClick={() => setCurrency(code)}
                  >
                    <span className={styles.currencySymbol}>{data.symbol}</span>
                    <span className={styles.currencyLabel}>{data.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Section */}
          <div className={`${styles.section} ${styles.dangerSection}`}>
            <div className={styles.dangerCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Warning16Regular />
                <Text className={styles.dangerTitle}>Reset Progress</Text>
              </div>
              <p className={styles.dangerDesc}>
                Clear all certification completion statuses, dates, tracked exams, and your custom career track.
              </p>
              <div className={styles.actionsRow}>
                <Button
                  appearance={confirmReset ? 'primary' : 'secondary'}
                  icon={<Warning16Regular />}
                  onClick={handleReset}
                >
                  {confirmReset ? 'Confirm Reset: Clear All Progress' : 'Reset All Progress'}
                </Button>
                {confirmReset && (
                  <Button
                    appearance="subtle"
                    onClick={() => setConfirmReset(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogSurface>
    </Dialog>
  );
}
