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

// Achievements API
export const achievementsApi = {
  getAll: () => api.get('/achievements'),
  getById: (id) => api.get(`/achievements/${id}`),
  create: (data) => api.post('/achievements', data),
  update: (id, data) => api.put(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
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

// ─── ADMIN API FOR CLIENT PORTALS ─────────────────────────────────────────

export const clientPortalsAdminApi = {
  getAll: () => api.get('/client-portal'),
  create: (data) => api.post('/client-portal', data),
  update: (id, data) => api.put(`/client-portal/${id}`, data),
  delete: (id) => api.delete(`/client-portal/${id}`),
  resetPasskey: (id, passkey) => api.post(`/client-portal/${id}/reset-passkey`, { passkey }),
}

export const adminLogsApi = {
  getAll: (portalId) => api.get(`/daily-logs/${portalId}`),
  create: (portalId, data) => api.post(`/daily-logs/${portalId}`, data),
  update: (id, data) => api.put(`/daily-logs/${id}`, data),
  delete: (id) => api.delete(`/daily-logs/${id}`),
}

export const adminTasksApi = {
  getAll: (portalId) => api.get(`/tasks/${portalId}`),
  create: (portalId, data) => api.post(`/tasks/${portalId}`, data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}

export const adminFeedbackApi = {
  getAll: (portalId) => api.get(`/feedback/${portalId}`),
  reply: (id, reply) => api.post(`/feedback/${id}/reply`, { adminReply: reply }),
}

export const adminBugsApi = {
  getAll: (portalId) => api.get(`/bugs/${portalId}`),
  create: (portalId, data) => api.post(`/bugs/${portalId}`, data),
  update: (id, data) => api.put(`/bugs/${id}`, data),
  delete: (id) => api.delete(`/bugs/${id}`),
}

export const adminDocsApi = {
  getAll: (portalId) => api.get(`/documents/${portalId}`),
  upload: (portalId, data) => api.post(`/documents/${portalId}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
}

export const adminMeetingsApi = {
  getAll: (portalId) => api.get(`/meetings/${portalId}`),
  create: (portalId, data) => api.post(`/meetings/${portalId}`, data),
  update: (id, data) => api.put(`/meetings/${id}`, data),
  delete: (id) => api.delete(`/meetings/${id}`),
}

export const adminReleasesApi = {
  getAll: (portalId) => api.get(`/releases/${portalId}`),
  create: (portalId, data) => api.post(`/releases/${portalId}`, data),
  update: (id, data) => api.put(`/releases/${id}`, data),
  delete: (id) => api.delete(`/releases/${id}`),
}

export const adminNotionApi = {
  save: (portalId, data) => api.post(`/notion/${portalId}`, data),
  sync: (portalId) => api.post(`/notion/${portalId}/sync`),
}

export const adminSlackApi = {
  save: (portalId, data) => api.post(`/slack/${portalId}`, data),
  test: (portalId) => api.post(`/slack/${portalId}/test`),
}
