import axios from 'axios'

const api = axios.create({
  baseURL: 'https://devfolio-ansh-server.vercel.app/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// Projects API
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getBySlug: (slug) => api.get(`/projects/${slug}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}

// Client Projects API
export const clientProjectsApi = {
  getAll: () => api.get('/client-projects'),
  create: (data) => api.post('/client-projects', data),
  update: (id, data) => api.put(`/client-projects/${id}`, data),
  delete: (id) => api.delete(`/client-projects/${id}`),
}

// Blogs API
export const blogsApi = {
  getAll: (all = false) => api.get(`/blogs${all ? '?all=true' : ''}`),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
}

// About API
export const aboutApi = {
  get: () => api.get('/about'),
  update: (data) => api.put('/about', data),
}

// Coding stats API
export const codingApi = {
  getStats: () => api.get('/coding'),
}

// Contact API
export const contactApi = {
  send: (data) => api.post('/contact', data),
}

// Auth API
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  profile: () => api.get('/auth/profile'),
}
