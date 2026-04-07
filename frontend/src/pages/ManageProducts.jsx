import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react'

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const shop_id = localStorage.getItem('shop_id')
      
      if (!shop_id) {
        toast.error('Shop ID not found')
        navigate('/shop-dashboard')
        return
      }

      const response = await fetch(`http://localhost:5000/api/shop-products/shop/${shop_id}`)
      const data = await response.json()

      if (response.ok) {
        setProducts(data)
      } else {
        toast.error('Failed to fetch products')
      }
      setLoading(false)
    } catch (error) {
      toast.error('Network error')
      console.error(error)
      setLoading(false)
    }
  }

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/shop-products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Network error')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream p-6 flex items-center justify-center">
        <p className="text-stone">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/shop-dashboard')}
              className="flex items-center gap-2 text-amber hover:text-amplitude transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-fraunces text-3xl text-ink">Manage Products</h1>
          </div>
          <button
            onClick={() => navigate('/add-product')}
            className="flex items-center gap-2 bg-amber text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <p className="text-stone mb-4">No products added yet</p>
            <button
              onClick={() => navigate('/add-product')}
              className="bg-amber text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-medium inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-cream">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Product Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Price (₹)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-border hover:bg-cream/50 transition">
                      <td className="px-6 py-4 text-sm text-ink font-medium">{product.product_name}</td>
                      <td className="px-6 py-4 text-sm text-stone">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-ink font-medium">₹{product.unit_price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock_quantity > 10
                            ? 'bg-green-100 text-green-700'
                            : product.stock_quantity > 0
                            ? 'bg-amber/20 text-amber'
                            : 'bg-rust/10 text-rust'
                        }`}>
                          {product.stock_quantity} {product.stock_quantity === 1 ? 'item' : 'items'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-stone/10 text-stone'
                        }`}>
                          {product.status === 'active' ? '✓ Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/edit-product/${product._id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-medium text-xs"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rust/10 text-rust rounded hover:bg-rust/20 transition font-medium text-xs"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats */}
        {products.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <p className="text-stone text-sm mb-2">Total Products</p>
              <p className="font-fraunces text-3xl text-ink">{products.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <p className="text-stone text-sm mb-2">Total Stock</p>
              <p className="font-fraunces text-3xl text-ink">
                {products.reduce((sum, p) => sum + p.stock_quantity, 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <p className="text-stone text-sm mb-2">Active Products</p>
              <p className="font-fraunces text-3xl text-amber">
                {products.filter((p) => p.status === 'active').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
