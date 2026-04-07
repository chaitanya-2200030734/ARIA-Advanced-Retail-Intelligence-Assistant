import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import { LogOut, Plus, Package } from 'lucide-react'
import Chatbot from '../components/chatbot/Chatbot'

export default function ShopDashboard() {
  const [shopInfo, setShopInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get shop info from localStorage
    const shopId = localStorage.getItem('shop_id')
    const shopName = localStorage.getItem('shop_name')
    const userEmail = localStorage.getItem('userEmail')

    if (!shopId || !shopName) {
      toast.error('Shop information not found')
      navigate('/login')
      return
    }

    setShopInfo({
      id: shopId,
      name: shopName,
      email: userEmail,
    })
    setLoading(false)
  }, [navigate])

  const handleSignOut = () => {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('shop_id')
      localStorage.removeItem('shop_name')
      
      toast.success('Signed out successfully')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error('Error signing out')
    }
  }

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

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <p className="text-stone">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="bg-cream min-h-screen">
      <Navbar userEmail={shopInfo?.email} onSignOut={handleSignOut} isLoggedIn={true} />
      
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-fraunces text-4xl text-ink mb-2">{shopInfo?.name}</h1>
              <p className="text-stone">Manage your shop and products</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-rust text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => navigate('/add-product')}
              className="bg-amber text-white rounded-lg border border-border p-8 text-center hover:bg-opacity-90 transition shadow-sm"
            >
              <Plus size={48} className="mx-auto mb-4 opacity-80" />
              <h3 className="font-fraunces text-2xl mb-2">Add Product</h3>
              <p className="text-sm opacity-90">Add new products to your shop</p>
            </button>
            <button
              onClick={() => navigate('/shop-manager/products')}
              className="bg-forest text-white rounded-lg border border-border p-8 text-center hover:bg-opacity-90 transition shadow-sm"
            >
              <Package size={48} className="mx-auto mb-4 opacity-80" />
              <h3 className="font-fraunces text-2xl mb-2">Manage Products</h3>
              <p className="text-sm opacity-90">View and edit your products</p>
            </button>
          </div>

          {/* Shop Info */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-border p-6">
              <p className="text-stone text-sm mb-2">Shop ID</p>
              <p className="font-mono text-ink font-medium break-all">{shopInfo?.id}</p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6">
              <p className="text-stone text-sm mb-2">Email</p>
              <p className="text-ink font-medium">{shopInfo?.email}</p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6">
              <p className="text-stone text-sm mb-2">Status</p>
              <p className="text-amber font-medium">✓ Approved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Chatbot pageContext="shopowner" />
    </>
  )
}
