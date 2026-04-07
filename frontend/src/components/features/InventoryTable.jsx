import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import ConfirmDialog from '../ui/ConfirmDialog'
import Badge from '../ui/Badge'
import toast from 'react-hot-toast'
import { updateInventory, deleteInventory } from '../../services/api'

export default function InventoryTable({
  items,
  onRefresh,
  searchTerm,
  categoryFilter,
  statusFilter,
}) {
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [editData, setEditData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Filter items
  let filtered = items

  if (searchTerm) {
    filtered = filtered.filter((item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (categoryFilter !== 'All') {
    filtered = filtered.filter((item) => item.category === categoryFilter)
  }

  if (statusFilter === 'OK') {
    filtered = filtered.filter((item) => item.stock_quantity > item.reorder_level)
  } else if (statusFilter === 'Low Stock') {
    filtered = filtered.filter((item) => item.stock_quantity <= item.reorder_level)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setEditData(item)
  }

  const handleSaveEdit = async () => {
    if (!editData.product_name.trim()) {
      toast.error('Product name is required')
      return
    }

    setIsLoading(true)
    const success = await updateInventory(editingId, editData)

    if (success) {
      toast.success('Item updated')
      setEditingId(null)
      onRefresh()
    } else {
      toast.error('Failed to update item')
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const success = await deleteInventory(deleteId)

    if (success) {
      toast.success('Item deleted')
      setDeleteId(null)
      onRefresh()
    } else {
      toast.error('Failed to delete item')
    }
    setIsLoading(false)
  }

  const getStatus = (item) => {
    return item.stock_quantity <= item.reorder_level ? 'LOW' : 'OK'
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream-dark">
                <th className="px-6 py-4 text-left font-semibold text-ink">Product Name</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Category</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Stock Qty</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Unit Price</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Reorder Level</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-ink">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isLowStock = item.stock_quantity <= item.reorder_level
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-border hover:bg-cream-dark transition ${
                      isLowStock ? 'bg-rust-pale' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-ink font-medium">{item.product_name}</td>
                    <td className="px-6 py-4 text-stone">{item.category}</td>
                    <td className="px-6 py-4 text-ink">{item.stock_quantity}</td>
                    <td className="px-6 py-4 text-ink">₹{item.unit_price}</td>
                    <td className="px-6 py-4 text-ink">{item.reorder_level}</td>
                    <td className="px-6 py-4">
                      <Badge status={getStatus(item)} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-amber hover:text-opacity-70 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="text-rust hover:text-opacity-70 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone">No items found</p>
        </div>
      )}

      <p className="text-xs text-stone mt-4 font-mono">
        Showing {filtered.length} of {items.length} items
      </p>

      {/* Edit Modal */}
      <Modal
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        title="Edit Item"
        submitText="Update Item"
        onSubmit={handleSaveEdit}
        isLoading={isLoading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Product Name</label>
            <input
              type="text"
              value={editData.product_name || ''}
              onChange={(e) => setEditData({ ...editData, product_name: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Category</label>
            <select
              value={editData.category || ''}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
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
              value={editData.stock_quantity || 0}
              onChange={(e) => setEditData({ ...editData, stock_quantity: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Unit Price ₹</label>
            <input
              type="number"
              step="0.01"
              value={editData.unit_price || 0}
              onChange={(e) => setEditData({ ...editData, unit_price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Reorder Level</label>
            <input
              type="number"
              value={editData.reorder_level || 0}
              onChange={(e) => setEditData({ ...editData, reorder_level: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Item"
        message={`Delete "${items.find((i) => i.id === deleteId)?.product_name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isLoading}
        isDanger={true}
      />
    </>
  )
}
