import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchTask, deleteTask } from '../api'
import EditTaskModal from '../components/EditTaskModal'

const STATUS_CLASS = {
  in_progress: 'status-in-progress',
  todo: 'status-todo',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
}

const STATUS_LABEL = {
  in_progress: '▲ IN PROGRESS',
  todo: '○ TO DO',
  completed: '✓ COMPLETED',
  cancelled: '✕ CANCELLED',
}

const PRIORITY_LABEL = {
  high: 'HIGH PRIORITY',
  medium: 'MEDIUM PRIORITY',
  low: 'LOW PRIORITY',
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `${Math.abs(diff)} days overdue`
  if (diff === 0) return 'Due today'
  return `In ${diff} days`
}

const TAGS_BY_PRIORITY = {
  high: ['Priority', 'Urgent'],
  medium: ['Medium', 'Standard'],
  low: ['Low', 'Backlog'],
}

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    loadTask()
  }, [id])

  async function loadTask() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchTask(id)
      setTask(data)
    } catch {
      setError('Task not found or could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    setDeleting(true)
    try {
      await deleteTask(id)
      navigate('/')
    } catch {
      setDeleting(false)
      alert('Failed to delete task.')
    }
  }

  function handleTaskUpdated(updatedTask) {
    setTask(updatedTask)
  }

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-spinner"><div className="spinner" /> Loading task...</div>
    </div>
  )

  if (error) return (
    <div className="page-wrapper">
      <div className="error-banner">{error}</div>
      <Link to="/">← Back to Board</Link>
    </div>
  )

  if (!task) return null

  const priority = (task.priority ?? '').toLowerCase()
  const priorityClass = ['high', 'medium', 'low'].includes(priority) ? priority : 'unknown'
  const statusKey = task.status?.replace('-', '_') ?? 'todo'
  const tags = TAGS_BY_PRIORITY[priority] ?? ['General']
  const progress = task.status === 'completed' ? 100 : task.status === 'in_progress' ? 65 : task.status === 'cancelled' ? 0 : 20

  return (
    <div className="page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">⊞ Board</Link>
        <span>/</span>
        <span>Task #{id}</span>
      </div>

      {/* Title row */}
      <div className="detail-title-row">
        <div>
          <span className="detail-task-id">#{id}</span>
          <span className="detail-title">{task.title}</span>
        </div>
        <div className="detail-actions">
          <button className="btn-back" onClick={() => navigate('/')}>← Back to Board</button>
          <button className="btn-edit" onClick={() => setShowEdit(true)}>✏ Edit Task</button>
          <button className="btn-delete" onClick={handleDelete} disabled={deleting}>
            🗑 {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Status + Priority badges */}
      <div className="detail-badges">
        <span className={`task-priority-badge badge-${priorityClass}`}>
          🚩 {PRIORITY_LABEL[priority] ?? 'PRIORITY UNKNOWN'}
        </span>
        <span className={`status-badge ${STATUS_CLASS[statusKey] ?? 'status-todo'}`}>
          {STATUS_LABEL[statusKey] ?? statusKey.toUpperCase()}
        </span>
      </div>

      {/* Main 2-col layout */}
      <div className="detail-layout">

        {/* Left: description card */}
        <div className="detail-main-card">
          <div className="detail-section-title">
            <span className="detail-section-icon">📄</span>
            Description
          </div>
          <p className="detail-description">
            {task.description || 'No description provided.'}
          </p>

          <div className="detail-placeholder-row">
            <button className="detail-placeholder-btn">📎 Add attachment</button>
            <button className="detail-placeholder-btn">💬 Add comment</button>
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="detail-sidebar">

          {/* Assigned to */}
          <div className="detail-side-card">
            <div className="detail-side-label">ASSIGNED TO</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="navbar-avatar" style={{ width: 38, height: 38, fontSize: '0.9rem' }}>
                {task.title?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Team Member</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {PRIORITY_LABEL[priority] ? priority.charAt(0).toUpperCase() + priority.slice(1) + ' Lead' : 'Unassigned'}
                </div>
              </div>
            </div>

            {task.due_date && (
              <>
                <div className="detail-side-divider" />
                <div className="detail-side-label">DUE DATE</div>
                <div className="due-date-row">
                  <span>🗓</span>
                  <span>{formatDate(task.due_date)}</span>
                </div>
                <div className="due-date-sub">{daysUntil(task.due_date)}</div>
              </>
            )}
          </div>

          {/* Timeline progress */}
          <div className="detail-side-card">
            <div className="detail-side-label">TIMELINE PROGRESS</div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-labels">
              <span>Started {formatDate(task.created_at)}</span>
              <span>{progress}% Done</span>
            </div>
          </div>

          {/* Tags */}
          <div className="detail-side-card">
            <div className="detail-side-label">TAGS</div>
            <div className="tags-row">
              {tags.map((t) => (
                <span key={t} className="tag-chip">{t}</span>
              ))}
              <span className="tag-chip" style={{ textTransform: 'capitalize' }}>
                {task.status?.replace('_', ' ')}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEdit(false)}
          onUpdated={handleTaskUpdated}
        />
      )}
    </div>
  )
}
