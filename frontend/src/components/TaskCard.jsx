/** TaskCard - Renders a task with visual differentiation by priority. */
import { Link } from 'react-router-dom'

// Priority to color mapping for urgency-based visual differentiation
const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
}

// Fallback for unexpected priority values
const DEFAULT_COLOR = '#94a3b8'

export function TaskCard({ task }) {
  if (!task || task.id === undefined || task.title === undefined || Object.keys(task).length === 0) return null

  const priority = String(task.priority ?? '').trim().toLowerCase()
  const color = PRIORITY_COLORS[priority] ?? DEFAULT_COLOR

  return (
    <article
      className="task-card"
      style={{
        borderLeft: `10px solid ${color}`,
      }}
    >
      <div className="task-card-header">
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
        <span
          className="task-card-badge"
          style={{
            backgroundColor: `${color}20`,
            color,
            borderColor: color,
          }}
        >
          {priority || 'unknown'}
        </span>
      </div>
    </article>
  )
}
