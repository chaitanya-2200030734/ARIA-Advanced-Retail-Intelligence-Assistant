import { useEffect, useState } from 'react'
import { Package, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import SalesChart from '../components/features/SalesChart'
import { useAuth } from '../hooks/useAuth'
import { getInventory, getLowStock, getTodaySales, getSales, getCustomers } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    todayRevenue: 0,
    totalCustomers: 0,
  })
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [inventory, lowStock, todaySales, allSales, customers] = await Promise.all([
        getInventory(),
        getLowStock(),
        getTodaySales(),
        getSales(),
        getCustomers(),
      ])

      if (inventory && lowStock && todaySales && allSales && customers) {
        // Calculate today's revenue
        const todayRevenue = todaySales.reduce((sum, s) => sum + parseFloat(s.sale_amount || 0), 0)

        // Get last 7 days sales
        const last7Days = {}
        const today = new Date()
        for (let i = 0; i < 7; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateKey = date.toISOString().split('T')[0]
          last7Days[dateKey] = 0
        }

        allSales.forEach((sale) => {
          const saleDate = new Date(sale.sale_date).toISOString().split('T')[0]
          if (last7Days.hasOwnProperty(saleDate)) {
            last7Days[saleDate] += parseFloat(sale.sale_amount || 0)
          }
        })

        const chartData = Object.entries(last7Days)
          .reverse()
          .map(([date, total]) => ({
            label: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            value: Math.round(total),
          }))

        // Get top 5 products
        const productMap = {}
        allSales.forEach((sale) => {
          if (!productMap[sale.product_name]) {
            productMap[sale.product_name] = {
              name: sale.product_name,
              category: sale.category,
              qty: 0,
              revenue: 0,
            }
          }
          productMap[sale.product_name].qty += sale.quantity_sold || 0
          productMap[sale.product_name].revenue += parseFloat(sale.sale_amount || 0)
        })

        const top5 = Object.values(productMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        setStats({
          totalProducts: inventory.length,
          lowStockCount: lowStock.length,
          todayRevenue,
          totalCustomers: customers.length,
        })
        setSalesData(chartData)
        setTopProducts(top5)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const userName = user?.email?.split('@')[0] || 'Admin'

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-fraunces text-3xl text-ink">
          {greeting}, {userName} 👋
        </h1>
        <p className="text-stone text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}Real-time store analytics
        </p>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockCount > 0 && (
        <div className="bg-amber-pale border-l-4 border-rust p-4 rounded-lg">
          <p className="text-rust text-sm">
            ⚠️ {stats.lowStockCount} items are running low on stock — check inventory
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          color="forest"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={stats.lowStockCount}
          color="rust"
        />
        <StatCard
          icon={TrendingUp}
          label="Today's Revenue"
          value={Math.round(stats.todayRevenue)}
          color="amber"
          suffix=" ₹"
        />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} color="slate" />
      </div>

      {/* Sales Chart */}
      <SalesChart
        chartType="bar"
        title="Revenue — Last 7 Days"
        data={salesData}
      />

      {/* Top 5 Products */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="font-fraunces text-lg text-ink mb-4">Top 5 Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-stone">Rank</th>
                  <th className="px-4 py-3 text-left text-stone">Product</th>
                  <th className="px-4 py-3 text-left text-stone">Category</th>
                  <th className="px-4 py-3 text-left text-stone">Units Sold</th>
                  <th className="px-4 py-3 text-left text-stone">Revenue ₹</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-cream-dark">
                    <td className={`px-4 py-3 font-bold ${idx === 0 ? 'text-amber text-lg' : 'text-ink'}`}>
                      #{idx + 1}
                    </td>
                    <td className="px-4 py-3 text-ink">{product.name}</td>
                    <td className="px-4 py-3 text-stone">{product.category}</td>
                    <td className="px-4 py-3 text-ink">{product.qty}</td>
                    <td className="px-4 py-3 text-amber font-medium">₹{product.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
