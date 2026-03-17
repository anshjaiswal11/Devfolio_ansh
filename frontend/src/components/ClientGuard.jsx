import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { clientAuthApi } from '../services/clientApi'

export default function ClientGuard({ children }) {
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('clientToken')
    if (!token) {
      setLoading(false)
      return
    }

    clientAuthApi.me()
      .then(res => {
        localStorage.setItem('clientPortal', JSON.stringify(res.data))
        setAuth(true)
      })
      .catch(() => {
        localStorage.removeItem('clientToken')
        localStorage.removeItem('clientPortal')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d14' }}><div style={{ fontSize: 32 }}>⏳</div></div>
  }

  if (!auth) {
    return <Navigate to="/client" replace />
  }

  return children
}
