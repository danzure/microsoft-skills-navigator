import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CERT_STATUS } from '../../data/certificationPaths';
import { IconMap as Icons } from '../common/IconMap';
import Badge from '../common/Badge';

/**
 * SortableCertItem Component
 * 
 * A draggable list item used within the dnd-kit context to display a certification 
 * in the custom career timeline. It supports drag-and-drop reordering, removal, 
 * and displays current tracking status.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.id - The unique identifier used by dnd-kit for sorting.
 * @param {number} props.index - The 0-based index of this item in the list.
 * @param {Object} props.certInfo - The certification data object.
 * @param {string} props.status - The current tracking status of the certification.
 * @param {string} props.statusText - The localized text label for the current status.
 * @param {string} props.nodeClass - The CSS class applied to the timeline node based on status.
 * @param {string} props.badgeClass - The CSS class applied to the status badge based on status.
 * @param {React.ElementType} props.StatusIcon - The icon component to display for the current status.
 * @param {Function} props.onNavigate - Callback to navigate to a path or details page.
 * @param {Function} props.onRemove - Callback to remove this item from the custom timeline.
 * @returns {JSX.Element}
 */
export const SortableCertItem = ({ id, index, certInfo, status, statusText, nodeClass, badgeClass, StatusIcon, onNavigate, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="cpb-timeline-step cpb-timeline-step--sortable">
      <div className="cpb-timeline-indicator">
        <div className={`cpb-timeline-node ${nodeClass}`}>
          {(status === CERT_STATUS.COMPLETED || status === CERT_STATUS.NEEDS_RENEWAL) ? (
            <Icons.Check size={20} />
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
      </div>
      <div 
        className="cpb-timeline-card"
        style={{ '--card-color': certInfo.pathColor }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onNavigate(`/path/${certInfo.pathId}`);
          }
        }}
      >
        <div className="cpb-timeline-card-header">
          <div>
            <div className="cpb-timeline-cert-name">{certInfo.name}</div>
            <div className="cpb-timeline-cert-code">{certInfo.examCode}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <Badge variant={certInfo.level === 'Fundamentals' ? 'fundamentals' : certInfo.level === 'Associate' ? 'associate' : certInfo.level === 'Expert' ? 'expert' : 'default'} small>
                {certInfo.level}
              </Badge>
            </div>
          </div>
          <div className="cpb-timeline-card-actions">
            <div className={`cpb-timeline-badge ${badgeClass}`}>
              <StatusIcon size={12} />
              {statusText}
            </div>
            {onRemove && (
              <button 
                className="cpb-timeline-action-btn cpb-timeline-remove-btn" 
                onClick={(e) => { e.stopPropagation(); onRemove(id); }}
                title="Remove from custom list"
              >
                <Icons.X size={16} />
              </button>
            )}
            <div 
              className="cpb-timeline-action-btn cpb-timeline-drag-handle" 
              {...attributes} 
              {...listeners}
              title="Drag to reorder"
            >
              <Icons.GripVertical size={20} />
            </div>
          </div>
        </div>
        <div className="cpb-timeline-cert-desc" onClick={() => onNavigate(`/path/${certInfo.pathId}`)}>
          {certInfo.description}
        </div>
      </div>
    </div>
  );
};
