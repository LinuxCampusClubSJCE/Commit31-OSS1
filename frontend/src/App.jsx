import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import TaskDetails from './pages/TaskDetails'

export default function App() {
  return (
    <div className="app-root">
      <nav className="top-nav">
        <Link to="/">Home</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </main>
    </div>
  )
}
