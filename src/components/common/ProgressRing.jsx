import {
  makeStyles,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: 'rotate(-90deg)',
  },
  bg: {
    fill: 'none',
    stroke: tokens.colorNeutralStroke2,
  },
  fill: {
    fill: 'none',
    strokeLinecap: 'round',
    transitionProperty: 'stroke-dashoffset',
    transitionDuration: '0.8s',
    transitionTimingFunction: tokens.curveDecelerate,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1px',
    pointerEvents: 'none',
  },
  value: {
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1,
  },
  label: {
    fontSize: '8px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1,
  },
});

/**
 * An SVG-based circular progress indicator built with @fluentui/react-components.
 *
 * @param {Object} props
 * @param {number} [props.percent=0] - Completion percentage (0-100)
 * @param {number} [props.size=64] - Diameter of the ring in pixels
 * @param {number} [props.strokeWidth=4] - Width of the progress stroke
 * @param {string} [props.color='var(--line-azure)'] - Color of the filled progress section
 * @param {string} [props.label] - Optional text label displayed below the ring
 * @param {boolean} [props.showPercent=true] - Whether to show the percentage text inside the ring
 * @param {string} [props.className] - Optional container class name
 */
export default function ProgressRing({
  percent = 0,
  size = 64,
  strokeWidth = 4,
  color = 'var(--line-azure)',
  label,
  showPercent = true,
  className,
}) {
  const styles = useStyles();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className={mergeClasses(styles.root, className)}
      style={{ width: size, height: size }}
    >
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className={styles.bg}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.fill}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.content}>
        {showPercent && (
          <span
            className={styles.value}
            style={{ fontSize: Math.max(12, size * 0.25) }}
          >
            {percent}%
          </span>
        )}
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}
