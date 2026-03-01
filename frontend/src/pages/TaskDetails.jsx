import { useParams, Link } from 'react-router-dom'

export default function TaskDetails() {
  const { id } = useParams()

  return (
    <div className="task-details">
      <header>
        <h2>Task Details</h2>
      </header>

      <section>
        <p>Viewing task ID: <strong>{id}</strong></p>
        <p>This is a placeholder view for a single task.</p>
        <Link to="/">Back to board</Link>
      </section>
    </div>
  )
}
