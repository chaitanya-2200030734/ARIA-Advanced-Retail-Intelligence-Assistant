import { X } from 'lucide-react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  submitText = 'Save',
  onSubmit,
  isLoading = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-fraunces text-2xl text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-stone hover:text-ink transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">{children}</div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-ink text-ink rounded-lg hover:bg-ink hover:text-cream transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-amber text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition font-medium"
          >
            {isLoading ? 'Saving...' : submitText}
          </button>
        </div>
      </div>
    </div>
  )
}
