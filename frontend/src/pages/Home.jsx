import { useEffect, useState } from 'react'

import { TaskCard } from '../components/TaskCard'
import { taskApi } from '../utils/api'

const STATUS_COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await taskApi.list()
        setTasks(Array.isArray(response.data) ? response.data : [])
      } catch {
        setErrorMessage('Unable to load tasks.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  return (
    <div className="home-page">
      <header>
        <h1>Board</h1>
      </header>

      <section className="board-columns">
        {isLoading && <p>Loading tasks...</p>}
        {!isLoading && errorMessage && <p>{errorMessage}</p>}

        {!isLoading && !errorMessage && STATUS_COLUMNS.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.key)

          return (
            <div className="board-column" key={column.key}>
              <h2>{column.label}</h2>

              {columnTasks.length > 0 ? (
                columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <p>No tasks yet.</p>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
