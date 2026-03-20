import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.BACKEND_API_BASE_URL,
})

export const taskApi = {
  list() {
    return api.get('/api/v1/tasks')
  },
}

export default api
