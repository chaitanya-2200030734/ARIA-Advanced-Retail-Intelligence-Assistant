import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInUser } from '../services/authService'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import Navbar from '../components/layout/Navbar'

export default function Login() {
  const [accountType, setAccountType] = useState('customer') // 'customer' or 'shop_owner'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }

    if (!password) {
      toast.error('Password is required')
      return
    }

    setLoading(true)

    try {
      if (accountType === 'customer') {
        // Customer/Admin login
        const { data, error } = await signInUser(email, password)

        if (error) {
          toast.error(error.message || 'Failed to sign in')
        } else {
          toast.success('Signed in successfully!')
          // Check user role from localStorage
          const userRole = localStorage.getItem('userRole')
          
          // Clear browser history to prevent back navigation
          window.history.replaceState(null, '', window.location.href)
          
          if (userRole === 'admin') {
            navigate('/admin')
          } else {
            navigate('/dashboard')
          }
        }
      } else {
        // Shop Owner login
        const response = await fetch('http://localhost:5000/api/shop-owner/login', {
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
          toast.error(data.error || 'Failed to sign in')
        } else {
          toast.success('Signed in successfully!')
          localStorage.setItem('authToken', data.authToken)
          localStorage.setItem('userRole', data.userRole)
          localStorage.setItem('userEmail', data.userEmail)
          localStorage.setItem('shop_id', data.shop_id)
          localStorage.setItem('shop_name', data.shop_name)
          
          // Clear browser history to prevent back navigation
          window.history.replaceState(null, '', window.location.href)
          
          navigate('/shop-dashboard')
        }
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <div className="flex min-h-screen pt-16">
        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 bg-ink flex-col items-center justify-center p-8">
        <h1 className="font-fraunces text-amber italic text-4xl mb-3">ARIA</h1>
        <p className="text-cream text-center mb-12 text-sm">Your store. Understood.</p>
        <div className="space-y-4 mb-12">
          <div className="bg-cream-dark/20 text-cream text-sm px-4 py-2 rounded-lg text-center">
            Voice-powered AI
          </div>
          <div className="bg-cream-dark/20 text-cream text-sm px-4 py-2 rounded-lg text-center">
            Live inventory intelligence
          </div>
          <div className="bg-cream-dark/20 text-cream text-sm px-4 py-2 rounded-lg text-center">
            Instant sales insights
          </div>
        </div>
        <p className="text-stone text-xs text-center">Powered by Groq · LLaMA 3.3 70B</p>
      </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-cream flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
              <h2 className="font-fraunces text-2xl text-ink mb-1">Sign in to your dashboard</h2>
              
              {/* Account Type Selector */}
              <div className="flex gap-2 mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setAccountType('customer')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                    accountType === 'customer'
                      ? 'bg-amber text-white'
                      : 'bg-cream-dark text-stone hover:bg-stone/10'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('shop_owner')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                    accountType === 'shop_owner'
                      ? 'bg-amber text-white'
                      : 'bg-cream-dark text-stone hover:bg-stone/10'
                  }`}
                >
                  Shop Owner
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Email address</label>
                  <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone hover:text-ink"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber text-white py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition font-medium"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-stone text-sm">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-amber hover:underline font-medium">
                    Create one
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
