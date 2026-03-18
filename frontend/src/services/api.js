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
  getBySlug: (slug) => api.get(`/client-projects/${slug}`),
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
  getAll: (portalId) => api.get(`/daily-logs/portal/${portalId}`),
  create: (portalId, data) => api.post(`/daily-logs`, { ...data, portalId }),
  update: (id, data) => api.put(`/daily-logs/${id}`, data),
  delete: (id) => api.delete(`/daily-logs/${id}`),
}

export const adminTasksApi = {
  getAll: (portalId) => api.get(`/tasks/portal/${portalId}`),
  create: (portalId, data) => api.post(`/tasks`, { ...data, portalId }),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}

export const adminFeedbackApi = {
  getAll: (portalId) => api.get(`/feedback/portal/${portalId}`),
  reply: (id, reply) => api.patch(`/feedback/${id}/reply`, { adminReply: reply }),
}

export const adminBugsApi = {
  getAll: (portalId) => api.get(`/bugs/portal/${portalId}`),
  create: (portalId, data) => api.post(`/bugs`, { ...data, portalId }),
  update: (id, data) => api.put(`/bugs/${id}`, data),
  delete: (id) => api.delete(`/bugs/${id}`),
}

export const adminDocsApi = {
  getAll: (portalId) => api.get(`/documents/portal/${portalId}`),
  upload: (portalId, data) => api.post(`/documents`, { ...data, portalId }),
  delete: (id) => api.delete(`/documents/${id}`),
}

export const adminMeetingsApi = {
  getAll: (portalId) => api.get(`/meetings/portal/${portalId}`),
  create: (portalId, data) => api.post(`/meetings`, { ...data, portalId }),
  update: (id, data) => api.put(`/meetings/${id}`, data),
  delete: (id) => api.delete(`/meetings/${id}`),
}

export const adminReleasesApi = {
  getAll: (portalId) => api.get(`/releases/portal/${portalId}`),
  create: (portalId, data) => api.post(`/releases`, { ...data, portalId }),
  update: (id, data) => api.put(`/releases/${id}`, data),
  delete: (id) => api.delete(`/releases/${id}`),
}

export const adminNotionApi = {
  get: (portalId) => api.get(`/notion/${portalId}`),
  save: (portalId, data) => api.put(`/notion/${portalId}`, data),
  sync: (portalId) => api.post(`/notion/${portalId}/sync`),
}

export const adminSlackApi = {
  get: (portalId) => api.get(`/slack/${portalId}`),
  save: (portalId, data) => api.put(`/slack/${portalId}`, data),
  test: (portalId) => api.post(`/slack/${portalId}/test`),
}
