import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingCart, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar({ userEmail, onSignOut, isLoggedIn, onCartOpen }) {
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) return
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
      } catch {
        setCartCount(0)
      }
    }
    updateCount()
    window.addEventListener('storage', updateCount)
    const interval = setInterval(updateCount, 1000)
    return () => {
      window.removeEventListener('storage', updateCount)
      clearInterval(interval)
    }
  }, [isLoggedIn])

  // User dashboard navbar
  if (isLoggedIn && userEmail) {
    return (
      <nav className="sticky top-0 bg-white border-b border-border z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="font-fraunces text-amber italic text-2xl">ARIA</h1>
            <p className="text-stone text-sm font-medium hidden sm:block">Store</p>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-ink font-medium">{userEmail?.split('@')[0]}</p>
              <p className="text-xs text-stone">{userEmail}</p>
            </div>

            {/* Cart button with count badge */}
            {onCartOpen && (
              <button
                onClick={onCartOpen}
                className="relative p-2 hover:bg-amber/10 rounded-lg transition"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} className="text-ink" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-4 py-2 text-rust hover:bg-rust-pale rounded-lg transition font-medium text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    )
  }

  // Landing page navbar
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-border z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
        >
          <h1 className="font-fraunces text-amber italic text-2xl">ARIA</h1>
          <p className="text-stone text-sm hidden sm:block font-medium">Retail Intelligence</p>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="text-stone hover:text-ink transition font-medium text-sm"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-stone hover:text-ink transition font-medium text-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-amber text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-medium text-sm flex items-center gap-2"
          >
            Sign Up <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </nav>
  )
}
