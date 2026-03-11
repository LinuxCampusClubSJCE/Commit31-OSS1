import { useState } from 'react'
import { updateTask } from '../api'

const PRIORITIES = ['low', 'medium', 'high']
const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function EditTaskModal({ task, onClose, onUpdated }) {
  const [title, setTitle] = useState(task.title ?? '')
  const [description, setDescription] = useState(task.description ?? '')
  const [dueDate, setDueDate] = useState(task.due_date ?? '')
  const [priority, setPriority] = useState(task.priority ?? 'medium')
  const [status, setStatus] = useState(task.status ?? 'todo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      const updated = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority: priority || null,
        due_date: dueDate || null,
      })
      onUpdated(updated)
      onClose()
    } catch {
      setError('Failed to update task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
        <div className="modal-header">
          <div>
            <h2 id="edit-modal-title">Edit Task</h2>
            <p>Update the details for <strong>#{task.id}</strong>.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-task-title">Task Title</label>
            <input
              id="edit-task-title"
              type="text"
              placeholder="e.g. Design system update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-desc">Description</label>
            <textarea
              id="edit-task-desc"
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-due">Due Date</label>
            <input
              id="edit-task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-status">Status</label>
            <select
              id="edit-task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <div className="priority-toggle" role="group">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={priority === p ? 'selected' : ''}
                  onClick={() => setPriority(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-create" disabled={!title.trim() || loading}>
              {loading ? 'Saving...' : '✓ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
