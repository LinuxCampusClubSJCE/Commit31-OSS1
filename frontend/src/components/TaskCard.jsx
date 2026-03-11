import { useNavigate } from 'react-router-dom'

const PRIORITY_LABEL = {
  high: 'HIGH PRIORITY',
  medium: 'MEDIUM PRIORITY',
  low: 'LOW PRIORITY',
}

const AVATAR_COLORS = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#0ea5e9,#6366f1)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#10b981,#0ea5e9)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
]

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function TaskCard({ task }) {
  const navigate = useNavigate()
  const priority = (task.priority ?? '').toLowerCase()
  const priorityClass = ['high', 'medium', 'low'].includes(priority) ? priority : 'unknown'
  const badgeLabel = PRIORITY_LABEL[priority] ?? 'PRIORITY UNKNOWN'
  const avatarGradient = AVATAR_COLORS[task.id % AVATAR_COLORS.length]

  return (
    <article
      className={`task-card priority-${priorityClass}`}
      onClick={() => navigate(`/tasks/${task.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/tasks/${task.id}`)}
    >
      <div className="task-card-left">
        <div className="task-card-top">
          <span className={`task-priority-badge badge-${priorityClass}`}>{badgeLabel}</span>
          <span className="task-id-label">#{task.id ? `TM-${String(task.id).padStart(3, '0')}` : ''}</span>
        </div>
        <div className="task-card-title">{task.title}</div>
        <div className="task-card-meta">
          {task.due_date && (
            <span>🗓 {formatDate(task.due_date)}</span>
          )}
          {task.created_at && !task.due_date && (
            <span>🗓 {formatDate(task.created_at)}</span>
          )}
          {task.description && (
            <span>💬 {task.description.length}</span>
          )}
        </div>
      </div>

      <div className="task-card-right">
        <div className="task-assignee-avatar" style={{ background: avatarGradient }}>
          {task.title?.charAt(0).toUpperCase()}
        </div>
        <span className="task-card-arrow">›</span>
      </div>
    </article>
  )
}
