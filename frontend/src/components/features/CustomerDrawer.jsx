import { useState } from 'react'
import { ChevronRight, X } from 'lucide-react'

export default function CustomerDrawer({ customer, isOpen, onClose, history, recommendations }) {
  const [showReco, setShowReco] = useState(false)

  if (!isOpen || !customer) return null

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-ink text-cream p-6 flex items-center justify-between border-b border-ink-light">
          <h2 className="font-fraunces text-2xl">{customer.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-ink-light rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Contact Details */}
          <div>
            <h3 className="font-fraunces text-sm text-amber uppercase mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-stone">Email</p>
                <p className="text-ink">{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <p className="text-stone">Phone</p>
                  <p className="text-ink">{customer.phone}</p>
                </div>
              )}
              <div>
                <p className="text-stone">Member Since</p>
                <p className="text-ink">
                  {new Date(customer.joined_at).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Purchases */}
          <div>
            <p className="text-stone text-sm mb-2">Total Spent</p>
            <p className="font-fraunces text-4xl text-amber">₹{customer.total_purchases}</p>
          </div>

          {/* Purchase History */}
          {history && history.length > 0 && (
            <div>
              <h3 className="font-fraunces text-sm text-amber uppercase mb-4">
                Recent Purchases
              </h3>
              <div className="space-y-2">
                {history.slice(0, 10).map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 bg-cream-dark rounded-lg text-sm"
                  >
                    <div>
                      <p className="text-ink font-medium">{sale.product_name}</p>
                      <p className="text-stone text-xs">
                        {new Date(sale.sale_date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <p className="text-amber font-medium">₹{sale.sale_amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="border-t border-border pt-6">
            <button
              onClick={() => setShowReco(!showReco)}
              className="w-full flex items-center justify-between p-4 bg-forest-pale border border-forest rounded-lg hover:bg-opacity-80 transition"
            >
              <span className="text-forest font-medium">✨ Get AI Recommendations</span>
              <ChevronRight
                size={20}
                className={`text-forest transition ${showReco ? 'rotate-90' : ''}`}
              />
            </button>

            {showReco && recommendations && (
              <div className="mt-4 p-4 bg-forest-pale border border-forest rounded-lg">
                <h4 className="font-fraunces text-sm text-forest mb-3">ARIA Recommends</h4>
                <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
                  {recommendations}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
