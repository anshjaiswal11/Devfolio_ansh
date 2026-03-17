import axios from 'axios'

const BASE = 'https://devfolio-ansh-server.vercel.app/api'

const clientApi = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach client JWT token
clientApi.interceptors.request.use(config => {
  const token = localStorage.getItem('clientToken')
  if (token) config.headers['x-client-token'] = token
  return config
})

// Handle 401 — redirect to /client access gate
clientApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('clientToken')
      localStorage.removeItem('clientPortal')
      window.location.href = '/client'
    }
    return Promise.reject(err)
  }
)

export default clientApi

export const clientAuthApi = {
  access:  (data) => clientApi.post('/client-auth/access', data),
  me:      ()     => clientApi.get('/client-auth/me'),
}

export const clientPortalApi = {
  getMyPortal: () => clientApi.get('/client-auth/me'),
}

export const dailyLogsApi = {
  getMy: () => clientApi.get('/daily-logs/my'),
}

export const tasksApi = {
  getMy: () => clientApi.get('/tasks/my'),
}

export const feedbackApi = {
  getMy:   () => clientApi.get('/feedback/my'),
  submit:  (data) => clientApi.post('/feedback/my', data),
}

export const bugsApi = {
  getMy: () => clientApi.get('/bugs/my'),
}

export const documentsApi = {
  getMy: () => clientApi.get('/documents/my'),
}

export const timeEntriesApi = {
  getMy: () => clientApi.get('/time-entries/my'),
}

export const meetingsApi = {
  getMy: () => clientApi.get('/meetings/my'),
}

export const releasesApi = {
  getMy: () => clientApi.get('/releases/my'),
}

export const sharedFilesApi = {
  getMy:   ()     => clientApi.get('/shared-files/my'),
  upload:  (data) => clientApi.post('/shared-files/my', data),
}

export const githubApi = {
  getActivity: (username, repo) =>
    clientApi.get(`/github-activity/client/${username}${repo ? `/${repo}` : ''}`),
}

export const notionApi = {
  getConfig: (portalId) => clientApi.get(`/notion/${portalId}`),
}

export const slackApi = {
  getConfig: (portalId) => clientApi.get(`/slack/${portalId}`),
}
