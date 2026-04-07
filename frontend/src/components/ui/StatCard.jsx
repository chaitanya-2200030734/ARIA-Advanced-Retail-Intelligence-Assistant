export default function StatCard({ icon: Icon, label, value, color, suffix = '' }) {
  const colorClasses = {
    forest: 'text-forest',
    rust: 'text-rust',
    amber: 'text-amber',
    slate: 'text-slate',
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-stone font-medium mb-1">{label}</p>
          <p className={`font-fraunces text-4xl font-bold ${colorClasses[color]}`}>
            {value}
            {suffix && <span className="text-lg">{suffix}</span>}
          </p>
        </div>
        {Icon && <Icon size={28} className={colorClasses[color]} />}
      </div>
    </div>
  )
}
