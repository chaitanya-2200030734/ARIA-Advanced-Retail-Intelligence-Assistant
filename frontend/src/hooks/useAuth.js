import { useEffect, useState } from 'react'
import { getAuthToken, getUserRole, getCurrentUser } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAuthToken()
        const userRole = getUserRole()

        if (token && userRole) {
          // Fetch user details from backend
          const { data, error } = await getCurrentUser(token)
          
          if (!error && data?.user) {
            setUser({
              id: data.user.id,
              email: data.user.email,
              role: data.user.role,
            })
            setRole(data.user.role)
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('authToken')
            localStorage.removeItem('userRole')
            localStorage.removeItem('userEmail')
            setUser(null)
            setRole(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  return { user, role, loading, isAdmin: role === 'admin' }
}
