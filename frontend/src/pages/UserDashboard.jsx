import { useEffect, useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, Package, DollarSign } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getInventory, createSale } from '../services/api'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import toast from 'react-hot-toast'

export default function UserDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const inventory = await getInventory()
      if (inventory) {
        setProducts(inventory)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product) => {
    if (product.stock_quantity <= 0) {
      toast.error('Out of stock')
      return
    }
    
    const existingItem = cart.find(item => item._id === product._id)
    if (existingItem) {
      if (existingItem.quantity < product.stock_quantity) {
        updateCartQuantity(product._id, existingItem.quantity + 1)
      } else {
        toast.error('Cannot add more than available stock')
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
      toast.success('Added to cart')
    }
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId))
    toast.success('Removed from cart')
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      // Create a sale for each cart item
      for (const item of cart) {
        await createSale({
          product_name: item.product_name,
          category: item.category,
          quantity_sold: item.quantity,
          sale_amount: item.unit_price * item.quantity,
          sale_date: new Date().toISOString(),
          customer_name: user?.email?.split('@')[0] || 'Customer'
        })
      }

      toast.success(`Order placed! Total: ₹${cartTotal.toLocaleString('en-IN')}`)
      setCart([])
      localStorage.removeItem('cart')
      setShowCart(false)
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    }
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Header */}
      <div>
        <h1 className="font-fraunces text-3xl text-ink">Welcome, {user?.email?.split('@')[0]}</h1>
        <p className="text-stone text-sm mt-1">Browse and shop from our inventory</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Product Browsing - Full width if no cart, 2/3 if cart open */}
        <div className={`${showCart ? 'lg:col-span-2' : 'lg:col-span-4'} space-y-4`}>
          {/* Search and Filter */}
          <div className="bg-white rounded-lg border border-border p-4 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative px-3 py-2 bg-amber text-white font-medium rounded-lg hover:bg-amber-dark transition flex items-center gap-2 whitespace-nowrap"
              >
                <ShoppingCart size={18} />
                ({cartCount})
              </button>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1 rounded-full whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-amber text-white'
                      : 'bg-cream border border-border text-ink hover:bg-cream-dark'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product._id} className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-md transition">
                {/* Product Image Placeholder */}
                <div className="bg-gradient-to-br from-amber-pale to-cream h-40 flex items-center justify-center">
                  <Package size={48} className="text-amber opacity-50" />
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-fraunces text-ink font-semibold">{product.product_name}</h3>
                    <p className="text-xs text-stone mt-1">{product.category}</p>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber font-bold text-lg">₹{product.unit_price.toLocaleString('en-IN')}</p>
                      <p className={`text-xs ${product.stock_quantity > 0 ? 'text-forest' : 'text-rust'}`}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock_quantity <= 0}
                    className="w-full px-3 py-2 bg-ink text-cream rounded-lg hover:bg-ink-dark transition disabled:bg-stone disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-stone opacity-50 mb-4" />
              <p className="text-stone font-medium">No products found</p>
            </div>
          )}
        </div>

        {/* Side Cart */}
        {showCart && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-border p-6 sticky top-20 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <h2 className="font-fraunces text-xl text-ink flex items-center gap-2">
                <ShoppingCart size={24} />
                Shopping Cart
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={40} className="mx-auto text-stone opacity-30 mb-2" />
                  <p className="text-stone">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 border-b border-border pb-4">
                    {cart.map(item => (
                      <div key={item._id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-ink">{item.product_name}</p>
                            <p className="text-xs text-stone">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-rust hover:bg-rust-pale p-1 rounded transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-cream rounded-lg">
                            <button
                              onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                              className="p-1 hover:bg-amber-pale rounded transition"
                            >
                              <Minus size={14} className="text-ink" />
                            </button>
                            <span className="px-2 font-medium text-ink">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                              className="p-1 hover:bg-amber-pale rounded transition"
                            >
                              <Plus size={14} className="text-ink" />
                            </button>
                          </div>
                          <p className="font-semibold text-amber">
                            ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-stone text-sm">
                      <span>Subtotal:</span>
                      <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-stone text-sm">
                      <span>Shipping:</span>
                      <span>FREE</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-ink">
                      <span>Total:</span>
                      <span className="text-lg text-amber">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full px-4 py-3 bg-forest text-white font-semibold rounded-lg hover:bg-forest-dark transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={cart.length === 0}
                    >
                      <DollarSign size={20} />
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
