import { Link } from 'react-router-dom'

const mockTasks = [
  { id: 1, title: 'Design landing page' },
  { id: 2, title: 'Implement auth' },
  { id: 3, title: 'Write tests' },
]

export default function Home() {
  return (
    <div className="home-page">
      <header>
        <h1>Board</h1>
      </header>

      <section>
        <ul>
          {mockTasks.map((t) => (
            <li key={t.id}>
              <Link to={`/tasks/${t.id}`}>{t.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
