import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function AddProduct() {
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'Electronics',
    description: '',
    unit_price: '',
    stock_quantity: '',
    sku: '',
    image_url: '',
  })

  const [loading, setLoading] = useState(false)
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
    if (!formData.product_name.trim()) {
      toast.error('Product name is required')
      return
    }
    if (!formData.unit_price || parseFloat(formData.unit_price) <= 0) {
      toast.error('Valid price is required')
      return
    }
    if (formData.stock_quantity === '' || parseInt(formData.stock_quantity) < 0) {
      toast.error('Valid stock quantity is required')
      return
    }

    setLoading(true)

    try {
      const shop_id = localStorage.getItem('shop_id')
      const shop_name = localStorage.getItem('shop_name')

      const response = await fetch('http://localhost:5000/api/shop-products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_id,
          shop_name,
          product_name: formData.product_name,
          category: formData.category,
          description: formData.description || '',
          unit_price: parseFloat(formData.unit_price),
          stock_quantity: parseInt(formData.stock_quantity),
          sku: formData.sku || `SKU-${Date.now()}`,
          image_url: formData.image_url || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to add product')
      } else {
        toast.success('Product added successfully!')
        setTimeout(() => {
          navigate('/shop-manager/products')
        }, 1500)
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/shop-dashboard')}
            className="flex items-center gap-2 text-amber hover:text-amplitude transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="font-fraunces text-3xl text-ink">Add New Product</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Product Name *</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder='e.g., Samsung 55" 4K TV'
                className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Grocery">Grocery</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="4"
                className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Unit Price (₹) *</label>
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
                />
              </div>
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">SKU (Optional)</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., SKU-12345"
                className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
              <p className="text-xs text-stone mt-1">Leave empty to auto-generate</p>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Image URL (Optional)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber text-white py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition font-medium"
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/shop-dashboard')}
                className="flex-1 border border-border text-ink py-2 rounded-lg hover:bg-cream-dark transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-amber/10 border border-amber rounded-lg p-4 text-sm text-amber">
          <p>💡 Your product will be visible to customers once added. You can edit or delete it anytime.</p>
        </div>
      </div>
    </div>
  )
}
