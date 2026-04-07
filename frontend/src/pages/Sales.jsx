import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import StatCard from '../components/ui/StatCard'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import SalesChart from '../components/features/SalesChart'
import Modal from '../components/ui/Modal'
import { getSales, getTodaySales, getSalesForecast, createSale } from '../services/api'

export default function Sales() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    todayRevenue: 0,
    weekRevenue: 0,
    totalTransactions: 0,
    avgOrderValue: 0,
  })
  const [chartData, setChartData] = useState([])
  const [forecast, setForecast] = useState(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSale, setNewSale] = useState({
    product_name: '',
    category: '',
    customer_name: '',
    quantity_sold: 1,
    sale_amount: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [todaySales, allSales] = await Promise.all([getTodaySales(), getSales()])

    if (todaySales && allSales) {
      const todayRevenue = todaySales.reduce((sum, s) => sum + parseFloat(s.sale_amount || 0), 0)

      // Last 7 days
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

      const weekRevenue = Object.values(last7Days).reduce((a, b) => a + b, 0)
      const totalRevenue = allSales.reduce((sum, s) => sum + parseFloat(s.sale_amount || 0), 0)

      const chartData = Object.entries(last7Days)
        .reverse()
        .map(([date, total]) => ({
          label: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          value: Math.round(total),
        }))

      setStats({
        todayRevenue,
        weekRevenue,
        totalTransactions: allSales.length,
        avgOrderValue: totalRevenue / (allSales.length || 1),
      })
      setChartData(chartData)
    }

    setLoading(false)
  }

  const handleGenerateForecast = async () => {
    setForecastLoading(true)
    const result = await getSalesForecast()
    if (result) {
      setForecast(result)
    } else {
      toast.error('Failed to generate forecast')
    }
    setForecastLoading(false)
  }

  const handleAddSale = async () => {
    if (!newSale.product_name.trim() || !newSale.customer_name.trim()) {
      toast.error('All fields are required')
      return
    }

    setIsSubmitting(true)
    const result = await createSale(newSale)

    if (result) {
      toast.success('Sale recorded')
      setIsModalOpen(false)
      setNewSale({
        product_name: '',
        category: '',
        customer_name: '',
        quantity_sold: 1,
        sale_amount: 0,
      })
      fetchData()
    } else {
      toast.error('Failed to record sale')
    }
    setIsSubmitting(false)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-fraunces text-3xl text-ink">Sales Analytics</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-medium"
        >
          + Record Sale
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue"
          value={Math.round(stats.todayRevenue)}
          color="amber"
          suffix=" ₹"
        />
        <StatCard
          label="This Week"
          value={Math.round(stats.weekRevenue)}
          color="forest"
          suffix=" ₹"
        />
        <StatCard
          label="Total Transactions"
          value={stats.totalTransactions}
          color="slate"
        />
        <StatCard
          label="Avg Order Value"
          value={Math.round(stats.avgOrderValue)}
          color="amber"
          suffix=" ₹"
        />
      </div>

      {/* Charts */}
      <SalesChart
        chartType="bar"
        title="Revenue — Last 7 Days"
        data={chartData}
      />

      {/* Forecast */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-fraunces text-lg text-ink">AI Sales Forecast</h3>
          <button
            onClick={handleGenerateForecast}
            disabled={forecastLoading}
            className="flex items-center gap-2 px-4 py-2 bg-amber text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition text-sm font-medium"
          >
            <Sparkles size={16} />
            {forecastLoading ? 'Generating...' : 'Generate Forecast'}
          </button>
        </div>

        {forecast && (
          <div className="p-4 bg-amber-pale border-l-4 border-amber rounded-lg">
            <h4 className="font-fraunces text-amber italic mb-3">ARIA's Forecast</h4>
            <p className="text-sm text-ink leading-relaxed">{forecast}</p>
          </div>
        )}

        {!forecast && (
          <p className="text-stone text-sm text-center py-8">
            Click "Generate Forecast" to see AI-powered sales predictions for next week
          </p>
        )}
      </div>

      {/* Add Sale Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Sale"
        submitText="Record Sale"
        onSubmit={handleAddSale}
        isLoading={isSubmitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Product Name *</label>
            <input
              type="text"
              value={newSale.product_name}
              onChange={(e) => setNewSale({ ...newSale, product_name: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Category</label>
            <select
              value={newSale.category}
              onChange={(e) => setNewSale({ ...newSale, category: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Grocery">Grocery</option>
              <option value="Home Appliances">Home Appliances</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Customer Name *</label>
            <input
              type="text"
              value={newSale.customer_name}
              onChange={(e) => setNewSale({ ...newSale, customer_name: e.target.value })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Quantity</label>
            <input
              type="number"
              value={newSale.quantity_sold}
              onChange={(e) => setNewSale({ ...newSale, quantity_sold: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Amount ₹ *</label>
            <input
              type="number"
              step="0.01"
              value={newSale.sale_amount}
              onChange={(e) => setNewSale({ ...newSale, sale_amount: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-cream-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
