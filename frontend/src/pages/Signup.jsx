import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpUser } from '../services/authService'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import Navbar from '../components/layout/Navbar'

export default function Signup() {
  const [accountType, setAccountType] = useState('customer') // 'customer' or 'shop_owner'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error('Full name is required')
      return
    }

    if (!email.trim()) {
      toast.error('Email is required')
      return
    }

    if (!password) {
      toast.error('Password is required')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const { data, error } = await signUpUser(email, password, fullName)

    if (error) {
      toast.error(error.message || 'Failed to create account')
    } else {
      toast.success('Account created! Now you can sign in.')
      // Clear browser history
      window.history.replaceState(null, '', window.location.href)
      navigate('/login')
    }

    setLoading(false)
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <div className="flex min-h-screen pt-16">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 md:order-2 bg-cream flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
              {/* Account Type Selector */}
              <div className="mb-6">
                <h2 className="font-fraunces text-2xl text-ink mb-4">Create your account</h2>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setAccountType('customer')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
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
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      accountType === 'shop_owner'
                        ? 'bg-amber text-white'
                        : 'bg-cream-dark text-stone hover:bg-stone/10'
                    }`}
                  >
                    Shop Owner
                  </button>
                </div>
              </div>

              {/* Customer Signup Form */}
              {accountType === 'customer' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
                  />
                </div>

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
                  <p className="text-xs text-stone mt-1">At least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone hover:text-ink"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber text-white py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition font-medium"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
              ) : (
                <div className="text-center">
                  <p className="text-stone mb-4">Register your shop to start selling!</p>
                  <button
                    onClick={() => navigate('/shop-owner-signup')}
                    className="w-full bg-amber text-white py-2 rounded-lg hover:bg-opacity-90 transition font-medium"
                  >
                    Go to Shop Registration
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-stone text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="text-amber hover:underline font-medium">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden md:flex md:w-1/2 md:order-1 bg-ink flex-col items-center justify-center p-8">
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
      </div>
    </div>
  )
}
