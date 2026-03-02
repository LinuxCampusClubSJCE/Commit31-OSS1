import { TaskCard } from '../components/TaskCard'

const mockTasks = [
  { id: 1, title: 'Design landing page', priority: 'high' },
  { id: 2, title: 'Implement auth', priority: 'medium' },
  { id: 3, title: 'Write tests', priority: 'low' },
  { id: 4, title: 'Fix bugs', priority: 'unknown' },
  { id: 5, title: 'Implement CI/CD', priority: 'critical' },
]

export default function Home() {
  return (
    <div className="home-page">
      <header>
        <h1>Board</h1>
      </header>

      <section>
        {mockTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </section>
    </div>
  )
}
