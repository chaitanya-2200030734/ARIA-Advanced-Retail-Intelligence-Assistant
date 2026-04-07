import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Chatbot from '../chatbot/Chatbot'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { Shield } from 'lucide-react'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

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
      
      toast.success('Signed out successfully')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-start">
      <Sidebar onSignOut={handleSignOut} />
      <main className="flex-1 ml-14 md:ml-56 w-full md:w-auto">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-40 shadow-sm">
          <h1 className="font-fraunces text-2xl text-ink">Admin Dashboard</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <p className="text-sm text-stone">{user?.email}</p>
              {isAdmin && (
                <div className="flex items-center gap-1 px-3 py-1 bg-rust/10 border border-rust rounded-full">
                  <Shield size={14} className="text-rust" />
                  <span className="text-xs font-semibold text-rust">Admin</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-amber hover:text-opacity-80 transition font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
      <Chatbot />
    </div>
  )
}
