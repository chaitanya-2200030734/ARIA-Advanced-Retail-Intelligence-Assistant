import { LayoutDashboard, Package, TrendingUp, Users, Lightbulb, LogOut, Shield, Store } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ onSignOut }) {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const { isAdmin, user } = useAuth()

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/inventory', label: 'Inventory', icon: Package },
    { path: '/admin/sales', label: 'Sales', icon: TrendingUp },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/shop-owners', label: 'Shop Owners', icon: Store },
    { path: '/admin/insights', label: 'Insights', icon: Lightbulb },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen z-30 bg-ink text-cream transition-all duration-300 flex flex-col ${
          expanded ? 'w-56' : 'w-14'
        } shadow-2xl border-r border-amber/20`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-amber/20 bg-ink/80">
          <div className="flex items-center gap-2">
            <h1 className="font-fraunces text-amber italic text-lg">
              {expanded ? 'ARIA' : 'A'}
            </h1>
            {expanded && isAdmin && (
              <span className="text-xs bg-rust text-white px-2 py-1 rounded-full flex items-center gap-1 ml-auto">
                <Shield size={12} />
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition duration-200 ${
                  active
                    ? 'bg-amber/30 border-l-4 border-amber text-amber shadow-md'
                    : 'text-slate-300 hover:text-cream hover:bg-ink-light/40'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {expanded && <span className="text-sm whitespace-nowrap font-medium tracking-wide">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-amber/20 bg-ink/80 p-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${isAdmin ? 'bg-amber' : 'bg-forest'} rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-lg`}>
              {(user?.user_metadata?.full_name?.[0] || user?.email?.[0])?.toUpperCase() || 'U'}
            </div>
            {expanded && (
              <div className="min-w-0">
                <p className="text-xs truncate font-semibold text-cream">{user?.email || 'User'}</p>
                {isAdmin && <p className="text-xs text-amber font-bold tracking-wide">ADMIN</p>}
              </div>
            )}
          </div>
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-amber hover:bg-rust/20 rounded-lg transition text-sm font-medium duration-200"
          >
            <LogOut size={18} />
            {expanded && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav - shown via BottomNav component */}
    </>
  )
}
