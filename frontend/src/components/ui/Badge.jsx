export default function Badge({ status }) {
  if (status === 'OK') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-forest-pale text-forest border border-forest-light">
        OK
      </span>
    )
  }

  if (status === 'LOW') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rust-pale text-rust border border-rust-light">
        LOW
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-pale text-slate border border-slate-light">
      {status}
    </span>
  )
}
