import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'

export default function ShopOwnerSignup() {
  const [formData, setFormData] = useState({
    shop_name: '',
    owner_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    shop_address: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    shop_category: 'Electronics',
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.shop_name.trim()) {
      toast.error('Shop name is required')
      return
    }
    if (!formData.owner_name.trim()) {
      toast.error('Owner name is required')
      return
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return
    }
    if (!formData.phone.trim()) {
      toast.error('Phone is required')
      return
    }
    if (!formData.shop_address.trim()) {
      toast.error('Shop address is required')
      return
    }
    if (!formData.city.trim()) {
      toast.error('City is required')
      return
    }
    if (!formData.state.trim()) {
      toast.error('State is required')
      return
    }
    if (!formData.pincode.trim()) {
      toast.error('Pincode is required')
      return
    }
    if (!formData.password) {
      toast.error('Password is required')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/shop-owner/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_name: formData.shop_name,
          owner_name: formData.owner_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          shop_address: formData.shop_address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          gst_number: formData.gst_number,
          shop_category: formData.shop_category,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Registration failed')
      } else {
        toast.success('Registration submitted! Awaiting admin approval.')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
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
              Manage your shop
            </div>
            <div className="bg-cream-dark/20 text-cream text-sm px-4 py-2 rounded-lg text-center">
              Upload your products
            </div>
            <div className="bg-cream-dark/20 text-cream text-sm px-4 py-2 rounded-lg text-center">
              Reach customers nationwide
            </div>
          </div>
          <p className="text-stone text-xs text-center">Powered by Groq · LLaMA 3.3 70B</p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-cream flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
              <h2 className="font-fraunces text-2xl text-ink mb-1">Register Your Shop</h2>
              <p className="text-stone text-sm mb-6">Join ARIA and manage your store</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Shop Name *</label>
                  <input
                    type="text"
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleChange}
                    placeholder="Your Shop Name"
                    className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                  />
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Owner Name *</label>
                  <input
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="shop@example.com"
                    className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Shop Address */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Shop Address *</label>
                  <input
                    type="text"
                    name="shop_address"
                    value={formData.shop_address}
                    onChange={handleChange}
                    placeholder="Street address"
                    className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                  />
                </div>

                {/* City, State, Pincode Row */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-2 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-2 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6 digits"
                      className="w-full px-2 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-xs"
                    />
                  </div>
                </div>

                {/* GST Number */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">GST Number (Optional)</label>
                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleChange}
                    placeholder="15-character GST number"
                    className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                  />
                </div>

                {/* Shop Category */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Shop Category *</label>
                  <select
                    name="shop_category"
                    value={formData.shop_category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber text-sm"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber text-white py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition font-medium text-sm mt-4"
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>

              <div className="mt-4 text-center text-sm">
                <p className="text-stone">
                  Already have an account?{' '}
                  <a href="/login" className="text-amber hover:underline font-medium">
                    Sign In
                  </a>
                </p>
              </div>

              <div className="mt-4 p-3 bg-amber/10 border border-amber rounded text-xs text-amber">
                ℹ️ Your registration will be reviewed by our admin team. You'll receive confirmation within 24 hours.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
