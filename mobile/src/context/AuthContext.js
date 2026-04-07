import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as authService from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  // Initialize auth on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const userRole = await AsyncStorage.getItem('userRole')
        const userEmail = await AsyncStorage.getItem('userEmail')

        if (token && userRole && userEmail) {
          setToken(token)
          setRole(userRole)
          setUser({ email: userEmail })
        }
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await authService.signInUser(email, password)

      if (error) {
        return { error: error.message }
      }

      if (data?.token) {
        setToken(data.token)
        setUser({ email: data.user.email, id: data.user.id })
        setRole(data.user.role)
        
        await AsyncStorage.setItem('authToken', data.token)
        await AsyncStorage.setItem('userRole', data.user.role)
        await AsyncStorage.setItem('userEmail', data.user.email)

        return { success: true, user: data.user }
      }
    } catch (error) {
      return { error: 'Login failed' }
    }
  }

  const signup = async (email, password, fullName) => {
    try {
      const { data, error } = await authService.signUpUser(email, password, fullName)

      if (error) {
        return { error: error.message }
      }

      if (data?.token) {
        setToken(data.token)
        setUser({ email: data.user.email, id: data.user.id })
        setRole(data.user.role)

        await AsyncStorage.setItem('authToken', data.token)
        await AsyncStorage.setItem('userRole', data.user.role)
        await AsyncStorage.setItem('userEmail', data.user.email)

        return { success: true, user: data.user }
      }
    } catch (error) {
      return { error: 'Signup failed' }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken')
      await AsyncStorage.removeItem('userRole')
      await AsyncStorage.removeItem('userEmail')
      setUser(null)
      setRole(null)
      setToken(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    role,
    token,
    loading,
    login,
    signup,
    logout,
    isAdmin: role === 'admin',
    isUser: role === 'user',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
