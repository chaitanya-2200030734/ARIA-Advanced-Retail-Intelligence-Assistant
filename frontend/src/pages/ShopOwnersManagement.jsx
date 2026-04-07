import { useEffect, useState } from 'react'
import { Check, X, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ShopOwnersManagement() {
  const [shopOwners, setShopOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // 'pending', 'approved', 'rejected'

  useEffect(() => {
    fetchPendingShopOwners()
  }, [])

  const fetchPendingShopOwners = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shop-owner/pending')
      const data = await response.json()
      setShopOwners(data)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to fetch shop owners')
      console.error(error)
      setLoading(false)
    }
  }

  const approveShopOwner = async (shopOwnerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shop-owner/${shopOwnerId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approval_notes: 'Approved by admin',
        }),
      })

      if (response.ok) {
        toast.success('Shop owner approved!')
        fetchPendingShopOwners()
      } else {
        toast.error('Failed to approve')
      }
    } catch (error) {
      toast.error('Error approving shop owner')
      console.error(error)
    }
  }

  const rejectShopOwner = async (shopOwnerId) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      const response = await fetch(`http://localhost:5000/api/shop-owner/${shopOwnerId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejection_reason: reason,
        }),
      })

      if (response.ok) {
        toast.success('Shop owner rejected')
        fetchPendingShopOwners()
      } else {
        toast.error('Failed to reject')
      }
    } catch (error) {
      toast.error('Error rejecting shop owner')
      console.error(error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-fraunces text-3xl text-ink">Shop Owner Registrations</h1>
        <p className="text-stone text-sm mt-1">Review and approve new shop owner registrations</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'pending'
              ? 'bg-amber text-white'
              : 'bg-cream-dark text-stone hover:bg-stone/10'
          }`}
        >
          <Clock size={16} className="inline mr-2" />
          Pending
        </button>
      </div>

      {/* Shop Owners List */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        {shopOwners.length === 0 ? (
          <div className="p-8 text-center text-stone">
            No pending shop owner registrations
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-cream">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Shop Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Owner Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">City</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shopOwners.map((owner) => (
                  <tr key={owner._id} className="border-b border-border hover:bg-cream/50 transition">
                    <td className="px-6 py-4 text-sm text-ink font-medium">{owner.shop_name}</td>
                    <td className="px-6 py-4 text-sm text-stone">{owner.owner_name}</td>
                    <td className="px-6 py-4 text-sm text-stone">{owner.email}</td>
                    <td className="px-6 py-4 text-sm text-stone">{owner.phone}</td>
                    <td className="px-6 py-4 text-sm text-stone">{owner.shop_category}</td>
                    <td className="px-6 py-4 text-sm text-stone">{owner.city}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveShopOwner(owner._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition font-medium text-xs"
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectShopOwner(owner._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rust/10 text-rust rounded hover:bg-rust/20 transition font-medium text-xs"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Section */}
      {shopOwners.length > 0 && (
        <div className="bg-amber/10 border border-amber rounded-lg p-4 text-sm text-amber">
          <p>💡 Click on "Approve" to allow the shop owner to login and manage their shop. Click "Reject" to block their registration.</p>
        </div>
      )}
    </div>
  )
}
