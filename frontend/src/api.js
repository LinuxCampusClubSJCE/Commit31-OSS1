const API_BASE = 'http://localhost:8000/api/v1/tasks'

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/`)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function fetchTask(id) {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) throw new Error('Task not found')
  return res.json()
}

export async function createTask(data) {
  const res = await fetch(`${API_BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create task')
  return res.json()
}

export async function updateTask(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update task')
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete task')
}
