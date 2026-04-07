import { AlertCircle } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  isLoading = false,
  isDanger = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <AlertCircle size={24} className={isDanger ? 'text-rust' : 'text-amber'} />
          </div>
          <div>
            <h2 className="font-fraunces text-xl text-ink mb-2">{title}</h2>
            <p className="text-stone text-sm">{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-ink text-ink rounded-lg hover:bg-ink hover:text-cream transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 ${
              isDanger
                ? 'bg-rust hover:bg-opacity-90'
                : 'bg-amber hover:bg-opacity-90'
            }`}
          >
            {isLoading ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
