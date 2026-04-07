import getEnvVars from '../config/constants'

const API_URL = getEnvVars.apiUrl

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

    return { data, error: null }
  } catch (error) {
    return { data: null, error: { message: error.message } }
  }
}

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

    return { data, error: null }
  } catch (error) {
    return { data: null, error: { message: error.message } }
  }
}

export const getCurrentUser = async token => {
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

export const signOutUser = async () => {
  try {
    return { error: null }
  } catch (error) {
    return { error: { message: error.message } }
  }
}
