import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import Modal from '../components/ui/Modal'
import CustomerDrawer from '../components/features/CustomerDrawer'
import { getCustomers, getCustomerById, getCustomerReco, createCustomer } from '../services/api'

export default function Customers() {
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerHistory, setCustomerHistory] = useState([])
  const [customerReco, setCustomerReco] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    const data = await getCustomers()
    if (data) {
      setCustomers(data)
    }
    setLoading(false)
  }

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer)
    const data = await getCustomerById(customer.id)
    if (data) {
      setCustomerHistory(data.purchaseHistory || [])
      const reco = await getCustomerReco(customer.id)
      setCustomerReco(reco)
    }
    setIsDrawerOpen(true)
  }

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim() || !newCustomer.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    setIsSubmitting(true)
    const result = await createCustomer(newCustomer)

    if (result) {
      toast.success('Customer added')
      setIsModalOpen(false)
      setNewCustomer({ name: '', email: '', phone: '' })
      fetchCustomers()
    } else {
      toast.error('Failed to add customer')
    }
    setIsSubmitting(false)
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-3xl text-ink">Customers</h1>
          <p className="text-stone text-sm mt-1">{customers.length} customers in store</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-medium"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
      />

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream-dark">
                <th className="px-6 py-4 text-left font-semibold text-ink">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Phone</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Total Purchases ₹</th>
                <th className="px-6 py-4 text-left font-semibold text-ink">Member Since</th>
                <th className="px-6 py-4 text-center font-semibold text-ink">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-border hover:bg-cream-dark transition cursor-pointer">
                  <td className="px-6 py-4 text-ink font-medium">{customer.name}</td>
                  <td className="px-6 py-4 text-stone">{customer.email}</td>
                  <td className="px-6 py-4 text-stone">{customer.phone || '-'}</td>
                  <td className="px-6 py-4 text-amber font-medium">₹{customer.total_purchases}</td>
                  <td className="px-6 py-4 text-stone">
                    {new Date(customer.joined_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleSelectCustomer(customer)}
                      className="text-amber hover:text-opacity-70 font-medium transition text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone">No customers found</p>
        </div>
      )}

      {/* Customer Drawer */}
      <CustomerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        customer={selectedCustomer}
        history={customerHistory}
        recommendations={customerReco}
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
        submitText="Add Customer"
        onSubmit={handleAddCustomer}
        isLoading={isSubmitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Full Name *</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Email *</label>
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Phone</label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
