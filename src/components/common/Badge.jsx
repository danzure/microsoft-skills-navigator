import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXXS),
    ...shorthands.padding('0', tokens.spacingHorizontalXS),
    height: '24px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase100,
    whiteSpace: 'nowrap',
    ...shorthands.border(tokens.strokeWidthThin, 'solid', 'transparent'),
    boxSizing: 'border-box',
    userSelect: 'none',
  },
  small: {
    height: '20px',
    ...shorthands.padding('0', tokens.spacingHorizontalXXS),
    fontSize: tokens.fontSizeBase100,
  },
  outline: {
    backgroundColor: 'transparent !important',
  },
  default: {
    backgroundColor: 'var(--badge-default-bg, var(--colorNeutralBackground3))',
    color: 'var(--badge-default-fg, var(--colorNeutralForeground2))',
    ...shorthands.borderColor('var(--badge-default-border, var(--colorNeutralStroke2))'),
  },
  fundamentals: {
    backgroundColor: 'var(--badge-fundamentals-bg, #edf5fa)',
    color: 'var(--badge-fundamentals-fg, #0078d4)',
    ...shorthands.borderColor('var(--badge-fundamentals-border, #cce4f7)'),
  },
  associate: {
    backgroundColor: 'var(--badge-associate-bg, #eff6fc)',
    color: 'var(--badge-associate-fg, #106ebe)',
    ...shorthands.borderColor('var(--badge-associate-border, #c7e0f4)'),
  },
  expert: {
    backgroundColor: 'var(--badge-expert-bg, #f3f0f8)',
    color: 'var(--badge-expert-fg, #773adc)',
    ...shorthands.borderColor('var(--badge-expert-border, #d8cced)'),
  },
  retiring: {
    backgroundColor: 'var(--badge-retiring-bg, #fdf6ec)',
    color: 'var(--badge-retiring-fg, #b25b00)',
    ...shorthands.borderColor('var(--badge-retiring-border, #f8d7a4)'),
  },
  completed: {
    backgroundColor: 'var(--badge-completed-bg, #eaf6ec)',
    color: 'var(--badge-completed-fg, #107c41)',
    ...shorthands.borderColor('var(--badge-completed-border, #bce3c5)'),
  },
  inProgress: {
    backgroundColor: 'var(--badge-inprogress-bg, #eff6fc)',
    color: 'var(--badge-inprogress-fg, #0078d4)',
    ...shorthands.borderColor('var(--badge-inprogress-border, #c7e0f4)'),
  },
  new: {
    backgroundColor: 'var(--badge-new-bg, #eaf6ec)',
    color: 'var(--badge-new-fg, #0e703c)',
    ...shorthands.borderColor('var(--badge-new-border, #a3d9b1)'),
  },
  updated: {
    backgroundColor: 'var(--badge-updated-bg, #eff6fc)',
    color: 'var(--badge-updated-fg, #0f6cbd)',
    ...shorthands.borderColor('var(--badge-updated-border, #b4d6fa)'),
  },
  beta: {
    backgroundColor: 'var(--badge-beta-bg, #f5f0fb)',
    color: 'var(--badge-beta-fg, #6b21a8)',
    ...shorthands.borderColor('var(--badge-beta-border, #ddd0f5)'),
  },
  technical: {
    backgroundColor: 'var(--badge-technical-bg, #eef4fb)',
    color: 'var(--badge-technical-fg, #095c9e)',
    ...shorthands.borderColor('var(--badge-technical-border, #bcd7f5)'),
  },
  business: {
    backgroundColor: 'var(--badge-business-bg, #f4effa)',
    color: 'var(--badge-business-fg, #7026b0)',
    ...shorthands.borderColor('var(--badge-business-border, #ddcbf5)'),
  },
});

/**
 * A reusable Badge component for displaying small labels like certification paths or levels.
 * Powered by @fluentui/react-components and makeStyles.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The badge content
 * @param {string} [props.variant='default'] - Predefined style variant
 * @param {string} [props.color] - Custom theme color overriding the variant
 * @param {boolean} [props.small=false] - If true, renders a smaller badge
 * @param {boolean} [props.outline=false] - If true, renders with an outline instead of solid background
 * @param {string} [props.className] - Optional additional CSS class name
 */
export default function Badge({
  children,
  variant = 'default',
  color,
  small = false,
  outline = false,
  className,
}) {
  const styles = useStyles();

  // Map variant name to style key
  const variantKey = variant === 'in-progress' ? 'inProgress' : variant;
  const variantClass = styles[variantKey] || styles.default;

  const dynamicStyle = color
    ? {
        backgroundColor: outline
          ? 'transparent'
          : `color-mix(in srgb, ${color} 15%, transparent)`,
        color: color,
        borderColor: color,
      }
    : undefined;

  return (
    <span
      className={mergeClasses(
        styles.root,
        variantClass,
        small && styles.small,
        outline && styles.outline,
        className
      )}
      style={dynamicStyle}
    >
      {children}
    </span>
  );
}
