import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchTasks } from '../api'

export default function HomeDashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const todo = tasks.filter((t) => t.status === 'todo').length
  const overdue = tasks.filter((t) => {
    if (!t.due_date) return false
    return new Date(t.due_date) < new Date() && t.status !== 'completed'
  }).length

  const recentTasks = [...tasks].slice(0, 5)

  const stats = [
    { label: 'Total Tasks', value: total, icon: '📋', color: 'var(--primary)' },
    { label: 'In Progress', value: inProgress, icon: '▲', color: '#f59e0b' },
    { label: 'Completed', value: completed, icon: '✓', color: '#10b981' },
    { label: 'Overdue', value: overdue, icon: '⚠', color: '#ef4444' },
  ]

  return (
    <div className="page-wrapper">
      {/* Welcome banner */}
      <div className="home-hero">
        <div className="home-hero-text">
          <h1>Welcome back 👋</h1>
          <p>Here's an overview of your workspace. Stay on top of your tasks and deadlines.</p>
        </div>
        <Link to="/" className="btn-new-task">Go to Board →</Link>
      </div>

      {/* Stat cards */}
      <div className="home-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="home-stat-card">
            <div className="home-stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="home-stat-value" style={{ color: s.color }}>
              {loading ? '—' : s.value}
            </div>
            <div className="home-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent tasks */}
      <div className="home-section">
        <div className="home-section-header">
          <h2>Recent Tasks</h2>
          <Link to="/" className="home-see-all">See all →</Link>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /> Loading...</div>
        ) : recentTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No tasks yet</h3>
            <p>Head over to the <Link to="/">Board</Link> to create your first task.</p>
          </div>
        ) : (
          <div className="home-recent-list">
            {recentTasks.map((task) => {
              const statusColors = {
                completed: '#10b981',
                in_progress: '#f59e0b',
                todo: 'var(--primary)',
                cancelled: '#6b7280',
              }
              const statusLabels = {
                completed: '✓ Completed',
                in_progress: '▲ In Progress',
                todo: '○ To Do',
                cancelled: '✕ Cancelled',
              }
              const color = statusColors[task.status] ?? 'var(--primary)'
              return (
                <Link key={task.id} to={`/tasks/${task.id}`} className="home-recent-item">
                  <div className="home-recent-dot" style={{ background: color }} />
                  <div className="home-recent-info">
                    <div className="home-recent-title">{task.title}</div>
                    <div className="home-recent-meta">
                      <span style={{ color }}>{statusLabels[task.status] ?? task.status}</span>
                      {task.priority && <span>· {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>}
                      {task.due_date && <span>· Due {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                    </div>
                  </div>
                  <span className="task-card-arrow">›</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="home-section">
        <div className="home-section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="home-quick-grid">
          <Link to="/" className="home-quick-card">
            <span className="home-quick-icon">📋</span>
            <span>View Board</span>
          </Link>
          <div
            className="home-quick-card"
            onClick={() => window.dispatchEvent(new CustomEvent('open-create-modal'))}
            style={{ cursor: 'pointer' }}
          >
            <span className="home-quick-icon">➕</span>
            <span>New Task</span>
          </div>
          <Link to="/" className="home-quick-card">
            <span className="home-quick-icon">🔍</span>
            <span>Search Tasks</span>
          </Link>
          <Link to="/" className="home-quick-card">
            <span className="home-quick-icon">📊</span>
            <span>Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
