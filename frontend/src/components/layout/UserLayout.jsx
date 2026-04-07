import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Chatbot from '../chatbot/Chatbot'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function UserLayout() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Prevent back button navigation
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    
    const handlePopState = (e) => {
      e.preventDefault()
      window.history.pushState(null, '', window.location.href)
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleSignOut = () => {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('cart')
      
      toast.success('Signed out successfully')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar userEmail={user?.email} onSignOut={handleSignOut} isLoggedIn={true} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <Chatbot />
    </div>
  )
}
