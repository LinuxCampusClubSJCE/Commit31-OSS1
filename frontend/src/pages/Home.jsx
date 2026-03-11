import { useState, useEffect } from 'react'
import { fetchTasks } from '../api'
import { TaskCard } from '../components/TaskCard'
import CreateTaskModal from '../components/CreateTaskModal'

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchTasks()
      setTasks(data)
    } catch (err) {
      setError('Could not connect to backend. Make sure the server is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  function handleTaskCreated(newTask) {
    setTasks((prev) => [newTask, ...prev])
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="board-header">
        <div className="board-title">
          <h1>Board</h1>
          <p>Manage and track your team's progress</p>
        </div>
        <button id="btn-new-task" className="btn-new-task" onClick={() => setShowModal(true)}>
          + New Task
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-banner">⚠ {error}</div>}

      {/* Loading */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner" />
          Loading tasks...
        </div>
      )}

      {/* Task list */}
      {!loading && !error && (
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No tasks yet</h3>
              <p>Click "+ New Task" to create your first task.</p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  )
}
