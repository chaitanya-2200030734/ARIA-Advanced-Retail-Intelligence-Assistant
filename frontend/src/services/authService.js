const API_URL = 'http://localhost:5000/api'

// Sign up with email and password
export const signUpUser = async (email, password, fullName) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed')
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userRole', data.user.role)
      localStorage.setItem('userEmail', data.user.email)
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: { message: error.message } }
  }
}

// Sign in user
export const signInUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userRole', data.user.role)
      localStorage.setItem('userEmail', data.user.email)
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: { message: error.message } }
  }
}

// Get current user info
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user')
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: { message: error.message } }
  }
}

// Sign out user
export const signOutUser = async () => {
  try {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    return { error: null }
  } catch (error) {
    return { error }
  }
}

// Helper to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

// Helper to get user role
export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'user'
}

// Helper to check if admin
export const isAdmin = () => {
  return getUserRole() === 'admin'
}
