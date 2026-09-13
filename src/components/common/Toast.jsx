import { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import {
  CheckmarkCircle20Regular,
  Info20Regular,
  Warning20Regular,
  DismissCircle20Regular,
  Dismiss16Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  toast: {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow16,
    minWidth: '280px',
    maxWidth: '420px',
    boxSizing: 'border-box',
    transitionProperty: 'all',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  toastClosing: {
    transform: 'translateX(100%)',
    opacity: 0,
  },
  iconSuccess: {
    color: tokens.colorPaletteGreenForeground1,
    flexShrink: 0,
  },
  iconError: {
    color: tokens.colorPaletteRedForeground1,
    flexShrink: 0,
  },
  iconWarning: {
    color: tokens.colorPaletteDarkOrangeForeground1,
    flexShrink: 0,
  },
  iconInfo: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  message: {
    flexGrow: 1,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
  actionBtn: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.border('none'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXXS, tokens.spacingHorizontalS),
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer',
    flexShrink: 0,
    transitionProperty: 'background-color',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
  closeBtn: {
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    color: tokens.colorNeutralForeground3,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    ...shorthands.padding(0),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    flexShrink: 0,
    transitionProperty: 'all',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
      color: tokens.colorNeutralForeground1,
    },
  },
});

/**
 * Toast Component
 *
 * Displays a toast notification with status icon, message, optional action button,
 * and close button. Built with @fluentui/react-components.
 *
 * @param {Object} props
 * @param {string} props.message - Notification message text
 * @param {('success'|'info'|'warning'|'error')} [props.type='success'] - Status type
 * @param {Object} [props.action] - Optional action button config
 * @param {string} props.action.label - Action button label
 * @param {Function} props.action.onClick - Action click callback
 * @param {Function} props.onClose - Dismiss callback
 */
export default function Toast({ message, type = 'success', action, onClose }) {
  const styles = useStyles();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const handleAction = () => {
    if (action?.onClick) {
      action.onClick();
    }
    handleClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <DismissCircle20Regular className={styles.iconError} />;
      case 'warning':
        return <Warning20Regular className={styles.iconWarning} />;
      case 'info':
        return <Info20Regular className={styles.iconInfo} />;
      case 'success':
      default:
        return <CheckmarkCircle20Regular className={styles.iconSuccess} />;
    }
  };

  return (
    <div
      className={mergeClasses(
        styles.toast,
        isClosing && styles.toastClosing
      )}
      role="alert"
    >
      {getIcon()}
      <span className={styles.message}>{message}</span>
      {action && (
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleAction}
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        className={styles.closeBtn}
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        <Dismiss16Regular />
      </button>
    </div>
  );
}
