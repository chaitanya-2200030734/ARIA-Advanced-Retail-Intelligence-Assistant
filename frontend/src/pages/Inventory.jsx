import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import Modal from '../components/ui/Modal'
import InventoryTable from '../components/features/InventoryTable'
import { getInventory, createInventory } from '../services/api'

export default function Inventory() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [newItem, setNewItem] = useState({
    product_name: '',
    category: '',
    stock_quantity: 0,
    unit_price: 0,
    reorder_level: 10,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const data = await getInventory()
    if (data) {
      setItems(data)
    }
    setLoading(false)
  }

  const handleAddItem = async () => {
    if (!newItem.product_name.trim()) {
      toast.error('Product name is required')
      return
    }
    if (!newItem.category) {
      toast.error('Category is required')
      return
    }

    setIsSubmitting(true)
    const result = await createInventory(newItem)

    if (result) {
      toast.success('Item added to inventory')
      setIsModalOpen(false)
      setNewItem({
        product_name: '',
        category: '',
        stock_quantity: 0,
        unit_price: 0,
        reorder_level: 10,
      })
      fetchItems()
    } else {
      toast.error('Failed to add item')
    }
    setIsSubmitting(false)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-fraunces text-3xl text-ink">Inventory Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-medium"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-border space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Grocery</option>
            <option>Home Appliances</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
          >
            <option>All</option>
            <option>OK</option>
            <option>Low Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <InventoryTable
        items={items}
        onRefresh={fetchItems}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
      />

      {/* Add Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Item"
        submitText="Add Item"
        onSubmit={handleAddItem}
        isLoading={isSubmitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Product Name *</label>
            <input
              type="text"
              value={newItem.product_name}
              onChange={(e) => setNewItem({ ...newItem, product_name: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Category *</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Grocery">Grocery</option>
              <option value="Home Appliances">Home Appliances</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Stock Quantity</label>
            <input
              type="number"
              value={newItem.stock_quantity}
              onChange={(e) => setNewItem({ ...newItem, stock_quantity: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Unit Price ₹</label>
            <input
              type="number"
              step="0.01"
              value={newItem.unit_price}
              onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Reorder Level</label>
            <input
              type="number"
              value={newItem.reorder_level}
              onChange={(e) => setNewItem({ ...newItem, reorder_level: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
