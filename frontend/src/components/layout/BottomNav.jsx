import { LayoutDashboard, Package, TrendingUp, Users, Lightbulb } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/inventory', label: 'Inventory', icon: Package },
    { path: '/admin/sales', label: 'Sales', icon: TrendingUp },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/insights', label: 'Insights', icon: Lightbulb },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
      <div className="w-full flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-3 relative transition ${
                active ? 'text-amber' : 'text-stone hover:text-ink'
              }`}
            >
              <Icon size={22} />
              {active && <div className="absolute bottom-0 w-1 h-1 bg-amber rounded-full"></div>}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
