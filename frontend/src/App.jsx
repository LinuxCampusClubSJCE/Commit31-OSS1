import './App.css'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import HomeDashboard from './pages/HomeDashboard'
import TaskDetails from './pages/TaskDetails'

function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/home'
  const isBoard = location.pathname === '/'

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        <div className="navbar-logo">✓</div>
        Task Manager
      </Link>

      <div className="navbar-links">
        <Link to="/home" className={`navbar-link ${isHome ? 'active' : ''}`}>Home</Link>
        <Link to="/" className={`navbar-link ${isBoard ? 'active' : ''}`}>Board</Link>
        <button className="navbar-bell" aria-label="Notifications">🔔</button>
        <div className="navbar-avatar">U</div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomeDashboard />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
      </Routes>
      <footer className="footer">Powered by Task Manager 2024</footer>
    </>
  )
}
